import {FamilyAllowanceCaseApi} from "./family-allowance-case.api.ts";
import {FamilyAllowanceCaseGraphql} from "./family-allowance-case.graphql.ts";

export * from './family-allowance-case.api.ts'

let _instance: FamilyAllowanceCaseApi;
export const familyAllowanceCaseApi = (): FamilyAllowanceCaseApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new FamilyAllowanceCaseGraphql()
}
