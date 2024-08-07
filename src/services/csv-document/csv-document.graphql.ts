import {Observable, Subject} from "rxjs";
import {ApolloClient, FetchResult} from "@apollo/client";

import {CsvDocumentApi} from "./csv-document.api";
import {
    CsvDocumentRecordBackendModel, CsvPredictionBackendResultModel,
    MUTATE_DELETE_DOCUMENT,
    MUTATION_CREATE_PREDICTION,
    QUERY_GET_DOCUMENT,
    QUERY_LIST_DOCUMENT_RECORDS,
    QUERY_LIST_DOCUMENTS,
    QUERY_LIST_PREDICTION_RECORDS,
    QUERY_LIST_PREDICTIONS,
    ReturnTypeCreatePrediction,
    ReturnTypeDeleteDocument,
    ReturnTypeGetDocument,
    ReturnTypeListDocumentRecords,
    ReturnTypeListDocuments,
    ReturnTypeListPredictionRecords,
    ReturnTypeListPredictions,
    ReturnTypeSubscriptionDocuments,
    ReturnTypeSubscriptionPredictions,
    SUBSCRIPTION_DOCUMENTS,
    SUBSCRIPTION_PREDICTIONS
} from "./graphql.support";
import {getApolloClient} from "../../backends";
import {
    CsvDocumentModel,
    CsvDocumentRecordModel,
    CsvDocumentStatusFilter,
    CsvPredictionModel,
    CsvPredictionRecordFilter,
    CsvPredictionResultModel, PaginationInputModel, PaginationResultModel,
    Record
} from "../../models";


let _documentSubject: Subject<CsvDocumentModel>;
let _predictionSubject: Subject<CsvPredictionModel>;

export class CsvDocumentGraphql implements CsvDocumentApi {
    client: ApolloClient<unknown>

    constructor() {
        this.client = getApolloClient();
    }

    async listCsvDocuments(pagination: PaginationInputModel, {status, refreshCache}: {status?: CsvDocumentStatusFilter, refreshCache?: boolean} = {}): Promise<PaginationResultModel<CsvDocumentModel>> {
        return this.client
            .query<ReturnTypeListDocuments>({
                query: QUERY_LIST_DOCUMENTS,
                variables: {status, pagination},
                fetchPolicy: refreshCache ? 'network-only' : 'cache-first',
            })
            .then((result: FetchResult<ReturnTypeListDocuments>) => result.data.listCsvDocuments)
    }

    async getCvsDocument(id: string): Promise<CsvDocumentModel> {
        return this.client
            .query<ReturnTypeGetDocument>({
                query: QUERY_GET_DOCUMENT,
                variables: {id}
            })
            .then((result: FetchResult<ReturnTypeGetDocument>) => result.data.getCsvDocument)
            .then(result => Object.assign({}, result, {originalUrl: `/api${result.originalUrl}`}))
    }

    async deleteCsvDocument(id: string): Promise<{ id: string; }> {
        return this.client
            .mutate<ReturnTypeDeleteDocument>({
                mutation: MUTATE_DELETE_DOCUMENT,
                variables: {id},
                refetchQueries: [{query: QUERY_LIST_DOCUMENTS}, {query: QUERY_GET_DOCUMENT, variables: {id}}],
                awaitRefetchQueries: true,
            })
            .then((result: FetchResult<ReturnTypeDeleteDocument>) => result.data.deleteCsvDocument)
    }

    async listCsvDocumentRecords(documentId: string, pagination: PaginationInputModel): Promise<PaginationResultModel<CsvDocumentRecordModel>> {
        return this.client
            .query<ReturnTypeListDocumentRecords>({
                query: QUERY_LIST_DOCUMENT_RECORDS,
                variables: {documentId, pagination}
            })
            .then((result: FetchResult<ReturnTypeListDocumentRecords>) => result.data.listCsvDocumentRecords)
            .then(backendRecordsToRecordModels)
    }

