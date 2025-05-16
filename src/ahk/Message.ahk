#Requires AutoHotkey v2.0

class Message {
    msgType := ""
    data := ""
    timestamp := ""
    source := ""
    remark := ""

    __New(msgType, data := "", source := "", remark := "") {
        this.msgType    := msgType
        this.data       := data
        this.timestamp  := A_NowUTC ; ISO-8601 Zeitstempel
        this.source     := source
        this.remark     := remark
    }

    toJSON() {
        result := Map()
        result.msgType   := this.msgType
        result.data      := this.data
        result.timestamp := this.timestamp
        result.source    := this.source
        result.remark    := this.remark

        result[this.msgType] := this.GetSubMessage()
        ; Debugging: Dump den Inhalt der Map
        ; MsgBox("Dump of result Map:`n" . DumpMap(result))

        return JSON.stringify(result)
    }
    
    GetSubMessage() {
        throw Error("GetSubMessage() must be implemented in a derived class.")
    }

    static FromJSON(json) {
        obj := JSON.parse(json)
        
        if !obj.HasKey("msgType") {
            throw Error("Invalid message format: Missing 'msgType'")
        }
        MsgBox("Message received?: " . json)

        switch obj.msgType {
            case "Demand":
                return DemandMessage(obj.type, obj.source, obj.remark)
            case "Response":
                return ResponseMessage(obj.id, obj.source, obj.remark)
            default:
                throw Error("Unknown message type: " . obj.msgType)
        }
    }
}

DumpMap(map) {
    if !IsObject(map) || Type(map) != "Map"
        throw Error("DumpMap: Argument is not a Map.")

    result := ""
    for key, value in ObjOwnProps(map) {
        result .= key . ": " . (IsObject(value) ? "<Object " . Type(value) . ">" : value) . "`n"
    }
    for key, value in map {
        result .= key . ": " . (IsObject(value) ? "<Object " . Type(value) . ">" : value) . "`n"
    }
    return result
}