
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {CSSProperties} from 'react';
import {Stack as CarbonStack} from "@carbon/react/lib/components/Stack"

export interface StackProps {
    gap: number;
    style?: CSSProperties;
    children: unknown | unknown[];
}

export const Stack: React.FunctionComponent<StackProps> = (props: StackProps) => {

    return (
        <CarbonStack gap={props.gap} style={props.style}>
            {props.children}
        </CarbonStack>
    )
}
