import * as React from "react";
import '../../style/visual.less';
export interface State {
    tableHeader: string | number;
    tableHeaderColumn: string;
    tableRow: string | number;
}
export declare const initialState: State;
export declare class tableBase extends React.Component<{}, State> {
    private static updateCallback;
    static update(newState: State): void;
    state: State;
    componentWillMount(): void;
    componentWillUnmount(): void;
    constructor(props: any);
    render(): JSX.Element;
}
export default tableBase;
