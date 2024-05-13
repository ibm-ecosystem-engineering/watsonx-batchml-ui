
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {Button} from "@carbon/react";
import { ArrowLeft, ArrowRight } from '@carbon/icons-react';

export interface PaginationProps {
    page: number;
    pageSize: number;
    totalCount: number;
    setPage: (page: number) => void;
    setPageSize?: (pageSize: number) => void;
}

export const Pagination: React.FunctionComponent<PaginationProps> = ({page, pageSize, totalCount, setPage}: PaginationProps) => {
    if (!page || !pageSize) {
        return (<></>)
    }

    const start = ((page - 1) * pageSize) + 1;
    const end: number = (page * pageSize);
    const totalText = totalCount ? ` of ${totalCount}` : '';
    const totalPages = totalCount ? ((totalCount / pageSize) + (totalCount % pageSize > 0 ? 1 : 0)) : Number.MAX_SAFE_INTEGER

    return (<div style={{width: '100%', backgroundColor: 'var(--cds-layer)', overflow: 'auto'}}>
        <div style={{width: '200px', float: 'left', paddingTop: '8px'}}>Items: {start}-{end}{totalText}</div>
        <div style={{float: 'right'}}>
            <Button renderIcon={ArrowLeft} size="sm" hasIconOnly={true} disabled={page === 1} onClick={() => setPage(page - 1)}></Button>
            <Button renderIcon={ArrowRight} size="sm" hasIconOnly={true} disabled={page > totalPages} onClick={() => setPage(page + 1)}></Button>
        </div>
        <div style={{width: '80px', float: 'right', paddingTop: '8px'}}>page {page}</div>
    </div>)
}
