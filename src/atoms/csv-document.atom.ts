import {Atom, atom} from "jotai";
import {atomWithRefresh, loadable} from "jotai/utils";

import {
    CsvDocumentModel,
    CsvDocumentRecordModel,
    CsvDocumentStatusFilter,
    CsvPredictionModel,
    CsvPredictionRecordFilter,
    CsvPredictionResultModel
} from "../models";
import {csvDocumentApi, CsvDocumentApi} from '../services'

const service: CsvDocumentApi = csvDocumentApi()

export const csvDocumentStatusAtom = atom<CsvDocumentStatusFilter | undefined>(undefined)

export const csvDocumentsAtom = atomWithRefresh(
    (get) => service.listCsvDocuments({status: get(csvDocumentStatusAtom), refreshCache: true})
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

export const selectedCsvRecordsAtom: Atom<Promise<CsvDocumentRecordModel[]>> = atom(
    get => {
        const id: string | undefined = get(selectedDocumentIdAtom)

        if (!id) {
            return Promise.resolve([])
        }

        return service.listCsvDocumentRecords(id)
    }
)
export const selectedCsvRecordsLoadable = loadable(selectedCsvRecordsAtom)

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

export const selectedPredictionRecordsAtom: Atom<Promise<CsvPredictionResultModel[]>> = atom(
    get => {
        const prediction: CsvPredictionModel | undefined = get(selectedPredictionAtom)
        const filter = get(predictionRecordFilterAtom)

        if (!prediction) {
            return Promise.resolve([])
        }

        console.log('Looking with filter: ', {filter})

        return service.listCsvPredictionRecords(prediction.id, {filter})
    }
)

export const selectedPredictionRecordsLoadable = loadable(selectedPredictionRecordsAtom)

export const predictionRecordFilterAtom = atom(CsvPredictionRecordFilter.All)
