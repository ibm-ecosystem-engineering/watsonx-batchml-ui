
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {DependentModel, personName, relationshipToText} from "../../../../models";
import {DataTable} from "../../../../components";
import {booleanToYesNo, formatDate, formatGender} from "../../../../utils";

export interface DependentsPanelProps {
    dependents: DependentModel[]
}

interface DependentRow {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    livesWithApplicant: string;
    applicantRelationship: string;
    father: string;
    mother: string;
}

const headerData: Array<{header: string, key: keyof DependentRow}> = [
    {header: 'First name', key: 'firstName'},
    {header: 'Last name', key: 'lastName'},
    {header: 'Birth date', key: 'birthDate'},
    {header: 'Gender', key: 'gender'},
    {header: 'Lives w/ appl', key: 'livesWithApplicant'},
    {header: 'App rel', key: 'applicantRelationship'},
    {header: 'Father', key: 'father'},
    {header: 'Mother', key: 'mother'}
]

export const DependentsPanel: React.FunctionComponent<DependentsPanelProps> = (props: DependentsPanelProps) => {

    const data = props.dependents || []

    if (data.length === 0) {
        return (<div>No information provided</div>)
    }

    const rowData: DependentRow[] = data.map((dep: DependentModel) => ({
        id: dep.id,
        firstName: dep.firstName,
        lastName: dep.lastName,
        birthDate: formatDate(dep.birthDate),
        gender: formatGender(dep.gender),
        livesWithApplicant: booleanToYesNo(dep.livesWithApplicant),
        applicantRelationship: relationshipToText(dep.relationshipToApplicant),
        father: personName(dep.father),
        mother: personName(dep.mother),
    }))

    return (<DataTable headerData={headerData} rowData={rowData} />)
}
