#Requires AutoHotkey v2.0
; global definition of includes: cleaner, performance

; (external) libraries
#Include .\UIA-v2\Lib\UIA.ahk
; #Include .\lib\Yaml.ahk ; seems corrupt
; #Include .\lib\JXON.ahk
#Include .\lib\JSON.ahk

; project files
#Include Config.ahk
#Include PipeCommunication.ahk
#Include StatusObject.ahk
#Include Sender.ahk
#Include Receiver.ahk
#include Message.ahk
#Include MessageHandler.ahk
#Include DebugMessage.ahk
#Include DemandMessage.ahk
#Include ResponseMessage.ahk
#Include WindowManager.ahk
#Include ZoomMeeting.ahk