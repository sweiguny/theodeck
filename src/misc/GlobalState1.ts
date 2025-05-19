import streamDeck from "@elgato/streamdeck";
import { StatusObject1 } from "../communication/StatusObject1";
import { BaseState } from "./BaseState";

class DynamicValue {
    private boolValue: boolean;
    private stringValue: string;

    constructor(boolValue: boolean, stringValue: string) {
        this.boolValue = boolValue;
        this.stringValue = stringValue;
    }

    valueOf(): boolean {
        return this.boolValue;
    }

    toString(): string {
        return this.stringValue;
    }
}

export class GlobalState1 extends BaseState {
    private static instance: GlobalState1;
    private static proxyInstance: any;

    private eventListeners: { [key: string]: ((value: any) => void)[] } = {};
    protected suppressEvents: boolean = false; // must be protected, due to proxy

    // Dynamische State-Definition
    public state: { [key: string]: boolean } = {
        AhkScriptActive:     false, // Ahk (StreamDeck.exe) should be restarted in case it's not running
        ZoomMeetingRunning:  false, // Whether Zoom.exe is running or not doesn't matter; only the meeting is important
        ScreenSharingActive: false, // To set button image/animation accordingly and maybe switch page
        JWLibraryRunning:    false,
        CameraAvailable:     false,
        MicrophoneAvailable: false,
        MicrophoneOn:        false,
        VideoOn:             false,
        VideoRunning:        false
    };

    public static getInstance(): GlobalState1 {
        
        if (!GlobalState1.instance) {
            GlobalState1.instance = new GlobalState1();
            
            GlobalState1.proxyInstance = new Proxy(GlobalState1.instance, {
                get(target, property: string) {
                    if (property in target.state) {
                        const boolValue   = target.state[property];
                        const stringValue = `${property}Changed`;
                        return new DynamicValue(boolValue, stringValue);
                    }
                    if (property in target) {
                        return (target as any)[property];
                    }
                    throw new Error(`Property '${property}' does not exist on GlobalState1.`);
                },
                set(target, property: string, value) {
                    if (target.state[property] !== value) {
                        target.state[property] = value;
                        streamDeck.logger.debug("before GlobalState1.getInstance() ??? in GlobalState1");
                        if (!GlobalState1.getInstance().suppressEvents) {
                            GlobalState1.getInstance().triggerEvent(`${property}Changed`, value);
                        };
                        streamDeck.logger.debug("after GlobalState1.getInstance() ??? in GlobalState1");
                    }
                    return true;
                }
            });
        }
        return GlobalState1.proxyInstance;
    }

    public on(event: keyof typeof this.state, listener: (value: boolean) => void): void {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(listener);
    }

    private triggerEvent(event: string, value: boolean): void {
        const listeners = this.eventListeners[event];
        if (listeners) {
            listeners.forEach(listener => listener(value));
        }
    }

    // public assign(object: Partial<typeof this.state>): void {
    //     Object.keys(object).forEach(key => {
    //         if (key in this.state) {
    //             this.state[key] = object[key as keyof typeof this.state]!;
    //         }
    //     });
    // }

    public assign(statusObject: StatusObject1): void {
        // const stateObject = statusObject.getState(); // Retrieve the 'internal' proxy

        this.suppressEventExecution(() => {
            Object.keys(statusObject).forEach((key: string) => {
                if (key in this.state) {
                    (this as any)[key] = (statusObject as any)[key];
                }
            });
        });
    }

    // protected getState(): { [key: string]: boolean } {
    //     return this.state;
    // }

    protected suppressEventExecution(callback: () => void): void {
        this.suppressEvents = true;
        try {
            callback();
        } finally {
            this.suppressEvents = false;
        }
    }
}