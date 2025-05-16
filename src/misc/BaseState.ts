export abstract class BaseState {
    // Gemeinsame Attribute (Zustände)
    public AhkScriptActive = false;
    public ZoomMeetingRunning = false;
    public ScreenSharingActive = false;
    public JWLibraryRunning = false;
    public CameraAvailable = false;
    public MicrophoneAvailable = false;
    public MicrophoneOn = false;
    public VideoOn = false;
    public VideoRunning = false;

    // Methode, um den Zustand als Objekt zurückzugeben
    public getState(): { [key: string]: boolean } {
        return { ...this };
    }
}