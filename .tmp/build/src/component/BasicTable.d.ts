import * as React from 'react';
export interface Entry {
    name: string | number;
    value: string | number;
}
export interface Props {
    style?: React.CSSProperties;
    tableHeader: string;
    tableHeaderColumn: string;
    tableRow: Entry[];
}
export declare const BasicTable: React.FunctionComponent<Props>;
