import {PerformanceSummaryModel} from "../../models";
import React from "react";

export interface PerformanceSummaryViewProps {
    data: PerformanceSummaryModel
}

export const PerformanceSummaryView: React.FunctionComponent<PerformanceSummaryViewProps> = ({data}: PerformanceSummaryViewProps) => {

    const formatPercent = (num: number, den: number): string => {
        const value = num / den

        return '(' + (value * 100).toFixed(2) + '%)'
    }

    const agreeAboveThresholdPercent = formatPercent(data.agreeAboveThreshold, data.totalCount)
    const agreeBelowThresholdPercent = formatPercent(data.agreeBelowThreshold, data.totalCount)
    const disagreeAboveThresholdPercent = formatPercent(data.disagreeAboveThreshold, data.totalCount)
    const disagreeBelowThresholdPercent = formatPercent(data.disagreeBelowThreshold, data.totalCount)

    return (<div style={{display: 'grid', fontSize: 'small'}}>
        <div style={{gridColumn: 1}}>&nbsp;</div><div style={{fontWeight: 'bold', gridColumn: 2, textAlign: 'center'}}>Agree</div><div style={{fontWeight: 'bold', textAlign: 'center', gridColumn: 3}}>Disagree</div><div style={{fontWeight: 'bold', textAlign: 'center', gridColumn: 4}}>Corr</div>
        <div style={{gridColumn: 1, fontWeight: 'bold'}}>Above</div><div style={{gridColumn: 2, textAlign: 'center'}}>{data.agreeAboveThreshold} {agreeAboveThresholdPercent}</div><div style={{gridColumn: 3, textAlign: 'center'}}>{data.disagreeAboveThreshold} {disagreeAboveThresholdPercent}</div><div style={{gridColumn: 4, textAlign: 'center', gridRowStart: 2, gridRowEnd: 3}}>{data.correctedRecords || 0}</div>
        <div style={{gridColumn: 1, fontWeight: 'bold'}}>Below</div><div style={{gridColumn: 2, textAlign: 'center'}}>{data.agreeBelowThreshold} {agreeBelowThresholdPercent}</div><div style={{gridColumn: 3, textAlign: 'center'}}>{data.disagreeBelowThreshold} {disagreeBelowThresholdPercent}</div>
    </div>)
}
