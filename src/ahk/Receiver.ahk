#Requires AutoHotkey v2.0

; This is the Server, hence creates the pipe and listens for incoming messages.
class Receiver {
    pipeName := ""
    pipeHandle := -1
    handlers := Map()

    __New(pipeName) {
        this.pipeName := "\\.\pipe\" . pipeName
        MsgBox("Receiver initialized with pipe: " . this.pipeName . " | Called from: " . A_ThisFunc)
    }

    StartListening() {
        try {
            ; Erstelle die Named Pipe
            this.pipeHandle := DllCall("CreateNamedPipe",
                            "Str", this.pipeName,
                            "UInt", 3 | 0x40000000, ; PIPE_ACCESS_DUPLEX | FILE_FLAG_OVERLAPPED
                            "UInt", 0,
                            "UInt", 255,
                            "UInt", 0,
                            "UInt", 0,
                            "UInt", 10000, ; Timeout in Millisekunden 
                            "Ptr", 0, "Ptr")
            
            if (this.pipeHandle = -1) {
                MsgBox("Error creating named pipe: " . A_LastError)
                return
            }

            ; MsgBox("Waiting for client connection... Sollte eigentlich nur erreicht werden, wenn kein Timeout definiert ist.")
            ; Loop {
            ;     success := DllCall("ConnectNamedPipe", "Ptr", hPipe, "Ptr", 0)
            ;     if (success || A_LastError = 535) { ; ERROR_PIPE_CONNECTED (535): Client ist bereits verbunden
            ;         break
            ;     }
            ;     Sleep(100) ; Warte 100 ms, bevor erneut geprüft wird
            ; }

            MsgBox("Client connected. Listening for messages...")
            SetTimer(this.CheckPipe.Bind(this), 100)
        } catch as e {
            MsgBox("Error in StartListening: " . e.Message)
        } finally {
            ; Schließe die Pipe
            if (this.pipeHandle && this.pipeHandle != -1) {
                DllCall("CloseHandle", "Ptr", this.pipeHandle)
                this.pipeHandle := -1
            }
        }
    }

    CheckPipe() {
        try {
            bytesAvailable := 0
            ; Prüfe, ob Daten verfügbar sind
            DllCall("PeekNamedPipe",
                    "Ptr", this.pipeHandle,
                    "Ptr", 0,
                    "UInt", 0,
                    "Ptr", 0,
                    "PtrP", bytesAvailable,
                    "Ptr", 0)
            
            if (bytesAvailable > 0) {
                ; Daten sind verfügbar, lese sie
                buffer    := Buffer(bytesAvailable)
                bytesRead := 0
                success   := DllCall("ReadFile",
                                    "Ptr", this.pipeHandle,
                                    "Ptr", buffer,
                                    "UInt", bytesAvailable,
                                    "UIntP", bytesRead,
                                    "Ptr", 0)
                if (success && bytesRead > 0) {
                    message := StrGet(buffer, bytesRead, "UTF-8")
                    this.HandleMessage(message)
                } else {
                    MsgBox("Error reading from pipe: " . A_LastError)
                    SetTimer(this.CheckPipe.Bind(this), "Off") ; Stoppe den Timer
                }
            }
        } catch as e {
            MsgBox("Error in CheckPipe: " . e.Message)
        }
    }

    HandleMessage(message) {
        MsgBox("Received message: " . message)
        try {
            ; Prüfe, ob die Nachricht gültig ist
            if (!IsObject(message)) {
                throw Error("Invalid message format")
            }

            ; Alle registrierten Handler mit der empfangenen Nachricht aufrufen
            for key, handler in this.handlers {
                handler.Call(message)
            }
        } catch as e {
            MsgBox("Error processing message: " . e.Message)
        }
    }




; check ob folgende Methoden wirklich benötigt werden

    RegisterHandler(key, handler) {
        if (this.handlers.Has(key)) {
            MsgBox("Handler with key '" . key . "' is already registered.")
            return
        }
        this.handlers[key] := handler
    }

    UnregisterHandler(key) {
        if (this.handlers.Has(key)) {
            this.handlers.Delete(key)
        }
    }
}