import {CsvDocumentApi} from "./csv-document.api";
import {CsvDocumentGraphql} from "./csv-document.graphql";

export * from './csv-document.api'

let _instance: CsvDocumentApi;
export const csvDocumentApi = (): CsvDocumentApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new CsvDocumentGraphql()
}
