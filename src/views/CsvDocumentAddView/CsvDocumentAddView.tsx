// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {useState} from 'react';
import {
    Button,
    ComposedModal,
    FileUploader,
    ModalBody,
    ModalFooter,
    ModalHeader,
    TextArea,
    TextInput
} from "@carbon/react";

import './CsvDocumentAddView.scss'
import {CsvDocumentModel} from "../../models";
import {FileUploadApi, fileUploadApi} from "../../services";
import {joinList} from "../../utils";

export interface CsvDocumentAddViewProps {
    show: boolean;
    onNewDocument: (val?: CsvDocumentModel[]) => void;
}

export const CsvDocumentAddView: React.FunctionComponent<CsvDocumentAddViewProps> = ({onNewDocument, show}: CsvDocumentAddViewProps) => {
    const [fileStatus, setFileStatus] = useState<'edit' | 'complete' | 'uploading'>('edit')
    const [fileList, setFileList] = useState<FileList | undefined>(undefined)

    if (!show) {
        return (<></>)
    }

    let descriptionField;
    let worksheetField;
    let worksheetStartField;

    const handleSubmit = () => {
        const fileUploadService: FileUploadApi = fileUploadApi();

        const description: string = descriptionField.value
        const worksheet: string = worksheetField.value
        const worksheetStartRow: number = worksheetStartField.value

        console.log('Handle submit: ', {description, fileList})

        const files: File[] = fileListUtil(fileList);
        console.log('File uploader: ', {files: fileList, fileNames: files.map(f => f.name), description});

        descriptionField.disabled = true
        setFileStatus('uploading')

        // TODO handle document remove
        Promise.all(files.map(f => fileUploadService.uploadFile(f.name, f, description, worksheet, worksheetStartRow)))
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

    const acceptList = ['.csv', '.xlsx', '.xlsb', '.xlsm']
    const ciasRE: RegExp = /.*cias.*/i
    const ierpRE: RegExp = /.*ierp.*/i

    return (<ComposedModal open={true} onClose={() => onNewDocument()} className="csv-document-add-modal">
        <ModalHeader label="Documents">Add document</ModalHeader>
        <ModalBody>
            <p style={{paddingBottom: '10px'}}>Upload the document for AI prediction. Allowed file types are {joinList(acceptList, 'or')}.</p>
            <FileUploader
                labelTitle=""
                labelDescription="Max file size is 500mb."
                buttonLabel="Select file"
                buttonKind="primary"
                size="md"
                filenameStatus={fileStatus}
                accept={acceptList}
                multiple={false}
                disabled={false}
                iconDescription="Delete file"
                name=""
                onChange={(event: {target: {files: FileList}}) => {
                    const files: File[] = fileListUtil(event.target.files)

                    if (files.length > 0) {
                        const filename: string = files[0].name

                        const {sheetName, start} = ciasRE.test(filename)
                            ? {sheetName: 'Treasury & Tax', start: 3}
                            : (ierpRE.test(filename)
                                ? {sheetName: 'Payment Proposal Details', start: 2}
                                : {sheetName: '', start: 0})

                        worksheetField.value = sheetName
                        worksheetStartField.value = start
                    }

                    return setFileList(event.target.files)
                }}
            />
            <TextArea id="add-document-description" labelText="Description:" ref={(input) => descriptionField = input}/>
            <TextInput id="add-document-worksheet" labelText="Worksheet name:" ref={(input) => worksheetField = input} />
            <TextInput id="add-document-worksheet-start" labelText="Worksheet start row:" type="number" ref={(input) => worksheetStartField = input} />
        </ModalBody>
        <ModalFooter>
            <Button kind="tertiary" onClick={() => onNewDocument()}>Cancel</Button>
            <Button onClick={handleSubmit}>Add</Button>
        </ModalFooter>
    </ComposedModal>)
}

const fileListUtil = (fileList: FileList): File[] => {
    const files: File[] = [];

    if (!fileList) {
        return files
    }

    for (let i = 0; i < fileList.length; i++) {
        const file: File | null = fileList.item(i);

        if (file !== null) {
            files.push(file);
        }
    }

    return files;
}
