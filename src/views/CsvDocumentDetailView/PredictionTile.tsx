
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ReactNode} from 'react';

import './PredictionTile.scss';
import {Tile} from "@carbon/react";

export interface PredictionTileProps {
    label: string;
    value: string | ReactNode;
}

export const PredictionTile: React.FunctionComponent<PredictionTileProps> = ({label, value}: PredictionTileProps) => {

    return (
        <Tile className="prediction-tile">
            <div className="tile-label">{label}</div>
            <p style={{textAlign: 'center'}}>
                {value}
            </p>
        </Tile>
    )
}
