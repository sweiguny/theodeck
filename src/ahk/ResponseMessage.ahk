#Requires AutoHotkey v2.0

class ResponseMessage extends Message {
    id := ""

    __New(id, source := "", remark := "") {
        super.__New("Response", "", source, remark)
        this.id := id
    }

    GetSubMessage() {
        result    := Map()
        result.id := this.id
        
        return result
    }
}