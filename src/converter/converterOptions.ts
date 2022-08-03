import powerbi from "powerbi-visuals-api";

import { SettingsState } from "../services/state/settingsState";
import { Settings } from "../settings/settings";
import { IDataRepresentationColumnMapping } from "./columnMapping/dataRepresentation/dataRepresentationColumnMapping";

export interface IConverterOptions {
    columnMapping: IDataRepresentationColumnMapping;
    dataView: powerbi.DataView;
    settings: Settings;
    settingsState: SettingsState;
    viewMode: powerbi.ViewMode;
    viewport: powerbi.IViewport;
}