    async listCsvPredictions(documentId: string): Promise<CsvPredictionModel[]> {
        return this.client
            .query<ReturnTypeListPredictions>({
                query: QUERY_LIST_PREDICTIONS,
                variables: {documentId},
            })
            .then((result: FetchResult<ReturnTypeListPredictions>) => result.data.listCsvPredictions)
            .then(result => result.map(val => Object.assign({}, val, {predictionUrl: `/api${val.predictionUrl}`})))
    }

    async createCsvPrediction(documentId: string, model?: string): Promise<CsvPredictionModel> {
        return this.client
            .mutate<ReturnTypeCreatePrediction>({
                mutation: MUTATION_CREATE_PREDICTION,
                variables: {documentId, model},
                refetchQueries: [{query: QUERY_LIST_PREDICTIONS, variables: {documentId}}],
                awaitRefetchQueries: true,
            })
            .then((result: FetchResult<ReturnTypeCreatePrediction>) => result.data.createCsvPrediction)
    }

    async listCsvPredictionRecords(predictionId: string, pagination: PaginationInputModel, options?: {filter?: CsvPredictionRecordFilter, excludeSkip?: boolean}): Promise<PaginationResultModel<CsvPredictionResultModel>> {
        const variables = options ? {predictionId, pagination, options} : {predictionId, pagination}

        console.log('Querying csv prediction records: ', variables)

        return this.client
            .query<ReturnTypeListPredictionRecords>({
                query: QUERY_LIST_PREDICTION_RECORDS,
                variables,
            })
            .then((result: FetchResult<ReturnTypeListPredictionRecords>) => result.data.listCsvPredictionRecords)
            .then(backendPredictionRecordsToRecordModels)
    }

    observeCsvDocumentUpdates(): Observable<CsvDocumentModel> {
        if (_documentSubject) {
            return _documentSubject.asObservable()
        }

        _documentSubject = new Subject()

        this.client
            .subscribe<ReturnTypeSubscriptionDocuments>({
                query: SUBSCRIPTION_DOCUMENTS
            })
            .map((result: FetchResult<ReturnTypeSubscriptionDocuments>) => result.data.observeCsvDocumentUpdates)
            .subscribe(_documentSubject)

        return _documentSubject.asObservable()
    }

    observeCsvPredictionUpdates(): Observable<CsvPredictionModel> {
        if (_predictionSubject) {
            return _predictionSubject.asObservable()
        }

        _predictionSubject = new Subject()

        this.client
            .subscribe<ReturnTypeSubscriptionPredictions>({
                query: SUBSCRIPTION_PREDICTIONS
            })
            .map((result: FetchResult<ReturnTypeSubscriptionPredictions>) => result.data.observeCsvPredictionUpdates)
            .subscribe(_predictionSubject)

        return _predictionSubject.asObservable()
    }

}

const backendRecordsToRecordModels = (records: PaginationResultModel<CsvDocumentRecordBackendModel>) => {
    return {
        metadata: records.metadata,
        data: records.data.map(backendRecordToRecordModel)
    }
}

const backendRecordToRecordModel = (record: CsvDocumentRecordBackendModel): CsvDocumentRecordModel => {
    try {
        const data: Record = JSON.parse(record.data)

        return Object.assign({}, record, {data: Object.assign(data, {id: record.id, documentId: record.documentId})})
    } catch (err) {
        console.log('Error parsing JSON: ', err)
    }

    return Object.assign({}, record, {data: {id: record.id, documentId: record.documentId} as any})
}


const backendPredictionRecordsToRecordModels = (records: PaginationResultModel<CsvPredictionBackendResultModel>) => {
    return {
        metadata: records.metadata,
        data: records.data.map(backendPredictionRecordToRecordModel)
    }
}

const backendPredictionRecordToRecordModel = (record: CsvPredictionBackendResultModel): CsvPredictionResultModel => {
    try {
        const data: Record = JSON.parse(record.data)

        return Object.assign({}, record, {data: Object.assign(data, {id: record.id, documentId: record.documentId})})
    } catch (err) {
        console.log('Error parsing JSON: ', err)
    }

    return Object.assign({}, record, {data: {id: record.id, documentId: record.documentId} as any})
}
