#Requires AutoHotkey v2.0

class MessageHandler {
    HandleMessage(message) {
        try {
            MsgBox("Received message: " . message)
            msgObj  := Message.FromJSON(message)
            msgType := msgObj.msgType

            ; Reagiere auf den Nachrichtentyp
            switch msgType {
                ; following Message types will probably never be used in AHK
                ; case "Error":
                ;     this.HandleError(comObj)
                ; case "Info":
                ;     this.HandleInfo(comObj)
                ; case "Debug":
                ;     this.HandleDebug(comObj)
                    
                case "Demand":
                    MsgBox("Demands from AHK to SDK are allowed, but not yet handled.")
                    MsgBox("This is the message: " . message)
                case "Response":
                    throw Error("As demands from AHK to SDK aren't allowed, there can't be a response.")
                    
                case "StatusUpdate":
                    throw Error("Not yet implemented.")
                    
                case "Command":
                    throw Error("Not yet implemented.")
                    
                default:
                    throw Error("Unknown message type: " . msgType)
            }
        } catch as e {
            MsgBox("Error processing message: " . e.Message)
        }
    }
}