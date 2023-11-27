import axios from "axios";
import {getType} from 'mime';

import {FileUploadApi} from "./file-upload.api.ts";
import {FamilyAllowanceModel} from "../../models";

const getMimeType = (name: string): string => {
    const re = /(?:\.([^.]+))?$/

    const ext = re.exec(name)[1]

    return getType(ext)
}

export class FileUploadRest implements FileUploadApi {
    async uploadFile(caseId: string, name: string, file: File, description?: string): Promise<FamilyAllowanceModel> {
        const url = `/api/family-allowance/${caseId}/upload`

        const form = new FormData();
        form.append('name', name);
        form.append('file', file);
        form.append('type', getMimeType(name))
        if (description) {
            form.append('description', description)
        }

        return axios
            .post<FamilyAllowanceModel>(url, form)
            .then(response => {
                return response.data;
            });
    }

}