// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ChangeEvent, useState} from 'react';
import Optional from "optional-js";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {useParams} from "react-router-dom";
import {Button, Column, DataTableHeader, Grid, Loading, Select, SelectItem, Toggle} from "@carbon/react";

import {
    predictionRecordExcludeSkip,
    predictionRecordFilterAtom,
    recordsPageAtom,
    recordsPageSizeAtom,
    selectedCsvPredictionsLoadable,
    selectedDocumentIdAtom,
    selectedDocumentLoadable,
    selectedPredictionAtom,
    selectedPredictionRecordsLoadable
} from "../../atoms";
import {DataTable, SimpleTable, TableRow} from "../../components";
import {
    CsvDocumentModel,
    CsvPredictionModel,
    CsvPredictionRecordFilter,
    CsvPredictionRecordFilterValues,
    CsvPredictionResultModel,
} from "../../models";
import {first} from "../../utils";
import {CsvUpdatedDocumentAddView} from "../CsvUpdatedDocumentAddView";
import {PerformanceSummaryView} from "../PerformanceSummaryView";
import {PredictionTile} from "./PredictionTile.tsx";
import {Download, Upload} from "@carbon/icons-react";
import dayjs from "dayjs";

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
        {label: 'Status:', value: document.status}
    ]

    return (<div>
        <div>
            <Grid narrow>
                <Column sm={8} md={8} lg={8} xlg={8}>
            <div style={{width: '600px', margin: '0 auto', paddingBottom: '20px'}}>
            <SimpleTable rows={documentSummary} />
            </div>
                </Column>
                <Column sm={8} md={8} lg={8} xlg={8} style={{align: 'right', textAlign: 'right'}}>
            <Button kind="tertiary" renderIcon={Download} href={document.originalUrl}>Download original</Button>
                </Column>
            </Grid>
        </div>
        <PredictionSummaryView document={document} />
    </div>)
}

interface PredictionSummaryViewProps {
    document: CsvDocumentModel;
}

const PredictionSummaryView: React.FunctionComponent<PredictionSummaryViewProps> = ({document}: PredictionSummaryViewProps) => {

    const loadablePredictions = useAtomValue(selectedCsvPredictionsLoadable)
    const [showAddModal, setShowAddModal] = useState(false)
    const [predictionId, setPredictionId] = useState('')
    const selectedPrediction = useAtomValue(selectedPredictionAtom)
    const setSelectedPrediction = useSetAtom(selectedPredictionAtom)

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

    if (predictions.length === 1) {
        const prediction = predictions[0]
        if (selectedPrediction?.id !== prediction.id) {
            console.log('Setting selected prediction: ', prediction)
            setSelectedPrediction(prediction)
        }

        const predictionRow = csvPredictionToRow(showUpdate)(prediction)

        return (<>
            <div style={{width: '100%'}}>
                <div style={{fontWeight: 'bold', fontSize: 'larger', textAlign: 'left', paddingBottom: '8px'}}>Prediction</div>
                <Grid narrow>
                    <Column sm={4} md={4} lg={4} xlg={4}>
                        <PredictionTile label="Review required:" value={predictionRow.reviewCount} />
                    </Column>
                    <Column sm={4} md={4} lg={4} xlg={4}>
                        <PredictionTile label="Grand total:" value={predictionRow.grandTotal} />
                    </Column>
                    <Column sm={4} md={4} lg={4} xlg={4}>
                        <PredictionTile label="Total count:" value={predictionRow.totalCount} />
                    </Column>
                    <Column sm={4} md={4} lg={4} xlg={4}>
                        <PredictionTile label="Confidence threshold:" value={predictionRow.confidenceThreshold} />
                    </Column>
                </Grid>
                <div style={{width: '100%', paddingTop: '20px', paddingBottom: '10px'}}>
                    <Grid narrow>
                        <Column sm={4} md={4} lg={4} xlg={4} style={{textAlign: 'left'}}>
                            {predictionRow.predictionUrl}
                        </Column>
                        <Column sm={{span: 4, offset: 12}} md={{span: 4, offset: 12}} lg={{span: 4, offset: 12}} xlg={{span: 4, offset: 12}} style={{textAlign: 'right'}}>
                            {predictionRow.upload}
                        </Column>
                    </Grid>
                </div>
            </div>
            <PredictionDetailView show={true} />
        </>)
    }

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
        key: 'grandTotal',
        header: 'Grand total'
    }, {
        key: 'totalCount',
        header: 'Record count'
    }, {
        key: 'reviewCount',
        header: 'Review required'
    }, {
        key: 'confidenceThreshold',
        header: 'Confidence threshold'
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
        <PredictionDetailView show={!showAddModal} />
    </div>)
}

const csvPredictionToRow = (uploadHandler: (data: CsvPredictionModel) => void) => {
    return (data: CsvPredictionModel) => {
        const grandTotal = data.performanceSummary?.grandTotal || 0
        const totalCount = data.performanceSummary?.totalCount || 0
        const reviewCount = (data.performanceSummary?.agreeBelowThreshold + data.performanceSummary?.disagreeBelowThreshold)
        const reviewCountPercentage = totalCount > 0 ? Math.round(100 * reviewCount / totalCount) : undefined

        const reviewCountText = reviewCountPercentage ? `${reviewCount.toLocaleString()} (${reviewCountPercentage}%)` : `${reviewCount.toLocaleString()}`

        return Object.assign(
            {},
            data,
            {
                date: formatDate(parseISOString(data.date)),
                predictionUrl: (<Button href={data.predictionUrl} renderIcon={Download}>Download predictions</Button>),
                grandTotal: grandTotal.toLocaleString(),
                totalCount: totalCount.toLocaleString(),
                confidenceThreshold: (data.performanceSummary?.confidenceThreshold * 100 || 0) + '%',
                reviewCount: reviewCountText,
                performanceSummary: (<PerformanceSummaryView data={data.performanceSummary} />),
                upload: (<Button onClick={() => uploadHandler(data)} renderIcon={Upload} kind="secondary">Upload updates</Button>)
            }
        )
    }
}

