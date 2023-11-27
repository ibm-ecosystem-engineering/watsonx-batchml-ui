
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {Stack} from "../../../../components";
import {
    FamilyAllowanceStatus,
    familyAllowanceStatusToText,
    FamilyAllowanceType,
    familyAllowanceTypeToText
} from "../../../../models";
import {InfoRow} from "../../../../components/InfoRow";

export interface CaseHeadingViewProps {
    status: FamilyAllowanceStatus
    changeType: FamilyAllowanceType
}

export const CaseHeadingView: React.FunctionComponent<CaseHeadingViewProps> = ({status, changeType}: CaseHeadingViewProps) => {

    return (
        <div style={{paddingBottom: '10px'}}>
        <Stack gap={3}>
            <InfoRow label="Status" text={familyAllowanceStatusToText(status)} />
            <InfoRow label="Type" text={familyAllowanceTypeToText(changeType)} />
        </Stack>
        </div>
    )
}
