#Requires AutoHotkey v2.0

; This is the Client, hence only opens the pipe and writes some messages.
class Sender {
    static instance := ""

    __New(pipeName) {
        this.pipeName := "\\.\pipe\" . pipeName
        MsgBox("Sender initialized with pipe: " . this.pipeName . " | Called from: " . A_ThisFunc)
    }

    SendMessage(message) {
        msg := message.toJSON()
        
        try {
            ; Öffne die Pipe im Schreibmodus
            hPipe := DllCall("CreateFile",
                            "Str", this.pipeName,
                            "UInt", 0x40000000, ; GENERIC_WRITE
                            "UInt", 3,          ; FILE_SHARE_READ | FILE_SHARE_WRITE
                            "Ptr", 0,           ; Sicherheitsattribute (nicht verwendet)
                            "UInt", 3,          ; OPEN_EXISTING
                            "UInt", 0,          ; Keine speziellen Flags
                            "Ptr", 0)           ; Keine Template-Datei
            
            if (hPipe = -1) {
                MsgBox("Error opening pipe for writing: " . A_LastError)
                return
            }

            ; Konvertiere den String in UTF-8 und schreibe ihn in einen Puffer
            utf8Size := StrPut(msg, "UTF-8") ; Ermittelt die Größe des UTF-8-Strings in Bytes
            ; MsgBox("UTF-8 size: " . utf8Size)
            utf8Buffer := Buffer(utf8Size, 0)
            StrPut(msg, utf8Buffer.Ptr, utf8Size, "UTF-8") ; Schreibe den UTF-8-String in den Puffer
            ; MsgBox("Writing to pipe...")

            bytesWritten := 0 ; (noch) kein Bedarf sich das zu merken oder zu verwenden, aber Möglichkeit ist da
            success := DllCall("WriteFile",
                                "Ptr", hPipe,
                                "Ptr", utf8Buffer.Ptr,
                                "UInt", utf8Size - 1,  ; Anzahl der zu schreibenden Bytes (ohne Null-Byte am Ende)
                                "UIntP", bytesWritten, ; Tatsächlich geschriebene Bytes
                                "Ptr", 0)              ; Overlapped (nicht verwendet)
            
            if (!success) {
                MsgBox("Error writing to pipe: " . A_LastError)
            } else {
                MsgBox("Message sent successfully: " . msg)
            }
        } catch as e {
            throw Error("Error in SendMessage: " . e.Stack . e.Message)
        } finally {
            ; Schließe die Pipe
            if (hPipe && hPipe != -1) {
                DllCall("CloseHandle", "Ptr", hPipe)
            }
        }
    }
}