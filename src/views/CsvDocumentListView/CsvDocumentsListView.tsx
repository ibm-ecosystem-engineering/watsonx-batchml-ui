
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Loading} from "@carbon/react";
import {useAtomValue, useSetAtom} from "jotai";

import './CsvDocumentsListView.scss'
import {csvDocumentsAtom, csvDocumentsLoadable} from "../../atoms";
import {DataTable} from "../../components";
import {CsvDocumentModel} from "../../models";
import {CsvDocumentAddView} from "../CsvDocumentAddView";

export interface CsvDocumentsListViewProps {
}

const CsvDocumentsLoading = () => {
    return (<Loading active={true} className="" description="Loading documents" small={false} withOverlay={false} />)
}

const CsvDocumentsError = () => {
    return (<div>Error loading documents!</div>)
}

interface CsvDocumentRow {
    id: string;
    name: string;
    description: string;
    status: string;
    originalUrl: React.ReactNode;
}

const csvDocumentToRow = (data: CsvDocumentModel): CsvDocumentRow => ({
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
    originalUrl: (<LinkView label='Download' url={data.originalUrl} />),
})

export const CsvDocumentsListView: React.FunctionComponent<CsvDocumentsListViewProps> = () => {
    const loadableDocuments = useAtomValue(csvDocumentsLoadable);
    const refreshDocuments = useSetAtom(csvDocumentsAtom);
    const [showAddModal, setShowAddModal] = useState(false)
    const navigate = useNavigate();

    const headerData: Array<{header: string, key: keyof CsvDocumentRow}> = [
        {header: 'Name', key: 'name'},
        {header: 'Description', key: 'description'},
    ]

    const navigateToDetails = (docId: string) => {
        const url = `/${docId}`

        navigate(url)
    }

    if (loadableDocuments.state === 'loading') {
        return (<CsvDocumentsLoading />)
    }

    if (loadableDocuments.state === 'hasError') {
        return (<CsvDocumentsError />)
    }

    const rowData: CsvDocumentModel[] = loadableDocuments.data

    const handleOnNewDocument = (docs?: CsvDocumentModel[]) => {
        setShowAddModal(false)

        if (docs) {
            refreshDocuments()
        }
    }

    return (
        <div>
            <CsvDocumentAddView onNewDocument={handleOnNewDocument} show={showAddModal} />
            <DataTable
                headerData={headerData}
                rowData={rowData.map(csvDocumentToRow)}
                onRowClick={navigateToDetails}
                toolbarButtonText="Add CSV document"
                onToolbarButtonClick={() => setShowAddModal(true)}
            />
        </div>
    )
}


const LinkView = ({label, url}: {label?: string, url?: string}): React.ReactNode => {
    if (url) {
        return (<a href={url} target="_blank" rel="noopener noreferrer">{label || 'Download'}</a>)
    }

    return (<span>U/A</span>)
}

// const calculatePerformance = (val: number, total: number): string => {
//     if (total <= 0) {
//         return `${val}`
//     }
//
//     return `${(val * 100) / total}%`
// }

// const PerformanceView = ({rowCount, performance}: {rowCount: number, performance?: PerformanceSummaryModel}): React.ReactNode => {
//     if (!performance) {
//         return (<span>U/A</span>)
//     }
//
//     return (<div className="performance">
//         <div>&nbsp;</div><div className="labelCenter" style={{padding: '0 5px'}}>Agree</div><div className="labelCenter">Disagree</div>
//         <div className="labelRight">Above</div><div className="agreeAbove">{calculatePerformance(performance.agreeAboveThreshold, rowCount)}</div><div className="agreeBelow">{calculatePerformance(performance.disagreeAboveThreshold, rowCount)}</div>
//         <div className="labelRight">Below</div><div className="disagreeAbove">{calculatePerformance(performance.disagreeAboveThreshold, rowCount)}</div><div className="disagreeBelow">{calculatePerformance(performance.disagreeAboveThreshold, rowCount)}</div>
//     </div>)
// }
