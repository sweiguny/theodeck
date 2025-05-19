import { BaseState } from "../misc/BaseState";

export class StatusObject1 extends BaseState {

    public constructor(parameter?: Partial<StatusObject1>) {
        super();

        if (parameter) {
            Object.assign(this, parameter);
        }
    }

    public toJSON(): string {
        return JSON.stringify(this);
    }

    public static fromJSON(json: string): StatusObject1 {
        return new StatusObject1(JSON.parse(json));
    }
}