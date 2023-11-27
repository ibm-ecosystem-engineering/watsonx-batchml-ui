// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import {DocumentListView} from "./DocumentListView.tsx";
import {FileUploadView} from "./FileUploadView.tsx";
import {DocumentModel, FamilyAllowanceStatus} from "../../../../models";

export interface SupportingDocumentsViewProps {
    caseId: string
    status: FamilyAllowanceStatus
    supportingDocuments?: DocumentModel[]
}

export const SupportingDocumentsView: React.FunctionComponent<SupportingDocumentsViewProps> = (props: SupportingDocumentsViewProps) => {

    const data: DocumentModel[] = props.supportingDocuments || []

    const enableUpload = FamilyAllowanceStatus[props.status] === FamilyAllowanceStatus.NeedsInfo

    return (
        <div>
            <DocumentListView documents={data} />
            <FileUploadView caseId={props.caseId} enabled={enableUpload} />
        </div>
    )
}
