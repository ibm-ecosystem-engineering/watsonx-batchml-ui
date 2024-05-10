import {CsvDocumentModel} from "../../models";

export abstract class FileUploadApi {
    abstract uploadFile(name: string, file: File, description?: string): Promise<CsvDocumentModel>;
    abstract uploadCorrectedPredictionsFile(name: string, file: File, documentId: string, predictionId: string, description?: string): Promise<CsvDocumentModel>;
}
