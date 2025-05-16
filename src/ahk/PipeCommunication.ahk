#Requires AutoHotkey v2.0

class PipeCommunication {
    pipeName := ""
    pipeHandle := -1

    __New(pipeName) {
        this.pipeName := "\\.\pipe\" . pipeName
        this.pipeHandle := DllCall("CreateNamedPipe",
                            "Str", this.pipeName,
                            "UInt", 3,
                            "UInt", 0,
                            "UInt", 255,
                            "UInt", 0,
                            "UInt", 0,
                            "UInt", 0,
                            "Ptr", 0, "Ptr")
        
        if (this.pipeHandle = -1) {
            MsgBox("Error creating pipe: " . A_LastError)
            return
        }
        ; MsgBox("Pipe initialized: " . this.pipeName)
    }

    StartServer(callback) {
        ; hPipe := FileOpen(this.pipeName, "r")
        ; if (hPipe) {
        ;     try {
        ;         message := hPipe.Read()
        ;         if (message != "") {
        ;             callback(message)
        ;         }
        ;     } catch as e {
        ;         MsgBox("Error reading from pipe: " . e.Message)
        ;     } finally {
        ;         hPipe.Close()
        ;     }
        ; }
        if (!this.pipeHandle || this.pipeHandle = -1) {
            MsgBox("Pipe handle is invalid. Cannot start server.")
            return
        }
        
        try {
            ; Initialize bytesAvailable to 0
            bytesAvailable := 0
            ; Prüfe, ob Daten verfügbar sind
            
            MsgBox("before PeekNamedPipe")
            DllCall("PeekNamedPipe", "Ptr", this.pipeHandle, "Ptr", 0, "UInt", 0, "Ptr", 0, "PtrP", bytesAvailable, "Ptr", 0)
            MsgBox("after PeekNamedPipe")
            
            if (bytesAvailable > 0) {
                MsgBox("bytesAvailable: " . bytesAvailable)
                ; Daten sind verfügbar, lese sie
                MsgBox("before ReadFile || hPipe.Read()")
                buffer := Buffer(bytesAvailable)

                bytesRead := 0
                success := DllCall("ReadFile", "Ptr", this.pipeHandle, "Ptr", &buffer, "UInt", bytesAvailable, "UIntP", bytesRead, "Ptr", 0)
                
                if (success && bytesRead > 0) {
                    message := StrGet(&buffer, bytesRead, "UTF-8") ; Konvertiere den Puffer in einen String
                    callback(message)
                } else {
                    MsgBox("Error reading from pipe: " . A_LastError)
                }
            }
        } catch as e {
            MsgBox("Error reading from pipe: " . e.Message)
        } finally {
            ; this.pipeHandle.Close()
        }
    }

    SendMessage(message) {
        hPipe := FileOpen(this.pipeName, "w")
        if (hPipe) {
            hPipe.Write(message)
            hPipe.Close()
        }
    }

    ; SendMessage(message) {
    ;     hPipe := DllCall("CreateFile", "Str", this.pipeName, "UInt", 0x40000000, "UInt", 3, "Ptr", 0, "UInt", 3, "UInt", 0, "Ptr", 0)
    ;     if (hPipe = -1) {
    ;         MsgBox("Error opening pipe for writing: " . A_LastError)
    ;         return
    ;     }
    
    ;     try {
    ;         bytesWritten := 0
    ;         success := DllCall("WriteFile", "Ptr", hPipe, "Str", message, "UInt", StrLen(message) * 2, "UIntP", bytesWritten, "Ptr", 0)
    ;         if (!success) {
    ;             MsgBox("Error writing to pipe: " . A_LastError)
    ;         }
    ;     } catch as e {
    ;         MsgBox("Error in SendMessage: " . e.Message)
    ;     } finally {
    ;         DllCall("CloseHandle", "Ptr", hPipe)
    ;     }
    ; }
}