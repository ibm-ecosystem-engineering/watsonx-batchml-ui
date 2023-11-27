
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import {DocumentModel} from "../../../../models";
import {Stack} from "../../../../components";

export interface DocumentListViewProps {
    documents: DocumentModel[];
}

export const DocumentListView: React.FunctionComponent<DocumentListViewProps> = ({documents}: DocumentListViewProps) => {

    if (!documents || documents.length === 0) {
        return (<div style={{textAlign: 'left', padding: '20px 0'}}>No documents provided</div>)
    }

    return (
        <div style={{textAlign: 'left', padding: '20px 0'}}>
            <Stack gap={3}>
                {documents.map((doc: DocumentModel) => {
                    const desc: string = doc.description ? ` - ${doc.description}` : ''

                    return (
                        <div key={doc.id} style={{textAlign: 'left'}}>
                            <a href={getDocumentUrl(doc.url)} target="_blank" rel="noopener noreferrer">{doc.name}</a>{desc}
                        </div>
                    )
                })}
            </Stack>
        </div>
    )
}

const getDocumentUrl = (url: string): string => {
    if (url.startsWith('http') || url.startsWith('//')) {
        return url
    }

    return `/api${url}`
}
