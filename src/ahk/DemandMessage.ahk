#Requires AutoHotkey v2.0

class DemandMessage extends Message {
    type := ""
    id := ""

    __New(type, source := "", remark := "") {
        super.__New("Demand", "", source, remark)
        this.type := type
        this.id   := A_TickCount ; Beispiel für eine eindeutige ID
    }
    
    GetSubMessage() {
        result      := Map()
        result.type := this.type
        result.id   := this.id
        return result
    }
}