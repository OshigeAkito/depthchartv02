import { valueFormatter as vf } from "powerbi-visuals-utils-formattingutils";
import IValueFormatter = vf.IValueFormatter;

export interface VisualState {
    viewport: ViewportData;
    settings: Settings;
    measures: MeasureData[];
    category: CategoryData;
    entries: DataEntry[];
}

export interface Settings {
    color?: string;
    gridEnabled?: boolean;
    tooltipEnabled?: boolean;
    isClustered?: boolean;
}

export interface ViewportData {
    width: number;
    height: number;
}

export interface MeasureData {
    displayName: string;
    index: number;
    maxValue?: number;
    minValue?: number;
    queryName?: string;
    color: string;
    formatter: IValueFormatter;
}

export interface CategoryData {
    displayName: string;
    count: number;
    displayValues: string[];
    maxWidth: number;
    formatter: IValueFormatter;
}

export interface DataPoint {
    measureIndex: number;
    value: number;
    displayValue?: string;
}

export interface DataEntry {
    sum: number;
    index: number;
    name: string;
    dataPoints: DataPoint[];
}
