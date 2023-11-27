// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {useState} from 'react';
import {FileUploader} from "@carbon/react";
import {useSetAtom} from "jotai";

import {familyAllowanceCaseAtom} from "../../../../atoms";
import {FamilyAllowanceModel} from "../../../../models";
import {fileUploadApi, FileUploadApi} from "../../../../services";
import {fileListUtil} from "../../../../utils";

export interface FileUploadViewProps {
    caseId: string;
    enabled: boolean;
}

export const FileUploadView: React.FunctionComponent<FileUploadViewProps> = (props: FileUploadViewProps) => {
    const [fileStatus, setFileStatus] = useState<'edit' | 'complete' | 'uploading'>('edit')
    const setCase = useSetAtom(familyAllowanceCaseAtom)

    const handleDocuments = (updatedCase: FamilyAllowanceModel) => {
        setCase(updatedCase)
    }

    if (!props.enabled) {
        return (<></>)
    }

    return (<div>
        <FileUploader
            labelTitle="Add documents"
            labelDescription="Max file size is 500mb."
            buttonLabel="Add file"
            buttonKind="primary"
            size="md"
            filenameStatus={fileStatus}
            // accept={['.jpg', '.png', '.pdf']}
            multiple={true}
            disabled={false}
            iconDescription="Delete file"
            onChange={handleFileUploaderChange(props.caseId, handleDocuments, setFileStatus)}
            name="" />
    </div>)
}

const handleFileUploaderChange = (id: string, handleNewDocuments: (updatedCase: FamilyAllowanceModel) => void, setFileStatus: (status: unknown) => void) => {
    const fileUploadService: FileUploadApi = fileUploadApi();

    return (event: {target: {files: FileList, filenameStatus: string}}) => {
        const fileList: FileList = event.target.files;
        const files: File[] = fileListUtil(fileList);

        console.log('File uploader: ', {event, files: fileList, fileNames: files.map(f => f.name)});

        setFileStatus('uploading')

        // TODO handle document remove
        Promise.all(files.map(f => fileUploadService.uploadFile(id, f.name, f)))
            .then((result: FamilyAllowanceModel[]) => {
                setFileStatus('complete');

                return result
                    .filter(doc => !!doc)
                    .reduce((caseResult: FamilyAllowanceModel, current: FamilyAllowanceModel) => {
                        const supportingDocuments = caseResult.supportingDocuments.concat(...current.supportingDocuments)

                        return Object.assign({}, caseResult, current,{supportingDocuments})
                    })
            })
            .then(handleNewDocuments)
            .catch(err => {
                console.log('Error uploading file: ', {err})
                setFileStatus('error')
            })
    }
}
