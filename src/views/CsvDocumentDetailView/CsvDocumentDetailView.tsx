// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ChangeEvent, useState} from 'react';
import Optional from "optional-js";
import {useAtomValue, useSetAtom} from "jotai";
import {useParams} from "react-router-dom";
import {DataTableHeader, Loading, Select, SelectItem} from "@carbon/react";

import {
    predictionRecordFilterAtom,
    selectedCsvPredictionsLoadable,
    selectedCsvRecordsLoadable,
    selectedDocumentIdAtom,
    selectedDocumentLoadable,
    selectedPredictionAtom,
    selectedPredictionRecordsLoadable
} from "../../atoms";
import {DataTable, SimpleTable, TableRow} from "../../components";
import {
    CsvDocumentModel,
    CsvDocumentRecordModel,
    CsvPredictionModel, CsvPredictionRecordFilter, CsvPredictionRecordFilterValues,
    CsvPredictionResultModel,
} from "../../models";
import {first} from "../../utils";
import {CsvUpdatedDocumentAddView} from "../CsvUpdatedDocumentAddView";
import {PerformanceSummaryView} from "../PerformanceSummaryView";

export interface CsvDocumentDetailViewProps {
}

const LoadableLoading: React.FunctionComponent = () => (<Loading active={true} id="loading-selected-document" small={false} withOverlay={false} className=""></Loading>)
const LoadableError: React.FunctionComponent<{text?: string}> = ({text}: {text?: string}) => (<div>{text || 'Error loading document'}</div>)

export const CsvDocumentDetailView: React.FunctionComponent<CsvDocumentDetailViewProps> = () => {
    const {id} = useParams();

    const loadable = useAtomValue(selectedDocumentLoadable)
    const setSelectedDocumentId = useSetAtom(selectedDocumentIdAtom)

    if (loadable.state === 'loading') {
        return (<LoadableLoading />)
    } else if (loadable.state === 'hasError') {
        return (<LoadableError />)
    }

    const csvDocument: CsvDocumentModel = loadable.data
    if (!csvDocument || csvDocument.id !== id) {
        setSelectedDocumentId(id)
        return (<LoadableLoading />)
    }

    return (<CsvDocumentDetailViewInternal document={csvDocument}></CsvDocumentDetailViewInternal>)
}

interface CsvDocumentDetailViewInternalProps {
    document: CsvDocumentModel;
}

const CsvDocumentDetailViewInternal: React.FunctionComponent<CsvDocumentDetailViewInternalProps> = ({document}: CsvDocumentDetailViewInternalProps) => {

    const documentSummary: TableRow[] = [
        {label: 'Name:', value: document.name},
        {label: 'Description:', value: document.description},
        {label: 'Original document:', value: (<a href={document.originalUrl}>Download</a>)}
    ]

    return (<div>
        <div style={{width: '600px', margin: '0 auto', paddingBottom: '20px'}}>
            <SimpleTable rows={documentSummary} />
        </div>
        <PredictionSummaryView document={document} />
    </div>)
}

interface PredictionSummaryViewProps {
    document: CsvDocumentModel;
}

const PredictionSummaryView: React.FunctionComponent<PredictionSummaryViewProps> = ({document}: PredictionSummaryViewProps) => {

    const loadablePredictions = useAtomValue(selectedCsvPredictionsLoadable)
    const loadableResults = useAtomValue(selectedCsvRecordsLoadable)
    const [showAddModal, setShowAddModal] = useState(false)
    const [predictionId, setPredictionId] = useState('')
    const setSelectedPrediction = useSetAtom(selectedPredictionAtom)

    if (loadableResults.state === 'loading') {
        return (<LoadableLoading />)
    } else if (loadableResults.state === 'hasError') {
        return (<LoadableError text="Error loading records" />)
    }

    if (loadablePredictions.state === 'loading') {
        return (<LoadableLoading />)
    } else if (loadablePredictions.state === 'hasError') {
        return (<LoadableError text="Error loading predictions" />)
    }

    const showUpdate = (data: CsvPredictionModel) => {
        setPredictionId(data.id)
        setShowAddModal(true)
    }

    const predictions: CsvPredictionModel[] = loadablePredictions.data

    const rowData = predictions.map(csvPredictionToRow(showUpdate))

    const headerData: DataTableHeader[] = [{
        key: 'date',
        header: 'Date'
    }, {
        key: 'model',
        header: 'Model'
    }, {
        key: 'predictionUrl',
        header: 'Download'
    }, {
        key: 'totalCount',
        header: 'Record count'
    }, {
        key: 'confidenceThreshold',
        header: 'Threshold'
    }, {
        key: 'performanceSummary',
        header: 'Performance'
    }, {
        key: 'upload',
        header: 'Upload updates'
    }]

    const setSelectedPredictionId = (id: string) => {
        const prediction: Optional<CsvPredictionModel> = first(predictions.filter(val => val.id === id))

        prediction.ifPresentOrElse(
            setSelectedPrediction,
            () => {
                console.log('Matching prediction not found: ' + id)
            }
        )
    }

    const handleOnNewDocument = () => {
        setShowAddModal(false)
    }

    return (<div>
        <CsvUpdatedDocumentAddView
            show={showAddModal}
            documentId={document.id}
            predictionId={predictionId}
            onNewDocument={handleOnNewDocument} />
        <DataTable
            headerData={headerData}
            rowData={rowData}
            onRowClick={setSelectedPredictionId}
        />
        <PredictionDetailView documents={loadableResults.data} show={!showAddModal} />
    </div>)
}

