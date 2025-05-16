#Requires AutoHotkey v2.0

class StatusObject {
    AhkScriptActive     := false
    ZoomMeetingRunning  := false
    ScreenSharingActive := false

    JWLibraryRunning    := false
    
    CameraAvailable     := false
    MicrophoneAvailable := false
    MicrophoneOn        := false
    VideoOn             := false
    VideoRunning        := false

    ToJSON() {
        return JSON.stringify(this)
        ;return jxon_dump(this, indent:=0)
    }

    static FromJSON(json) {
        ;tempObj := jxon_load(&json)
        tempObj := JSON.parse(json)
        object  := StatusObject()

        for key, value in tempObj {
            if (HasProp(object, key)) {
                object[key] := value
            } else {
                MsgBox("Warning: Property '" . key . "' not found in StatusObject.")
            }
        }

        return object
    }
}