import {ApolloClient, FetchResult, gql} from "@apollo/client";

import {FamilyAllowanceCaseApi} from "./family-allowance-case.api.ts";
import {getApolloClient} from "../../backends";
import {FamilyAllowanceModel, FamilyAllowanceStatusFilter} from "../../models";

const QUERY_LIST_CASES = gql`
query ListCases($status: FamilyAllowanceStatusFilter) {
    listFamilyAllowanceCases(status: $status) {
        id
        status
        changeType
        applicant {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            employeeId
            gender
            maritalStatus
            mailingAddress {
                addressLine1
                addressLine2
                canton
                city
                country
                postalCode
            }
        }
        spouse {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            gender
            maritalStatus
            mailingAddress {
                addressLine1
                addressLine2
                canton
                city
                country
                postalCode
            }
            employmentStatus
            marriedToApplicant
        }
        otherParents {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            gender
            maritalStatus
            mailingAddress {
                addressLine1
                addressLine2
                canton
                city
                country
                postalCode
            }
            employmentStatus
        }
        dependents {
            id
            firstName
            lastName
            birthDate
            gender
            father {
                firstName
                lastName
            }
            mother {
                firstName
                lastName
            }
            livesWithApplicant
            relationshipToApplicant
        }
        requiredInformation {
            id
            description
            completed
        }
        supportingDocuments {
            id
            name
            url
            type
            description
        }
    }
}
`
type ReturnTypeQueryListCases = {listFamilyAllowanceCases: FamilyAllowanceModel[]}

const QUERY_GET_CASE = gql`
query GetCase($id: ID!) {
    getFamilyAllowanceCase(id: $id) {
        id
        status
        changeType
        applicant {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            employeeId
            gender
            maritalStatus
            mailingAddress {
                addressLine1
                addressLine2
                canton
                city
                country
                postalCode
            }
        }
        spouse {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            gender
            maritalStatus
            mailingAddress {
                addressLine1
                addressLine2
                canton
                city
                country
                postalCode
            }
            employmentStatus
            marriedToApplicant
        }
        otherParents {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            gender
            maritalStatus
            mailingAddress {
                addressLine1
                addressLine2
                canton
                city
                country
                postalCode
            }
            employmentStatus
        }
        dependents {
            id
            firstName
            lastName
            birthDate
            gender
            father {
                firstName
                lastName
            }
            mother {
                firstName
                lastName
            }
            livesWithApplicant
            relationshipToApplicant
        }
        requiredInformation {
            id
            description
            completed
        }
        supportingDocuments {
            id
            name
            url
            type
            description
        }
    }
}
`
type ReturnTypeQueryGetCase = {getFamilyAllowanceCase: FamilyAllowanceModel}

const MUTATION_UPDATE_REQUIRED_INFO = gql`
mutation UpdateRequiredInfo($caseId: ID!, $infoId: ID!, $completed: Boolean!) {
    updateRequiredInformation(caseId: $caseId, infoId: $infoId, completed: $completed) {
        id
        status
        changeType
        applicant {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            employeeId
            gender
            maritalStatus
            mailingAddress {
                addressLine1
                addressLine2
                canton
                city
                country
                postalCode
            }
        }
        spouse {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            gender
            maritalStatus
            mailingAddress {
                addressLine1
                addressLine2
                canton
                city
                country
                postalCode
            }
            employmentStatus
            marriedToApplicant
        }
        otherParents {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            gender
            maritalStatus
            mailingAddress {
                addressLine1
                addressLine2
                canton
                city
                country
                postalCode
            }
            employmentStatus
        }
        dependents {
            id
            firstName
            lastName
            birthDate
            gender
            father {
                firstName
                lastName
            }
            mother {
                firstName
                lastName
            }
            livesWithApplicant
            relationshipToApplicant
        }
        requiredInformation {
            id
            description
            completed
        }
        supportingDocuments {
            id
            name
            url
            type
            description
        }
    }
}
`
type ReturnTypeMutationUpdateRequiredInfo = {updateRequiredInformation: FamilyAllowanceModel}

const MUTATION_MARK_READY_FOR_REVIEW = gql`
mutation MarkReadyForReview($id: ID!) {
    markFamilyAllowanceCaseReadyForReview(id: $id) {
        id
        status
        changeType
        applicant {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            employeeId
            gender
            maritalStatus
            mailingAddress {
                addressLine1
                addressLine2
                canton
                city
                country
                postalCode
            }
        }
        spouse {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            gender
            maritalStatus
            mailingAddress {
                addressLine1
                addressLine2
                canton
                city
                country
                postalCode
            }
            employmentStatus
            marriedToApplicant
        }
        otherParents {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            gender
            maritalStatus
            mailingAddress {
                addressLine1
                addressLine2
                canton
                city
                country
                postalCode
            }
            employmentStatus
        }
        dependents {
            id
            firstName
            lastName
            birthDate
            gender
            father {
                firstName
                lastName
            }
            mother {
                firstName
                lastName
            }
            livesWithApplicant
            relationshipToApplicant
        }
        requiredInformation {
            id
            description
            completed
        }
        supportingDocuments {
            id
            name
            url
            type
            description
        }
    }
}
`
type ReturnTypeMutationReadyForReview = {markFamilyAllowanceCaseReadyForReview: FamilyAllowanceModel}


export class FamilyAllowanceCaseGraphql implements FamilyAllowanceCaseApi {
    client: ApolloClient<unknown>;

    constructor() {
        this.client = getApolloClient();
    }

    async listFamilyAllowanceCases(filter: FamilyAllowanceStatusFilter = FamilyAllowanceStatusFilter.All): Promise<FamilyAllowanceModel[]> {
        return this.client
            .query<ReturnTypeQueryListCases>({
                query: QUERY_LIST_CASES,
                variables: {filter}
            })
            .then((result: FetchResult<ReturnTypeQueryListCases>) => {
                return result.data.listFamilyAllowanceCases
            })
    }

    async getFamilyAllowanceCase(id: string): Promise<FamilyAllowanceModel> {
        return this.client
            .query<ReturnTypeQueryGetCase>({
                query: QUERY_GET_CASE,
                variables: {id},
            })
            .then((result: FetchResult<ReturnTypeQueryGetCase>) => {
                return result.data?.getFamilyAllowanceCase
            })
    }

    async updateRequiredInformation(caseId: string, infoId: string, completed: boolean): Promise<FamilyAllowanceModel> {
        return this.client
            .mutate<ReturnTypeMutationUpdateRequiredInfo>({
                mutation: MUTATION_UPDATE_REQUIRED_INFO,
                variables: {caseId, infoId, completed},
                refetchQueries: [{query: QUERY_LIST_CASES}, {query: QUERY_GET_CASE, variables: {id: caseId}}],
                awaitRefetchQueries: true,
            })
            .then(async (result: FetchResult<ReturnTypeMutationUpdateRequiredInfo>) => {
                return result.data?.updateRequiredInformation
            })
    }

    async markFamilyAllowanceCaseReadyForReview(id: string): Promise<FamilyAllowanceModel> {
        return this.client
            .mutate<ReturnTypeMutationReadyForReview>({
                mutation: MUTATION_MARK_READY_FOR_REVIEW,
                variables: {id},
                refetchQueries: [{query: QUERY_LIST_CASES}, {query: QUERY_GET_CASE, variables: {id}}],
                awaitRefetchQueries: true,
            })
            .then(async (result: FetchResult<ReturnTypeMutationReadyForReview>) => {
                return result.data?.markFamilyAllowanceCaseReadyForReview
            })
    }

}