import { IDataRepresentationColumnMappingItem } from "./dataRepresentationColumnMappingItem";

export interface IDataRepresentationColumnMapping {
    [columnName: string]: IDataRepresentationColumnMappingItem;
}