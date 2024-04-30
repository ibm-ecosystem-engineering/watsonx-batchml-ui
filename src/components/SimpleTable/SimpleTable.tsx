
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import './SimpleTable.scss';

export interface TableRow {
    label: string | React.ReactNode,
    value: string | React.ReactNode
}

export interface SimpleTableProps {
    rows: TableRow[]
}

export const SimpleTable: React.FunctionComponent<SimpleTableProps> = (props: SimpleTableProps) => {

    return (<div className="simple-table">
        {props.rows.map((row: TableRow) => <TableRowView row={row} />)}
    </div>)
}

interface TableRowViewProps {
    row: TableRow;
}

const TableRowView: React.FunctionComponent<TableRowViewProps> = (props: TableRowViewProps) => {
    return (<><div className="label">{props.row.label}</div><div className="value">{props.row.value}</div></>)
}
