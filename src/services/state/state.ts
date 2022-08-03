import { ISettingsServiceItem } from "../settingsService";

export abstract class State<StateType> {
    protected state: StateType;

    public abstract save(): ISettingsServiceItem[];

    public parse(state: StateType): void {
        this.state = state || {} as StateType;
    }

    protected serializeState(state: StateType = this.state): string {
        try {
            return JSON.stringify(state);
        } catch (_) {
            return "";
        }
    }
}