const csvPredictionToRow = (uploadHandler: (data: CsvPredictionModel) => void) => {
    return (data: CsvPredictionModel) => {
        return Object.assign(
            {},
            data,
            {
                date: parseISOString(data.date).toDateString(),
                predictionUrl: (<a href={data.predictionUrl}>download</a>),
                totalCount: data.performanceSummary.totalCount,
                confidenceThreshold: (data.performanceSummary.confidenceThreshold * 100) + '%',
                performanceSummary: (<PerformanceSummaryView data={data.performanceSummary} />),
                upload: (<a onClick={() => uploadHandler(data)}>upload updates</a>)
            }
        )
    }
}

const parseISOString = (s: string) => {
    const b: string[] = s.split(/\D+/);

    return new Date(Date.UTC(Number(b[0]), Number(b[1]) - 1, Number(b[2]), Number(b[3]), Number(b[4]), Number(b[5]), Number(b[6])));
}

interface PredictionDetailViewProps {
    documents: CsvDocumentRecordModel[];
    show: boolean;
}

const PredictionDetailView: React.FunctionComponent<PredictionDetailViewProps> = ({documents, show}: PredictionDetailViewProps = {documents: [], show: true}) => {

    const loadable = useAtomValue(selectedPredictionRecordsLoadable)
    const prediction = useAtomValue(selectedPredictionAtom)
    const filter = useAtomValue(predictionRecordFilterAtom)
    const setFilter = useSetAtom(predictionRecordFilterAtom)

    if (!show) {
        return (<></>)
    }

    if (loadable.state === 'loading') {
        return (<LoadableLoading />)
    } else if (loadable.state === 'hasError') {
        return (<LoadableError text="Error loading prediction records"/>)
    } else if (documents.length === 0 || loadable.data.length === 0) {
        return (<></>)
    }

    const headerData: DataTableHeader[] = Object.keys(documents[0].data)
        .filter(val => val !== 'id' && val !== 'documentId' && val !== 'providedValue')
        .map(key => ({key, header: key}))
        .concat([
            {header: 'Prediction', key: 'predictionValue'},
            {header: 'Confidence', key: 'confidence'},
            {header: 'Agree', key: 'agree'}
        ])

    const rowData = loadable.data.map(predictionResultToRowData(documents))

    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value: CsvPredictionRecordFilter = CsvPredictionRecordFilterValues.lookup(event.target.value)

        if (!value) {
            console.log('Unable to find filter value: ' + event.target.value)
            return
        }

        setFilter(value)
    }

    return (<div style={{paddingTop: '20px'}}>
        <div style={{textAlign: 'left', fontWeight: 'bold'}}>Prediction results: {prediction.model} - {parseISOString(prediction.date).toDateString()}</div>
        <div style={{width: '250px'}}>
            <Select id={'prediction-filter'} value={filter} size="sm" labelText="Filter" onChange={handleFilterChange}>{CsvPredictionRecordFilterValues.values()
                .map(val => (<SelectItem key={val.value} text={val.label} value={val.value} />))}</Select>
        </div>
        <DataTable headerData={headerData} rowData={rowData} />
    </div>)
}

const predictionResultToRowData = (documents: CsvDocumentRecordModel[]) => {
    return (row: CsvPredictionResultModel) => {
        const doc: Optional<CsvDocumentRecordModel> = first(documents.filter(val => val.id === row.csvRecordId))

        if (!doc.isPresent()) {
            console.log('Document not found: ' + row.csvRecordId)
            return undefined
        }

        return Object.assign(
            {},
            doc.get().data,
            {
                providedValue: row.providedValue,
                predictionValue: valueToPercentage(row.predictionValue),
                confidence: valueToPercentage(row.confidence),
                agree: row.agree ? 'true' : 'false'
            }
        )
    }
}

const valueToPercentage = (value: unknown): string => {
    const num = Number(value)

    if (isNaN(num)) {
        return '' + value
    }

    return num.toLocaleString(undefined,{style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 2})
}