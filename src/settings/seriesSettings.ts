// import { SettingsBase } from "./settingsBase";

// import { AsOfDateSettings } from "./descriptors/asOfDateSettings";
// import { FontSettings } from "./descriptors/fontSettings";
// import { KPIIndicatorSettings } from "./descriptors/kpi/kpiIndicatorSettings";
// import { KPIIndicatorValueSettings } from "./descriptors/kpi/kpiIndicatorValueSettings";
// import { KPIValueSettings } from "./descriptors/kpi/kpiValueSettings";
// import { LabelSettings } from "./descriptors/labelSettings";
// import { MetricSpecificSettings } from "./descriptors/metricSpecificSettings";
// import { SparklineSettings } from "./descriptors/sparklineSettings";

// export class SeriesSettings extends SettingsBase<SeriesSettings> {
//     public asOfDate: AsOfDateSettings = new AsOfDateSettings();
//     public metricName: FontSettings = new FontSettings();
//     public currentValue: KPIValueSettings = new KPIValueSettings();
//     public kpiIndicator: KPIIndicatorSettings = new KPIIndicatorSettings();
//     public kpiIndicatorValue: KPIIndicatorValueSettings = new KPIIndicatorValueSettings();
//     public comparisonValue: KPIValueSettings = new KPIValueSettings();
//     public secondComparisonValue: KPIValueSettings = new KPIValueSettings();
//     public secondKPIIndicatorValue: KPIIndicatorValueSettings = new KPIIndicatorValueSettings();
//     public sparklineSettings: SparklineSettings = new SparklineSettings();

//     public metricSpecific: MetricSpecificSettings = new MetricSpecificSettings();

//     public applyAlternativeBackgroundColor(): void {
//         const backgroundColor: string = this.metricSpecific.alternativeBackgroundColor;

//         this.applyBackgroundColor(backgroundColor);
//         this.metricSpecific.backgroundColor = backgroundColor;
//     }

//     protected onObjectHasBeenParsed(objectName: string): void {
//         if (objectName !== "metricSpecific") {
//             return;
//         }

//         this.applyMetricSpecificSettings();
//     }

//     protected onObjectsAreUndefined(): void {
//         this.applyMetricSpecificSettings();
//     }

//     private applyMetricSpecificSettings(): void {
//         this.applyBackgroundColor(this.metricSpecific.backgroundColor);
//     }

//     private applyBackgroundColor(backgroundColor): void {
//         [
//             this.asOfDate,
//             this.metricName,
//             this.currentValue,
//             this.kpiIndicatorValue,
//             this.comparisonValue,
//             this.sparklineSettings,
//             this.secondComparisonValue,
//             this.secondKPIIndicatorValue,
//         ].forEach((specificSettings: LabelSettings) => {
//             this.applyBackgroundColorIfOwnColorIsNotSpecified(
//                 specificSettings,
//                 backgroundColor,
//             );
//         });
//     }

//     private applyBackgroundColorIfOwnColorIsNotSpecified(
//         specificSettings: LabelSettings,
//         backgroundColor: string,
//     ): void {
//         if (!specificSettings || !backgroundColor || specificSettings.backgroundColor) {
//             return;
//         }

//         specificSettings.backgroundColor = backgroundColor;
//     }
// }