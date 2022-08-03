import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var depthchart202AEE521E8A4510A1C4BC18D19FD253_DEBUG: IVisualPlugin = {
    name: 'depthchart202AEE521E8A4510A1C4BC18D19FD253_DEBUG',
    displayName: 'depth_chart',
    class: 'Visual',
    apiVersion: '3.8.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = globalThis.dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["depthchart202AEE521E8A4510A1C4BC18D19FD253_DEBUG"] = depthchart202AEE521E8A4510A1C4BC18D19FD253_DEBUG;
}
export default depthchart202AEE521E8A4510A1C4BC18D19FD253_DEBUG;