import { IConverterOptions } from "./converterOptions";

export interface IConverter<DataType> {
    convert(options: IConverterOptions): DataType;
}