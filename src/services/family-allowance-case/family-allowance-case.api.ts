import {FamilyAllowanceModel, FamilyAllowanceStatusFilter} from "../../models";

export abstract class FamilyAllowanceCaseApi {

    abstract listFamilyAllowanceCases(filter?: FamilyAllowanceStatusFilter): Promise<FamilyAllowanceModel[]>;

    abstract getFamilyAllowanceCase(id: string): Promise<FamilyAllowanceModel>;

    abstract updateRequiredInformation(caseId: string, infoId: string, completed: boolean): Promise<FamilyAllowanceModel>;

    abstract markFamilyAllowanceCaseReadyForReview(id: string): Promise<FamilyAllowanceModel>;

}
