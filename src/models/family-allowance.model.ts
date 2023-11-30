export interface DependentModel {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    governmentId: string;
    livesWithApplicant: boolean;
    relationshipToApplicant: FamilyAllowanceRelationship;
    father?: PersonModel;
    mother?: PersonModel;
}

export interface DocumentModel {
    id: string;
    name: string;
    type: string;
    url: string;
    description?: string;
}

export interface DocumentWithContentModel extends DocumentModel {
    content: Buffer
}

export interface ActivityModel {
    id: string;
    timestamp: string;
    actor: string;
    type: string;
    comment: string;
}

export enum FamilyAllowanceStatus {
    ReadyForReview = 'ReadyForReview',
    NeedsInfo = 'NeedsInfo',
    Reviewed = 'Reviewed',
    PendingApproval = 'PendingApproval',
    Approved = 'Approved',
    Denied = 'Denied',
    PendingBookings = 'PendingBookings',
    CompletedBookings = 'CompletedBookings',
    Closed = 'Closed'
}

export enum FamilyAllowanceStatusFilter {
    All = 'All',
    ReadyForReview = 'ReadyForReview',
    NeedsInfo = 'NeedsInfo',
    Reviewed = 'Reviewed',
    PendingApproval = 'PendingApproval',
    Approved = 'Approved',
    Denied = 'Denied',
    PendingBookings = 'PendingBookings',
    CompletedBookings = 'CompletedBookings',
    Closed = 'Closed'
}

export const mapFamilyAllowanceStatus = (filter?: FamilyAllowanceStatusFilter): FamilyAllowanceStatus | undefined => {
    if (!filter) {
        return
    }

    switch (filter) {
        case FamilyAllowanceStatusFilter.All:
            return
        default:
            return FamilyAllowanceStatus[filter]
    }
}

export const familyAllowanceStatusToText = (status?: FamilyAllowanceStatus, defaultValue: string = ''): string => {
    if (!status) {
        return defaultValue
    }
    return FamilyAllowanceStatus[status]
}

export enum FamilyAllowanceType {
    Birth = 'Birth',
    Adoption = 'Adoption',
    ChildAllowance = 'Child Allowance',
    TrainingAllowance = 'Training Allowance'
}

export const familyAllowanceTypeToText = (val?: FamilyAllowanceType, defaultValue: string = ''): string => {
    if (!val) {
        return defaultValue
    }
    return FamilyAllowanceType[val]
}

export enum FamilyAllowanceRelationship {
    Father = 'Father',
    Mother = 'Mother',
    StepFather = 'Step Father',
    StepMother = 'Step Mother'
}

export const relationshipToText = (val?: FamilyAllowanceRelationship, defaultValue: string = ''): string => {
    if (!val) {
        return defaultValue
    }
    return FamilyAllowanceRelationship[val]
}

export enum FamilyAllowanceEmploymentStatus {
    Employed = 'Employed',
    SelfEmployed = 'Self Employed',
    Unemployed = 'Unemployed'
}

export const employmentStatusToText = (status?: FamilyAllowanceEmploymentStatus, defaultValue: string = ''): string => {
    if (!status) {
        return defaultValue
    }
    return FamilyAllowanceEmploymentStatus[status]
}

export enum FamilyAllowanceMaritalStatus {
    Married = 'Married',
    Divorced = 'Divorced',
    NotMarried = 'Not Married'
}

export const maritalStatusToText = (status?: FamilyAllowanceMaritalStatus, defaultValue: string = ''): string => {
    if (!status) {
        return defaultValue
    }

    return FamilyAllowanceMaritalStatus[status]
}

export interface AddressModel {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    canton: string;
    country: string;
    postalCode: string;
}

export const addressToText = (address?: AddressModel, defaultValue: string = ''): string => {
    if (!address) {
        return defaultValue
    }

    return `${address.addressLine1} ${address.addressLine2 || ''} ${address.city}, ${address.country} ${address.postalCode}`
}

export interface PersonModel {
    id: string;
    firstName: string;
    lastName: string;
    governmentId: string;
    emailAddress: string;
    phoneNumber: string;
    mailingAddress: AddressModel;
    maritalStatus: FamilyAllowanceMaritalStatus;
    gender: string;
}

export interface EmployeeModel extends PersonModel {
    employeeId: string;
}

export interface OtherParentModel extends PersonModel {
    employmentStatus: FamilyAllowanceEmploymentStatus;
}

export interface SpouseModel extends OtherParentModel {
    marriedToApplicant: boolean;
}

export interface FamilyAllowanceBasicModel {
    id: string;
    changeType: FamilyAllowanceType;
    status: FamilyAllowanceStatus;
    applicant: EmployeeModel;
    spouse?: SpouseModel;
    otherParents?: OtherParentModel[];
    dependents: DependentModel[];
}

export interface RequiredInformationModel {
    id: string;
    description: string;
    completed: boolean;
}

export interface FamilyAllowanceModel<D extends DocumentModel = DocumentModel> extends FamilyAllowanceBasicModel {
    supportingDocuments: D[];
    requiredInformation: RequiredInformationModel[];
    history: ActivityModel[];
}

export const isFamilyAllowanceModel = (data: unknown): data is FamilyAllowanceModel => {
    return !!data && !!(data as FamilyAllowanceModel).applicant
}

export interface ReviewInputModel {
    requiredInformation?: string[]
    comment?: string
}

export const personName = (name?: {firstName: string, lastName: string}, defaultValue: string = ''): string => {
    if (!name) {
        return defaultValue
    }

    return `${name.firstName} ${name.lastName}`
}
