#Requires AutoHotkey v2.0
; created by SIWE

class JSON {
    ; Parse: Wandelt einen JSON-String in ein AHK-Objekt um
    static parse(json) {
        try {
            return JSON._parseValue(Trim(json))
        } catch as e {
            throw Error("Invalid JSON: " . e.Message)
        }
    }

    ; Stringify: Wandelt ein AHK-Objekt in einen JSON-String um
    static stringify(obj, space := "") {
		;MsgBox(Type(obj))
        try {
            return JSON._stringifyValue(obj, space, 0)
        } catch as e {
            throw Error("Unable to stringify: " . e.Message)
        }
    }

    ; Interne Methode: JSON-String parsen
    static _parseValue(json) {
        if SubStr(json, 1, 1) == "{" {
            return JSON._parseObject(json)
        } else if SubStr(json, 1, 1) == "[" {
            return JSON._parseArray(json)
        } else if SubStr(json, 1, 1) == Chr(34) { ; String
            return JSON._parseString(json)
        } else if json == "true" {
            return true
        } else if json == "false" {
            return false
        } else if json == "null" {
            return ""
        } else if RegExMatch(json, "^-?\d+(\.\d+)?([eE][+-]?\d+)?$") {
            return json + 0 ; Zahl
        } else {
            throw Error("Unexpected token in JSON: " . json)
        }
    }

    ; Interne Methode: JSON-Objekt parsen
    static _parseObject(json) {
        obj := Map()
        json := SubStr(json, 2) ; Entferne '{'
        while (SubStr(json, 1, 1) != "}") {
            key := JSON._parseString(json)
            json := SubStr(json, StrLen(key) + 3) ; Entferne Key und ':'
            value := JSON._parseValue(Trim(json))
            obj[key] := value
            json := SubStr(json, StrLen(JSON.stringify(value)) + 1) ; Entferne Value und ','
        }
        return obj
    }

    ; Interne Methode: JSON-Array parsen
    static _parseArray(json) {
        arr := []
        json := SubStr(json, 2) ; Entferne '['
        while (SubStr(json, 1, 1) != "]") {
            value := JSON._parseValue(Trim(json))
            arr.Push(value)
            json := SubStr(json, StrLen(JSON.stringify(value)) + 1) ; Entferne Value und ','
        }
        return arr
    }

    ; Interne Methode: JSON-String parsen
    static _parseString(json) {
        if SubStr(json, 1, 1) != Chr(34) ; Prüfe auf Anführungszeichen
            throw Error("Invalid string in JSON")
        endPos := InStr(json, Chr(34), false, 2)
        if !endPos
            throw Error("Unterminated string in JSON")
        return SubStr(json, 2, endPos - 2)
    }

    ; Interne Methode: Objekt oder Array in JSON-String umwandeln
    static _stringifyValue(value, space, level) {
        if IsObject(value) {
            if Type(value) == "Array"
                return JSON._stringifyArray(value, space, level)
            else
                return JSON._stringifyObject(value, space, level)
        } else if Type(value) == "String" {
            return Chr(34) . StrReplace(value, Chr(34), Chr(34) Chr(34)) . Chr(34)
        } else if IsNumber(value) {
            return value
        } else if value = true {
            return "true"
        } else if value = false {
            return "false"
        } else if value = "" {
            return "null"
        } else {
            throw Error("Unsupported value type in JSON")
        }
    }

    ; Interne Methode: JSON-Array umwandeln
    static _stringifyArray(arr, space, level) {
        stringified := "["
        for index, value in arr {
            stringified .= (space ? "`n" . StrRepeat(space, level + 1) : "") . JSON._stringifyValue(value, space, level + 1) . ","
        }
        if SubStr(stringified, StrLen(stringified), 1) == ","
            stringified := SubStr(stringified, 1, StrLen(stringified) - 1) ; Entferne letztes Komma
        return stringified . (space ? "`n" . StrRepeat(space, level) : "") . "]"
    }

    ; Interne Methode: JSON-Objekt umwandeln
    static _stringifyObject(obj, space, level) {
        stringified := "{"
        for key, value in ObjOwnProps(obj) {	
            stringified .= (space ? "`n" . StrRepeat(space, level + 1) : "") . JSON._stringifyValue(key, space, level + 1) . ":" . (space ? " " : "") . JSON._stringifyValue(value, space, level + 1) . ","
        }
        if Type(obj) == "Map" { ; TODO: Man sollte eventuell testen, ob das nicht falsch ist
            for key, value in obj {	
                stringified .= (space ? "`n" . StrRepeat(space, level + 1) : "") . JSON._stringifyValue(key, space, level + 1) . ":" . (space ? " " : "") . JSON._stringifyValue(value, space, level + 1) . ","
            }
        }
		
        if SubStr(stringified, StrLen(stringified), 1) == ","
            stringified := SubStr(stringified, 1, StrLen(stringified) - 1) ; Entferne letztes Komma
        return stringified . (space ? "`n" . StrRepeat(space, level) : "") . "}"
    }
}

StrRepeat(str, count) {
	result := ""
	Loop count
		result .= str
	return result
}