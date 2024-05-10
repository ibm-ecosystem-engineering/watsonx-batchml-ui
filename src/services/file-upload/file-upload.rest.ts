import axios from "axios";
import {getType} from 'mime';

import {FileUploadApi} from "./file-upload.api";
import {CsvDocumentModel} from "../../models";

const getMimeType = (name: string): string => {
    const re = /(?:\.([^.]+))?$/

    const ext = re.exec(name)[1]

    return getType(ext)
}

export class FileUploadRest implements FileUploadApi {
    async uploadFile(name: string, file: File, description?: string): Promise<CsvDocumentModel> {
        const url = `/api/csv-document/original`

        const form = new FormData();
        form.append('name', name);
        form.append('file', file);
        form.append('type', getMimeType(name));
        if (description) {
            form.append('description', description)
        }

        return axios
            .post<CsvDocumentModel>(url, form)
            .then(response => {
                return response.data;
            });
    }
    async uploadCorrectedPredictionsFile(name: string, file: File, documentId: string, predictionId: string, description?: string): Promise<CsvDocumentModel> {
        const url = `/api/csv-document/corrected`

        const form = new FormData();
        form.append('name', name);
        form.append('file', file);
        form.append('documentId', documentId);
        form.append('predictionId', predictionId);
        form.append('type', getMimeType(name));
        if (description) {
            form.append('description', description)
        }

        return axios
            .post<CsvDocumentModel>(url, form)
            .then(response => {
                return response.data;
            });
    }

}