#Requires AutoHotkey v2.0

class Config {
    data := Map()

    __New(path) {
        if (!FileExist(path)) {
            throw Error("File not found: " . path)
        }
        this.data := this._read(path)
    }

    getData() {
        return this.data
    }
    
    getDataAsString() {
        return this._mapToString(this.data)
    }

    _mapToString(map, prefix := "") {
        result := ""

        for key, value in map {
            if IsObject(value) {
                result .= "[" . key . "]`n"
                result .= this._mapToString(value)
            } else {
                result .= key . "=" . value . "`n"
            }
        }

        return result
    }

    _read(path) {
        stream    := FileRead(path, "UTF-8")
        extension := StrLower(StrSplit(path, ".").Pop())
        data      := Map()

        switch extension {
            case "json":
                this.data := this._parseJson(stream)
            case "ini":
                data := this._parseIni(stream)
            case "yaml", "yml":
                data := this._parseYaml(stream)
            default:
                throw Error("Unsupported config type: ." . extension)
        }

        return data
    }

    _parseJson(stream) {
        try {
            return JSON.parse(stream)
            ;return jxon_load(&stream)
        } catch {
            throw Error("Invalid JSON format")
        }
    }

    _parseIni(stream) {
        try {
            ini := Map()
            section := ""
    
            for line in StrSplit(stream, "`r`n") {
                line := Trim(line)
                if (line = "" || SubStr(line, 1, 1) = ";") {
                    continue
                }
    
                ; [Section]
                if (SubStr(line, 1, 1) = "[") {
                    section := SubStr(line, 2, StrLen(line) - 2)

                    if !ini.HasOwnProp(section) {
                        ini[section] := Map()
                    }
                } else {
                    if !InStr(line, "=") {
                        throw Error("Invalid INI format: Missing '=' in line: " . line)
                    }

                    parts := StrSplit(line, "=")
                    if (parts.Length < 2) {
                        throw Error("Invalid INI format: Unable to parse line: " . line)
                    }
                    key   := Trim(parts[1])
                    value := Trim(parts[2])
    
                    if (section) {
                        ini[section][key] := value
                    } else {
                        ini[key] := value
                    }
                }
            }

            return ini
        } catch as e {
            MsgBox("Error in ParseIni: " . e.Message " . " . e.File . ":" . e.Line . " - " . e.Stack)
            throw Error("Invalid INI format")
        }
    }

    _parseYaml(stream) {
        try {
            ; return Yaml.Load(stream) ; YAML-Parsing (erfordert externe YAML-Bibliothek) ; haben wir, fkt. aber nicht
        } catch {
            throw Error("Invalid YAML format")
        }
    }
}