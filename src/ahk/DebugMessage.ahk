#Requires AutoHotkey v2.0

class DebugMessage extends Message {

    __New(source := "", remark := "") {
        super.__New("Debug", "", source, remark)
    }

    GetSubMessage() {
        return []
    }
}