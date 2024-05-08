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
        const url = `/api/csv-document`

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

}