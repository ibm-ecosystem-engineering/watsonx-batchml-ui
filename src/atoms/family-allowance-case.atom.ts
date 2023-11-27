import {atom} from "jotai";
import {FamilyAllowanceModel, isFamilyAllowanceModel} from "../models";
import {familyAllowanceCaseApi} from "../services";
import {loadable} from "jotai/utils";

const baseAtom = atom<Promise<FamilyAllowanceModel | undefined>>(Promise.resolve(undefined))

const service = familyAllowanceCaseApi()

export const familyAllowanceCaseAtom = atom(
    get => get(baseAtom),
    (_get, set, id: string | FamilyAllowanceModel) => {
        if (isFamilyAllowanceModel(id)) {
            set(baseAtom, Promise.resolve(id))
        } else {
            set(baseAtom, service.getFamilyAllowanceCase(id))
        }
    }
)

export const familyAllowanceCaseLoadable = loadable(familyAllowanceCaseAtom)
