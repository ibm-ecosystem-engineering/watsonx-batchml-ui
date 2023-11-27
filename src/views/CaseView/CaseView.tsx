
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useParams} from "react-router-dom";
import {Loading} from "@carbon/react";
import {useAtomValue, useSetAtom} from "jotai";

import './CaseView.scss'
import {CaseDetailView} from "./CaseDetailView";
import {familyAllowanceCaseAtom, familyAllowanceCaseLoadable} from "../../atoms";
import {FamilyAllowanceModel} from "../../models";

export interface CaseViewProps {
}

const CaseLoading = () => {
    return (<Loading active={true} className="" description="Loading case" small={false} withOverlay={false} />)
}

export const CaseView: React.FunctionComponent<CaseViewProps> = () => {
    const { id } = useParams();
    const loadable = useAtomValue(familyAllowanceCaseLoadable)
    const setCaseId = useSetAtom(familyAllowanceCaseAtom)

    if (loadable.state === 'loading') {
        return (<CaseLoading />)
    }

    if (loadable.state === 'hasError') {
        return (<div>Error loading case</div>)
    }

    const familyAllowanceCase: FamilyAllowanceModel = loadable.data

    if (familyAllowanceCase?.id !== id) {
        setCaseId(id)
        return (<CaseLoading />)
    }

    return (<CaseDetailView familyAllowanceCase={familyAllowanceCase} />)
}
