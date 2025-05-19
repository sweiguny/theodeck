export abstract class BaseState {
    // Gemeinsame Attribute (Zustände)
    public AhkScriptActive      = false; // Ahk (StreamDeck.exe) should be restarted in case it's not running
    public ZoomMeetingRunning   = false; // Whether Zoom.exe is running or not doesn't matter; only the meeting is important
    public ScreenSharingActive  = false; // To set button image/animation accordingly and maybe switch page
    public JWLibraryRunning     = false;
    public CameraAvailable      = false;
    public MicrophoneAvailable  = false;
    public MicrophoneOn         = false;
    public VideoOn              = false;
    public VideoRunning         = false;

    // Methode, um den Zustand als Objekt zurückzugeben
    // public getState(): { [key: string]: boolean } {
    //     return { ...this };
    // }
}