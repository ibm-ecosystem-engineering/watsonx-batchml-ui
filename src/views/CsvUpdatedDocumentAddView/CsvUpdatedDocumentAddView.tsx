// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {useState} from 'react';
import {Button, ComposedModal, FileUploader, ModalBody, ModalFooter, ModalHeader, TextArea} from "@carbon/react";

import './CsvUpdatedDocumentAddView.scss'
import {CsvDocumentModel} from "../../models";
import {FileUploadApi, fileUploadApi} from "../../services";

export interface CsvDocumentAddViewProps {
    show: boolean;
    documentId: string;
    predictionId: string;
    onNewDocument: (val?: CsvDocumentModel[]) => void;
}

export const CsvUpdatedDocumentAddView: React.FunctionComponent<CsvDocumentAddViewProps> = ({onNewDocument, show, documentId, predictionId}: CsvDocumentAddViewProps) => {
    const [fileStatus, setFileStatus] = useState<'edit' | 'complete' | 'uploading'>('edit')
    const [fileList, setFileList] = useState<FileList | undefined>(undefined)

    if (!show) {
        return (<></>)
    }

    let descriptionField;

    const handleSubmit = () => {
        const fileUploadService: FileUploadApi = fileUploadApi();

        const description: string = descriptionField.value

        console.log('Handle submit: ', {description, fileList})

        const files: File[] = fileListUtil(fileList);
        console.log('File uploader: ', {files: fileList, fileNames: files.map(f => f.name), description});

        descriptionField.disabled = true
        setFileStatus('uploading')

        // TODO handle document remove
        Promise.all(files.map(f => fileUploadService.uploadCorrectedPredictionsFile(f.name, f, documentId, predictionId, description)))
            .then((result: CsvDocumentModel[]) => {
                console.log('Upload document complete')
                setFileStatus('complete');

                return result.filter(doc => !!doc);
            })
            .then(onNewDocument)
            .catch(err => {
                console.log('Error uploading file: ', {err})
                setFileStatus('edit')
            })
    }

    return (<ComposedModal open={true} onClose={() => onNewDocument()} className="csv-updated-document-add-modal">
        <ModalHeader label="Documents">Add an updated CSV document</ModalHeader>
        <ModalBody>
            <p>Upload the updated CSV document for AI prediction.</p>
            <FileUploader
                labelTitle="Add updated CSV document"
                labelDescription="Max file size is 500mb."
                buttonLabel="Select file"
                buttonKind="primary"
                size="md"
                filenameStatus={fileStatus}
                accept={['.csv']}
                multiple={false}
                disabled={false}
                iconDescription="Delete file"
                name=""
                onChange={(event: {target: {files: FileList}}) => setFileList(event.target.files)}
            />
            <TextArea id="add-updated-document-description" labelText="Description:" ref={(input) => descriptionField = input}/>
        </ModalBody>
        <ModalFooter>
            <Button kind="tertiary" onClick={() => onNewDocument()}>Cancel</Button>
            <Button onClick={handleSubmit}>Add</Button>
        </ModalFooter>
    </ComposedModal>)
}

const fileListUtil = (fileList: FileList): File[] => {
    const files: File[] = [];

    for (let i = 0; i < fileList.length; i++) {
        const file: File | null = fileList.item(i);

        if (file !== null) {
            files.push(file);
        }
    }

    return files;
}
