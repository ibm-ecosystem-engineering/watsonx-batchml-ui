import {Atom, atom} from "jotai";
import {atomWithRefresh, loadable} from "jotai/utils";

import {
    CsvDocumentModel,
    CsvDocumentRecordModel,
    CsvDocumentStatusFilter,
    CsvPredictionModel,
    CsvPredictionRecordFilter,
    CsvPredictionResultModel, defaultPageSize, PaginationResultModel
} from "../models";
import {csvDocumentApi, CsvDocumentApi} from '../services'

const service: CsvDocumentApi = csvDocumentApi()

export const csvDocumentStatusAtom = atom<CsvDocumentStatusFilter | undefined>(undefined)

export const documentsPageAtom = atom(1)
export const documentsPageSizeAtom = atom(defaultPageSize)

export const csvDocumentsAtom = atomWithRefresh(
    (get) => {
        const page = get(documentsPageAtom)
        const pageSize = get(documentsPageSizeAtom)

        return service.listCsvDocuments({page, pageSize}, {status: get(csvDocumentStatusAtom), refreshCache: true})
    }
)

export const csvDocumentsLoadable = loadable(csvDocumentsAtom)

export const selectedDocumentIdAtom = atom(undefined as string)

export const selectedDocumentAtom: Atom<Promise<CsvDocumentModel | undefined>> = atom(
    get => {
        const id: string | undefined = get(selectedDocumentIdAtom)

        if (!id) {
            return Promise.resolve(undefined)
        }

        return service.getCvsDocument(id)
    }
)
export const selectedDocumentLoadable = loadable(selectedDocumentAtom)

export const recordsPageAtom = atom(1)
export const recordsPageSizeAtom = atom(defaultPageSize)

export const selectedCsvRecordsAtom1: Atom<Promise<PaginationResultModel<CsvDocumentRecordModel>>> = atom(
    get => {
        const id: string | undefined = get(selectedDocumentIdAtom)
        const page = get(recordsPageAtom)
        const pageSize = get(recordsPageSizeAtom)

        if (!id) {
            return Promise.resolve({
                metadata: {totalCount: 0, page, pageSize},
                data: []
            })
        }

        return service.listCsvDocumentRecords(id, {page, pageSize})
    }
)
export const selectedCsvRecordsLoadable1 = loadable(selectedCsvRecordsAtom1)

export const selectedCsvPredictionsAtom: Atom<Promise<CsvPredictionModel[]>> = atom(
    get => {
        const id: string | undefined = get(selectedDocumentIdAtom)

        if (!id) {
            return Promise.resolve([])
        }

        return service.listCsvPredictions(id)
    }
)
export const selectedCsvPredictionsLoadable = loadable(selectedCsvPredictionsAtom)

export const selectedPredictionAtom = atom(undefined as CsvPredictionModel)

export const selectedPredictionRecordsAtom: Atom<Promise<PaginationResultModel<CsvPredictionResultModel>>> = atom(
    get => {
        const prediction: CsvPredictionModel | undefined = get(selectedPredictionAtom)
        const filter = get(predictionRecordFilterAtom)
        const excludeSkip = get(predictionRecordExcludeSkip)
        const page = get(recordsPageAtom)
        const pageSize = get(recordsPageSizeAtom)

        if (!prediction) {
            return Promise.resolve({
                metadata: {totalCount: 0, page: 1, pageSize: 20},
                data: []
            })
        }

        console.log('Looking with filter: ', {filter})

        return service.listCsvPredictionRecords(prediction.id, {page, pageSize}, {filter, excludeSkip})
    }
)

export const selectedPredictionRecordsLoadable = loadable(selectedPredictionRecordsAtom)

export const predictionRecordFilterAtom = atom(CsvPredictionRecordFilter.All)

export const predictionRecordExcludeSkip = atom(true)
