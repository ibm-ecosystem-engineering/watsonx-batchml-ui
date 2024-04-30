import {CsvDocumentModel} from "../../models";

export abstract class FileUploadApi {
    abstract uploadFile(name: string, file: File, predictField: string, description?: string): Promise<CsvDocumentModel>;
}
