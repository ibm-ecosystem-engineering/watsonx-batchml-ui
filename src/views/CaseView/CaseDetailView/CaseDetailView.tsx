
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@carbon/react";

import {RequiredInformationView} from "./RequiredInformationView";
import {SupportingDocumentsView} from "./SupportingDocumentsView";
import {CaseHeadingView} from "./CaseHeadingView";
import {ApplicantPanel, DependentsPanel, OtherParentsPanel, SpousePanel} from "./Panels";
import {FamilyAllowanceModel} from "../../../models";

export interface CaseDetailViewProps {
    familyAllowanceCase: FamilyAllowanceModel
}

export const CaseDetailView: React.FunctionComponent<CaseDetailViewProps> = (props: CaseDetailViewProps) => {
    const data: FamilyAllowanceModel = props.familyAllowanceCase

    return (
        <div>
            <CaseHeadingView status={data.status} changeType={data.changeType} />
            <RequiredInformationView caseId={data.id} status={data.status} requiredInformation={data.requiredInformation} />
            <Tabs>
                <TabList aria-label="Family Application Case sections">
                    <Tab>Applicant</Tab>
                    <Tab>Spouse/Partner</Tab>
                    <Tab>Other parents</Tab>
                    <Tab>Dependents</Tab>
                    <Tab>Supporting documents</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel><ApplicantPanel applicant={data.applicant} /></TabPanel>
                    <TabPanel><SpousePanel spouse={data.spouse} applicantMaritalStatus={data.applicant?.maritalStatus} /></TabPanel>
                    <TabPanel><OtherParentsPanel otherParents={data.otherParents} /></TabPanel>
                    <TabPanel><DependentsPanel dependents={data.dependents} /></TabPanel>
                    <TabPanel><SupportingDocumentsView caseId={data.id} status={data.status} supportingDocuments={data.supportingDocuments} /></TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}
