// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import {DataTable} from "../../../../components";
import {addressToText, employmentStatusToText, maritalStatusToText, OtherParentModel} from "../../../../models";
import {formatGender, formatPhone} from "../../../../utils";

export interface OtherParentsPanelProps {
    otherParents?: OtherParentModel[]
}

interface OtherParentRow {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    emailAddress: string;
    phoneNumber: string;
    maritalStatus: string;
    employmentStatus: string;
    mailingAddress: string;
}

const headerData: Array<{header: string, key: keyof OtherParentRow}> = [
    {header: 'First name', key: 'firstName'},
    {header: 'Last name', key: 'lastName'},
    {header: 'Gender', key: 'gender'},
    {header: 'Email address', key: 'emailAddress'},
    {header: 'Phone', key: 'phoneNumber'},
    {header: 'Marital status', key: 'maritalStatus'},
    {header: 'Employment status', key: 'employmentStatus'},
    {header: 'Address', key: 'mailingAddress'},
]

export const OtherParentsPanel: React.FunctionComponent<OtherParentsPanelProps> = (props: OtherParentsPanelProps) => {
    const data = props.otherParents || []

    if (data.length === 0) {
        return (<div style={{textAlign: 'left'}}>Not applicable</div>)
    }

    const rowData: OtherParentRow[] = data.map((dep: OtherParentModel) => ({
        id: dep.id,
        firstName: dep.firstName,
        lastName: dep.lastName,
        gender: formatGender(dep.gender),
        emailAddress: dep.emailAddress,
        phoneNumber: formatPhone(dep.phoneNumber),
        maritalStatus: maritalStatusToText(dep.maritalStatus),
        employmentStatus: employmentStatusToText(dep.employmentStatus),
        mailingAddress: addressToText(dep.mailingAddress),
    }))

    return (<DataTable headerData={headerData} rowData={rowData} />)
}
