import {FamilyAllowanceModel} from "../../models";

export abstract class FileUploadApi {
    abstract uploadFile(caseId: string, name: string, file: File, description?: string): Promise<FamilyAllowanceModel>;
}
