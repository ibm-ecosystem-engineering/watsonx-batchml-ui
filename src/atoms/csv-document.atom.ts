import {atom} from "jotai";
import {loadable, atomWithRefresh} from "jotai/utils";
import {csvDocumentApi, CsvDocumentApi} from '../services'
import {CsvDocumentModel, CsvDocumentRecordModel, CsvDocumentStatusFilter} from "../models";
import {isString} from "../utils";

const service: CsvDocumentApi = csvDocumentApi()

export const csvDocumentStatusAtom = atom<CsvDocumentStatusFilter | undefined>(undefined)

export const csvDocumentsAtom = atomWithRefresh(
    (get) => service.listCsvDocuments({status: get(csvDocumentStatusAtom), refreshCache: true})
)

export const csvDocumentsLoadable = loadable(csvDocumentsAtom)

export const selectedDocumentIdAtom = atom(undefined as string)

const baseSelectedAtom = atom(undefined as Promise<CsvDocumentModel>)
export const selectedDocumentAtom = atom(
    (get) => get(baseSelectedAtom),
    (_get, set, idOrValue: string | Promise<CsvDocumentModel>) => {
        if (isString(idOrValue)) {
            set(baseSelectedAtom, service.getCvsDocument(idOrValue))
        } else {
            set(baseSelectedAtom, idOrValue)
        }
    }
)

export const selectedDocumentLoadable = loadable(selectedDocumentAtom)

const baseCsvRecordsAtom = atom(undefined as CsvDocumentRecordModel[])
export const selectedDocumentRecords = atom(
    (get) => get(baseCsvRecordsAtom),
    async (_get, set, idValue?: string) => {
        const id = idValue || (await _get(baseSelectedAtom)).id

        set(baseCsvRecordsAtom, service.listCsvDocumentRecords(id))
    }
)