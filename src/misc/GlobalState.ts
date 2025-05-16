import streamDeck from "@elgato/streamdeck";
import { StatusObject } from "../communication/StatusObject";

export class GlobalState {
    private static instance: GlobalState;
    private static proxyInstance: any;

    private eventListeners: { [key: string]: ((value: any) => void)[] } = {};
    protected suppressEvents: boolean = false; // must be protected, due to proxy

    // Dynamische State-Definition
    private state: { [key: string]: boolean } = {
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

    public static getInstance(): GlobalState {
        
        if (!GlobalState.instance) {
            GlobalState.instance = new GlobalState();
            
            GlobalState.proxyInstance = new Proxy(GlobalState.instance, {
                get(target, property: string) {
                    if (property in target.state) {
                        return target.state[property];
                    }
                    if (property in target) {
                        return (target as any)[property];
                    }
                    throw new Error(`Property '${property}' does not exist on GlobalState.`);
                },
                set(target, property: string, value) {
                    if (target.state[property] !== value) {
                        target.state[property] = value;
                        streamDeck.logger.debug("before GlobalState.getInstance() ??? in GlobalState");
                        if (!GlobalState.getInstance().suppressEvents) {
                            GlobalState.getInstance().triggerEvent(`${property}Changed`, value);
                        };
                        streamDeck.logger.debug("after GlobalState.getInstance() ??? in GlobalState");
                    }
                    return true;
                }
            });
        }
        return GlobalState.proxyInstance;
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

    public assign(statusObject: StatusObject): void {
        const stateObject = statusObject.getState(); // Retrieve the 'internal' proxy

        this.suppressEventExecution(() => {
            Object.keys(stateObject).forEach((key: string) => {
                if (key in this.state) {
                    (this as any)[key] = stateObject[key]; // Setze die Werte über den Proxy
                }
            });
        });
    }

    protected getState(): { [key: string]: boolean } {
        return this.state;
    }

    protected suppressEventExecution(callback: () => void): void {
        this.suppressEvents = true;
        try {
            callback();
        } finally {
            this.suppressEvents = false;
        }
    }
}