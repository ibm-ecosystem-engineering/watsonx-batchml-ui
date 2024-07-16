import {
    CsvDocumentModel,
    CsvDocumentRecordModel,
    CsvDocumentStatusFilter,
    CsvPredictionModel,
    CsvPredictionRecordFilter,
    CsvPredictionResultModel,
    PaginationInputModel,
    PaginationResultModel,
} from "../../models";
import {Observable} from "rxjs";

export abstract class CsvDocumentApi {
    abstract listCsvDocuments(pagination: PaginationInputModel, filter?: {status?: CsvDocumentStatusFilter, refreshCache?: boolean}): Promise<PaginationResultModel<CsvDocumentModel>>
    abstract getCvsDocument(id: string): Promise<CsvDocumentModel>
    abstract deleteCsvDocument(id: string): Promise<{id: string}>

    abstract listCsvDocumentRecords(documentId: string, pagination: PaginationInputModel): Promise<PaginationResultModel<CsvDocumentRecordModel>>

    abstract listCsvPredictions(documentId: string): Promise<CsvPredictionModel[]>
    abstract createCsvPrediction(documentId: string, model?: string): Promise<CsvPredictionModel>
    abstract listCsvPredictionRecords(predictionId: string, pagination: PaginationInputModel, options?: {filter?: CsvPredictionRecordFilter, excludeSkip?: boolean}): Promise<PaginationResultModel<CsvPredictionResultModel>>

    abstract observeCsvDocumentUpdates(): Observable<CsvDocumentModel>
    abstract observeCsvPredictionUpdates(): Observable<CsvPredictionModel>
}
