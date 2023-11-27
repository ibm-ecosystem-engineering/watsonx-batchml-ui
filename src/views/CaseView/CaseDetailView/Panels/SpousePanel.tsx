// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {
    addressToText,
    employmentStatusToText,
    FamilyAllowanceMaritalStatus,
    maritalStatusToText, personName,
    SpouseModel
} from "../../../../models";
import {Stack} from "../../../../components";
import {InfoRow} from "../../../../components/InfoRow";
import {booleanToYesNo, formatPhone} from "../../../../utils";

export interface SpousePanelProps {
    spouse?: SpouseModel
    applicantMaritalStatus: FamilyAllowanceMaritalStatus
}

export const SpousePanel: React.FunctionComponent<SpousePanelProps> = (props: SpousePanelProps) => {
    const data = props.spouse

    if (!data) {
        if (props.applicantMaritalStatus === FamilyAllowanceMaritalStatus.Married) {
            return (<div>No information provided</div>)
        }

        return (<div>Not applicable</div>)
    }

    const minLabelWidth: string = '175px'

    return (
        <Stack gap={5}>
            <InfoRow minLabelWidth={minLabelWidth} label="Name" text={personName(data)} />
            <InfoRow minLabelWidth={minLabelWidth} label="Gender" text={data.gender} />
            <InfoRow minLabelWidth={minLabelWidth} label="Marital status" text={maritalStatusToText(data.maritalStatus)} />
            <InfoRow minLabelWidth={minLabelWidth} label="Email address" text={data.emailAddress} />
            <InfoRow minLabelWidth={minLabelWidth} label="Phone" text={formatPhone(data.phoneNumber)} />
            <InfoRow minLabelWidth={minLabelWidth} label="Married to applicant" text={booleanToYesNo(data.marriedToApplicant)} />
            <InfoRow minLabelWidth={minLabelWidth} label="Employment status" text={employmentStatusToText(data.employmentStatus)} />
            <InfoRow minLabelWidth={minLabelWidth} label="Mailing address" text={addressToText(data.mailingAddress)} />
        </Stack>
    )
}
