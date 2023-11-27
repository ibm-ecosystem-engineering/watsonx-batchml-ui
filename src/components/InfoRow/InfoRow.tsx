// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import './InfoRow.scss'

export interface InfoRowProps {
    label: string;
    text: string;
    minLabelWidth?: string;
}

export const InfoRow: React.FunctionComponent<InfoRowProps> = ({label, text, minLabelWidth}: InfoRowProps) => {

    const style = minLabelWidth ? {minWidth: minLabelWidth} : {}

    return (
        <div className="infoRow">
            <div className="label" style={style}>{label}:</div>
            <div className="text">{text}</div>
        </div>
    )
}

