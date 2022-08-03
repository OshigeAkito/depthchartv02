import powerbi from "powerbi-visuals-api";

export interface ISettingsServiceItem {
    objectName: string;
    selectionId: powerbi.visuals.ISelectionId;
    properties: any;
}

export class SettingsService {
    private hostServices: powerbi.extensibility.visual.IVisualHost;

    public set host(host: powerbi.extensibility.visual.IVisualHost) {
        this.hostServices = host;
    }

    public save(items: ISettingsServiceItem[]): void {
        const instances: powerbi.VisualObjectInstance[] = items.map((item: ISettingsServiceItem) => {
            const selector: powerbi.data.Selector = item.selectionId
                && item.selectionId.getSelector
                ? item.selectionId.getSelector()
                : null;

            return {
                objectName: item.objectName,
                properties: item.properties || {},
                selector,
            };
        });

        this.sendInstancesToHost(instances);
    }

    public sendInstancesToHost(instances: powerbi.VisualObjectInstance[]): void {
        if (!this.hostServices) {
            return;
        }

        const objectInstance: powerbi.VisualObjectInstancesToPersist = {
            replace: instances || [],
        };

        this.hostServices.persistProperties(objectInstance);
    }

    public destroy(): void {
        this.hostServices = {null};
    }
}