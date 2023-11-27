// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {FormEvent} from 'react';
import {Button, Checkbox, Form, FormGroup} from "@carbon/react";
import {useSetAtom} from "jotai";

import {familyAllowanceCaseAtom} from "../../../../atoms";
import {Stack} from "../../../../components";
import {FamilyAllowanceStatus, RequiredInformationModel} from "../../../../models";
import {familyAllowanceCaseApi, FamilyAllowanceCaseApi} from "../../../../services";

export interface RequiredInformationViewProps {
    caseId: string;
    status: FamilyAllowanceStatus;
    requiredInformation?: RequiredInformationModel[];
}

const MyButton = ({enabled}: {enabled: boolean}) => {
    if (!enabled) {
        return (<></>)
    }

    return (<Button type="submit" size="sm">Submit for review</Button>)
}

export const RequiredInformationView: React.FunctionComponent<RequiredInformationViewProps> = ({status, caseId, requiredInformation}: RequiredInformationViewProps) => {
    const setFamilyAllowanceCase = useSetAtom(familyAllowanceCaseAtom)

    const data = requiredInformation || []

    if (data.length === 0) {
        return (<></>)
    }

    const service: FamilyAllowanceCaseApi = familyAllowanceCaseApi()

    const handleRequiredInformationCheck = (infoId: string, completed: boolean) => {
        service
            .updateRequiredInformation(caseId, infoId, completed)
            .then(setFamilyAllowanceCase)
    }

    const submitForReview = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()

        service
            .markFamilyAllowanceCaseReadyForReview(caseId)
            .then(setFamilyAllowanceCase)
    }

    const RequiredInfoCheckbox = ({info, enabled}: {info: RequiredInformationModel, enabled: boolean}) => {
        return (
            <Checkbox
                id={`reqinfo-${info.id}`}
                readOnly={!enabled}
                labelText={info.description}
                checked={info.completed}
                onChange={(_, {checked}: {checked: boolean}) => {
                    handleRequiredInformationCheck(info.id, checked)
                }}
            />)
    }

    const enabled = FamilyAllowanceStatus[status] === FamilyAllowanceStatus.NeedsInfo

    return (
        <div style={{padding: '20px 0'}}>
            <Form className="" onSubmit={submitForReview}>
                <Stack gap={3}>
                    <FormGroup legendText="Required information" style={{textAlign: 'left', padding: '10px 0'}}>
                        {data.map(info => (<RequiredInfoCheckbox key={info.id} info={info} enabled={enabled} />))}
                    </FormGroup>
                    <MyButton enabled={enabled} />
                </Stack>
            </Form>
        </div>
    )
}
