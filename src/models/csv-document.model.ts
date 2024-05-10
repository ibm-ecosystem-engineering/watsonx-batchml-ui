import {MachineLearningResultModel} from "./machine-learning-result.model";
import {SelectValue} from "./select-value.model.ts";

export interface CsvDocumentInputModel {
    name: string;
    description?: string;
    predictField: string;
}

export interface CsvDocumentModel extends CsvDocumentInputModel {
    id: string;
    status: CsvDocumentStatus;
    originalUrl: string;
}

export const isCsvDocumentModel = (val: unknown): val is CsvDocumentModel => {
    return !!val
        && !!(val as CsvDocumentModel).id
        && !!(val as CsvDocumentModel).name
        && !!(val as CsvDocumentModel).status
}

export interface Record {
    id: string;
    documentId: string;
    [key: string]: string
}

export interface CsvDocumentRecordModel {
    id: string;
    documentId: string;
    providedValue: string;
    data: Record;
}

export enum CsvDocumentStatus {
    InProgress = 'InProgress',
    Completed = 'Completed',
    Error = 'Error',
    Deleted = 'Deleted'
}

export enum CsvDocumentStatusFilter {
    All = 'All',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Error = 'Error',
    Deleted = 'Deleted'
}

export const mapDocumentFilterStatus = (status?: CsvDocumentStatusFilter): CsvDocumentStatus | undefined => {
    if (!status) {
        return
    }

    switch (status) {
        case CsvDocumentStatusFilter.Completed:
            return CsvDocumentStatus.Completed
        case CsvDocumentStatusFilter.Deleted:
            return CsvDocumentStatus.Deleted
        case CsvDocumentStatusFilter.Error:
            return CsvDocumentStatus.Error
        case CsvDocumentStatusFilter.InProgress:
            return CsvDocumentStatus.InProgress
        case CsvDocumentStatusFilter.All:
            return
        default:
            console.log(`WARNING: Unknown status: ${status}`)
            return
    }
}

export interface CsvPredictionModel {
    id: string;
    documentId: string;
    model: string;
    date: string;
    predictionUrl: string;
    predictions: CsvPredictionResultModel[];
    performanceSummary: PerformanceSummaryModel;
}

export interface CsvPredictionResultModel {
    id: string;
    documentId: string;
    predictionId: string;
    csvRecordId: string;
    providedValue: string;
    predictionValue: string;
    confidence: number;
    agree: boolean;
}

// performance summary (e.g. number of agree/disagree, above/below confidence threshold
export interface PerformanceSummaryModel {
    totalCount: number;
    confidenceThreshold: number;
    agreeAboveThreshold: number;
    agreeBelowThreshold: number;
    disagreeAboveThreshold: number;
    disagreeBelowThreshold: number;
    correctedRecords: number;
}

export interface CsvDocumentRowModel {
    [key: string]: unknown
}

export interface ProcessedCsvDocumentRowModel extends CsvDocumentRowModel, MachineLearningResultModel {
}

export enum CsvDocumentEventAction {
    Add = 'Add',
    Update = 'Update',
    Delete = 'Delete'
}

export interface CsvDocumentEventModel<T extends {id: string} = {id: string}> {
    target: T;
    action: CsvDocumentEventAction;
}

export enum CsvPredictionRecordFilter {
    All = 'All',
    AllDisagree = 'AllDisagree',
    AllBelowConfidence = 'AllBelowConfidence',
    DisagreeBelowConfidence = 'DisagreeBelowConfidence'
}

export const CsvPredictionRecordFilterValues = {
    All: new SelectValue({value: CsvPredictionRecordFilter.All, label: 'All predictions'}),
    AllDisagree: new SelectValue({value: CsvPredictionRecordFilter.AllDisagree, label: 'All disagree'}),
    AllBelowConfidence: new SelectValue({value: CsvPredictionRecordFilter.AllBelowConfidence, label: 'All below confidence'}),
    DisagreeLowConfidence: new SelectValue({value: CsvPredictionRecordFilter.DisagreeBelowConfidence, label: 'Disagree below confidence'}),

    values: () => {
        return [CsvPredictionRecordFilterValues.All, CsvPredictionRecordFilterValues.AllDisagree, CsvPredictionRecordFilterValues.AllBelowConfidence, CsvPredictionRecordFilterValues.DisagreeLowConfidence]
    },
    lookup: (value: string): CsvPredictionRecordFilter | undefined => {
        switch (value) {
            case CsvPredictionRecordFilter.All:
                return CsvPredictionRecordFilter.All;
            case CsvPredictionRecordFilter.AllDisagree:
                return CsvPredictionRecordFilter.AllDisagree;
            case CsvPredictionRecordFilter.AllBelowConfidence:
                return CsvPredictionRecordFilter.AllBelowConfidence;
            case CsvPredictionRecordFilter.DisagreeBelowConfidence:
                return CsvPredictionRecordFilter.DisagreeBelowConfidence;
            default:
                return;
        }
    }
}

