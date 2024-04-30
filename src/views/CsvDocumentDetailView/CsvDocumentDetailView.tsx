// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {CsvDocumentModel} from "../../models";
import {useAtomValue, useSetAtom} from "jotai";
import {selectedDocumentAtom, selectedDocumentLoadable} from "../../atoms";
import {useParams} from "react-router-dom";
import {Loading} from "@carbon/react";
import {SimpleTable, TableRow} from "../../components";

export interface CsvDocumentDetailViewProps {
}

export const CsvDocumentDetailView: React.FunctionComponent<CsvDocumentDetailViewProps> = () => {
    const {id} = useParams();

    const loadable = useAtomValue(selectedDocumentLoadable)
    const setSelectedDocument = useSetAtom(selectedDocumentAtom)

    if (loadable.state === 'loading') {
        return (<Loading active={true} id="loading-selected-document" small={false} withOverlay={false} className=""></Loading>)
    } else if (loadable.state === 'hasError') {
        return (<div>Error loading document</div>)
    }

    const csvDocument: CsvDocumentModel = loadable.data
    if (!csvDocument || csvDocument.id !== id) {
        setSelectedDocument(id)
        return (<Loading active={true} id="loading-selected-document" small={false} withOverlay={false} className=""></Loading>)
    }

    console.log('Got document: ', csvDocument)
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
        <div style={{width: '600px', margin: '0 auto'}}>
        <SimpleTable rows={documentSummary} />
        </div>
    </div>)
}