const parseISOString = (s: string) => {
    const b: string[] = s.split(/\D+/);

    return new Date(Date.UTC(Number(b[0]), Number(b[1]) - 1, Number(b[2]), Number(b[3]), Number(b[4]), Number(b[5]), Number(b[6])));
}

interface PredictionDetailViewProps {
    show: boolean;
}

const PredictionDetailView: React.FunctionComponent<PredictionDetailViewProps> = ({show}: PredictionDetailViewProps = {show: true}) => {

    const loadable = useAtomValue(selectedPredictionRecordsLoadable)
    const prediction = useAtomValue(selectedPredictionAtom)
    const filter = useAtomValue(predictionRecordFilterAtom)
    const setFilter = useSetAtom(predictionRecordFilterAtom)
    const excludeSkip = useAtomValue(predictionRecordExcludeSkip)
    const setExcludeSkip = useSetAtom(predictionRecordExcludeSkip)
    const [page, setPage] = useAtom(recordsPageAtom)
    const pageSize = useAtomValue(recordsPageSizeAtom)

    if (!show) {
        return (<></>)
    }

    if (loadable.state === 'loading') {
        return (<LoadableLoading />)
    } else if (loadable.state === 'hasError') {
        return (<LoadableError text="Error loading prediction records"/>)
    } else if (loadable.data.data.length === 0) {
        return (<></>)
    }

    const firstRecord = loadable.data.data[0]

    const headerData: DataTableHeader[] = [
        {header: 'Prediction', key: 'predictionValue'},
        {header: 'Confidence', key: 'confidence'},
        {header: 'Agree', key: 'agree'},
    ]
        .concat(prediction.predictionField ? [{header: prediction.predictionField, key: prediction.predictionField}] : [])
        .concat(Object.keys(firstRecord.data)
            .filter(val => val !== 'id' && val !== 'documentId' && val !== 'providedValue' && val !== prediction.predictionField)
            .map(key => ({key, header: key})))

    const totalCount = loadable.data.metadata.totalCount
    const rowData = loadable.data.data.map(predictionResultToRowData)

    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value: CsvPredictionRecordFilter = CsvPredictionRecordFilterValues.lookup(event.target.value)

        if (!value) {
            console.log('Unable to find filter value: ' + event.target.value)
            return
        }

        setFilter(value)
    }

    const handleExcludeSkipToggle = () => {
        console.log('Toggle toggled')
        setExcludeSkip(!excludeSkip)
    }

    const handleExcludeSkipClick = () => {
        console.log('Toggle clicked')
        setExcludeSkip(!excludeSkip)
    }

    return (<div style={{paddingTop: '50px'}}>
        <div style={{textAlign: 'left', fontWeight: 'bold'}}>Prediction results:</div>
        <div style={{
            fontSize: 'small',
            textAlign: 'left',
            paddingTop: '10px'
        }}>{formatDate(parseISOString(prediction.date))} - {prediction.model}</div>
        <div style={{overflow: 'auto', paddingTop: '8px', paddingBottom: '8px'}}>
            <div style={{width: '250px', float: 'left'}}>
                <Select id={'prediction-filter'} value={filter} size="sm" labelText="Filter"
                        onChange={handleFilterChange}>{CsvPredictionRecordFilterValues.values()
                    .map(val => (<SelectItem key={val.value} text={val.label} value={val.value}/>))}</Select>
            </div>
            <div style={{width: '250px', float: 'right'}} onClick={handleExcludeSkipClick}>
                <Toggle id="toggle-exclude-skip"
                        aria-labelledby="Hide skip records"
                        labelA="No"
                        labelB="Yes"
                        labelText="Hide skip records"
                        disabled={false}
                        readOnly={false}
                        onToggle={handleExcludeSkipToggle}
                        onClick={handleExcludeSkipClick}
                        toggled={excludeSkip}/>
            </div>
        </div>
        <DataTable headerData={headerData} rowData={rowData} totalCount={totalCount} page={page} pageSize={pageSize}
                   setPage={setPage}/>
    </div>)
}

const predictionResultToRowData = (row: CsvPredictionResultModel) => {
    return Object.assign(
        {},
        row.data,
        {
            providedValue: row.providedValue,
            predictionValue: valueToPercentage(row.predictionValue),
            confidence: valueToPercentage(row.confidence),
            agree: row.agree ? 'true' : 'false',
            skip: row.skip ? 'true' : 'false'
        }
    )
}

const valueToPercentage = (value: unknown): string => {
    const num = Number(value)

    if (isNaN(num)) {
        return '' + value
    }

    return num.toLocaleString(undefined,{style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 2})
}

const formatDate = (date?: Date): string => {
    if (!date) {
        return ''
    }

    return dayjs(date).format('YYYY-MM-DD')
}