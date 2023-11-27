// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import {InfoRow, Stack} from "../../../../components";
import {addressToText, EmployeeModel, maritalStatusToText, personName} from "../../../../models";
import {formatPhone} from "../../../../utils";

export interface ApplicantPanelProps {
    applicant: EmployeeModel
}

export const ApplicantPanel: React.FunctionComponent<ApplicantPanelProps> = (props: ApplicantPanelProps) => {

    const data = props.applicant

    if (!data) {
        return (<div>No information provided</div>)
    }

    const minLabelWidth: string = '150px'

    return (
        <Stack gap={5}>
            <InfoRow minLabelWidth={minLabelWidth} label="Name" text={personName(data)} />
            <InfoRow minLabelWidth={minLabelWidth} label="Employee ID" text={data.employeeId} />
            <InfoRow minLabelWidth={minLabelWidth} label="Gender" text={data.gender} />
            <InfoRow minLabelWidth={minLabelWidth} label="Marital status" text={maritalStatusToText(data.maritalStatus)} />
            <InfoRow minLabelWidth={minLabelWidth} label="Email address" text={data.emailAddress} />
            <InfoRow minLabelWidth={minLabelWidth} label="Phone" text={formatPhone(data.phoneNumber)} />
            <InfoRow minLabelWidth={minLabelWidth} label="Mailing address" text={addressToText(data.mailingAddress)} />
        </Stack>
    )
}
