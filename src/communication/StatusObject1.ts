import { GlobalState1 } from "../misc/GlobalState1";

export class StatusObject1 extends GlobalState1 {
    AhkScriptActive=     false; // Ahk (StreamDeck.exe) should be restarted in case it's not running
    ZoomMeetingRunning=  false; // Whether Zoom.exe is running or not doesn't matter; only the meeting is important
    ScreenSharingActive= false; // To set button image/animation accordingly and maybe switch page
    JWLibraryRunning=    false;
    CameraAvailable=     false;
    MicrophoneAvailable= false;
    MicrophoneOn=        false;
    VideoOn=             false;
    VideoRunning=        false;

    public constructor(parameter?: Partial<StatusObject1>) {
        super();

        if (parameter) {
            this.suppressEventExecution(() => {
                Object.keys(parameter).forEach(key => {
                    if (key in (this as any).state) {
                        (this as any).state[key] = (parameter as any)[key];
                    }
                });
            });
        }
    }

    public toJSON(): string {
        return JSON.stringify(this);
    }

    public static fromJSON(json: string): StatusObject1 {
        return new StatusObject1(JSON.parse(json));
    }

    public override assign(): void {
        throw new Error("The assign() method cannot be called on a StatusObject.");
    }
}