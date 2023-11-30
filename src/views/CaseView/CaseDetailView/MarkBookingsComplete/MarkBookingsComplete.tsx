// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {FormEvent} from 'react';
import {Form} from "@carbon/react";
import {useSetAtom} from "jotai";

import {familyAllowanceCaseAtom} from "../../../../atoms";
import {EnabledButton, Stack} from "../../../../components";
import {FamilyAllowanceStatus} from "../../../../models";
import {familyAllowanceCaseApi, FamilyAllowanceCaseApi} from "../../../../services";

export interface MarkBookingsCompleteProps {
    caseId: string;
    status: FamilyAllowanceStatus;
}

export const MarkBookingsComplete: React.FunctionComponent<MarkBookingsCompleteProps> = ({caseId, status}: MarkBookingsCompleteProps) => {
    const setFamilyAllowanceCase = useSetAtom(familyAllowanceCaseAtom)

    const enabled = FamilyAllowanceStatus[status] === FamilyAllowanceStatus.PendingBookings

    if (!enabled) {
        return (<></>)
    }

    const service: FamilyAllowanceCaseApi = familyAllowanceCaseApi()

    const updateCaseStatusToCompleted = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()

        service
            .markFamilyAllowanceCaseBookingsComplete(caseId)
            .then(setFamilyAllowanceCase)
    }

    return (
        <div style={{padding: '20px 0'}}>
            <Form className="" onSubmit={updateCaseStatusToCompleted}>
                <Stack gap={3}>
                    <EnabledButton enabled={enabled}>Bookings completed</EnabledButton>
                </Stack>
            </Form>
        </div>
    )

}
