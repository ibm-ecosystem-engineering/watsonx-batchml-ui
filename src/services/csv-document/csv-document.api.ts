import {CsvDocumentModel, CsvDocumentRecordModel, CsvDocumentStatusFilter, CsvPredictionModel} from "../../models";
import {Observable} from "rxjs";

export abstract class CsvDocumentApi {
    abstract listCsvDocuments(filter?: {status?: CsvDocumentStatusFilter, refreshCache?: boolean}): Promise<CsvDocumentModel[]>
    abstract getCvsDocument(id: string): Promise<CsvDocumentModel>
    abstract deleteCsvDocument(id: string): Promise<{id: string}>

    abstract listCsvDocumentRecords(documentId: string): Promise<CsvDocumentRecordModel[]>

    abstract listCsvPredictions(documentId: string): Promise<CsvPredictionModel[]>
    abstract createCsvPrediction(documentId: string, model?: string): Promise<CsvPredictionModel>

    abstract observeCsvDocumentUpdates(): Observable<CsvDocumentModel>
    abstract observeCsvPredictionUpdates(): Observable<CsvPredictionModel>
}
