import {CsvDocumentModel} from "../../models";

export abstract class FileUploadApi {
    abstract uploadFile(name: string, file: File, description?: string): Promise<CsvDocumentModel>;
}
