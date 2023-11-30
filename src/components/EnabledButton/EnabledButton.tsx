// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {MouseEventHandler, ReactNode} from 'react';
import { Button } from '@carbon/react';

export interface EnabledButtonProps {
    enabled: boolean
    type?: 'button' | 'submit' | 'reset'
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    onClick?: MouseEventHandler<HTMLButtonElement>
    children: ReactNode | ReactNode[]
}

export const EnabledButton: React.FunctionComponent<EnabledButtonProps> = ({enabled, type, size, onClick, children}: EnabledButtonProps) => {
    if (!enabled) {
        return (<></>)
    }

    return (<Button type={type || 'submit'} size={size || 'sm'} onClick={onClick}>{children}</Button>)
}
