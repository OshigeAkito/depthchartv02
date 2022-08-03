// import powerbi from "powerbi-visuals-api";

// import { SeriesSettings } from "../../settings/seriesSettings";
// import { IVisualComponentStateBase } from "../../visualComponent/visualComponentStateBase";
// import { ISettingsServiceItem } from "../settingsService";
// import { State } from "./state";

// export interface ISettingsState extends IVisualComponentStateBase {
//     [seriesName: string]: SeriesSettings;
// }

// export class SettingsState extends State<ISettingsState> {
//     public get hasBeenUpdated(): boolean {
//         return !this.areStatesEqual(
//             this.state,
//             { ...this.state, ...this.tempState },
//         );
//     }

//     private maxNumberOfSupportedSeriesToBeSerialized: number = 20;
//     private tempState: ISettingsState = {};

//     public setSeriesSettings(seriesName: string, settings: SeriesSettings) {
//         if (this.tempState[seriesName]) {
//             return;
//         }

//         this.tempState[seriesName] = settings;
//     }

//     public getSeriesSettings(seriesName: string): powerbi.DataViewObjects {
//         return (this.state[seriesName] as any) || undefined;
//     }

//     public reset() {
//         this.tempState = {};
//     }

//     public save(): ISettingsServiceItem[] {
//         const state: ISettingsState = {
//             ...this.state,
//             ...this.tempState,
//         };

//         const serializedState: string = this.serializeState(state);

//         this.reset();

//         return [{
//             objectName: "internalState",
//             properties: {
//                 settings: serializedState,
//             },
//             selectionId: null,
//         }];
//     }

//     public parse(value: ISettingsState): void {
//         this.reset();

//         super.parse(value);
//     }

//     protected serializeState(state: ISettingsState): string {
//         const stateToBeSerialized: ISettingsState = Object.keys(state)
//             .slice(0, this.maxNumberOfSupportedSeriesToBeSerialized)
//             .reduce(
//                 (currentState: ISettingsState, propertyName: string) => {
//                     return {
//                         ...currentState,
//                         [propertyName]: state[propertyName],
//                     };
//                 },
//                 {},
//             );

//         return super.serializeState(stateToBeSerialized);
//     }

//     private areStatesEqual(oldState: ISettingsState, newState: ISettingsState): boolean {
//         try {
//             return JSON.stringify(oldState) === JSON.stringify(newState);
//         } catch (_) {
//             return false;
//         }
//     }
// }