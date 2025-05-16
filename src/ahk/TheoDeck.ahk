; written by Simon, with helps from Elias and Felipe
; thanks to Markus for the project name idea and one big inspiration, although it wasn't yet possible to implement

#Requires AutoHotkey v2.0
#SingleInstance ; Ensures, that only one instance is running. On start the current instance will be replaced by a new one. Helps on changes.

#Include includes.ahk

; MsgBox "Running with AutoHotkey Version: " . A_AhkVersion


ConfigFile := "..\cfg\cfg.ini"
MyConfig := Config(ConfigFile)
; MsgBox("ConfigAsString: '" . MyConfig.getDataAsString() . "'")
Zoom := ZoomMeeting(MyConfig.getData())

; Initialisiere Sender
Senderr := Sender(MyConfig.getData()["Constants"]["PipeFromAHKtoSDK"])

; Initialisiere Receiver und MessageHandler
ReceiverObj := Receiver(MyConfig.getData()["Constants"]["PipeFromSDKtoAHK"])
MsgHandler := MessageHandler()

; Registriere den MessageHandler beim Receiver
ReceiverObj.RegisterHandler("default", ObjBindMethod(MsgHandler, "HandleMessage"))

; Starte den Receiver in einem separaten Thread
receiverThread := ObjBindMethod(ReceiverObj, "StartListening")
receiverThread()

; Beispiel: Sende eine Nachricht
Msg := ResponseMessage("test-id", "test-source", "test-remark")
Senderr.SendMessage(Msg)

; at first, we need to check the system state(s), because Zoom Application or JW Library
; may be run and quit several times...
checkSystem() {
	
}

; SetTitleMatchMode(2)  ; Erlaubt Fenstererkennung durch Teile des Titels

; #F5:: { ; Win+F5
; 	Zoom.startProgram()
; }

; #F6:: { ; Win+F6
; 	Zoom.startMeeting()
	
; 	if Zoom.isRunning {
; 		if !Zoom.hasHostPerms() {
; 			Zoom.retrieveHostPerms()
; 		}
; 		Zoom.shareScreen()
		
; 	} else {
; 		; kein host?
; 		MsgBox "Problem aufgetreten. Screen-Sharing konnte nicht gestartet werden, obwohl Zoom zu laufen scheint."
; 	}
	
; }

#F7:: { ; Win+F7
	MsgBox("Win+F7 gedrückt")
	try {
		run("streamdeck://plugins/message/com.sweiguny.theodeck/path/to/something?query=123#fragment")
	} catch as e {
		MsgBox("Fehler beim Aufrufen des Links: " . e.Message)
	}
}

#3:: { ; Win+3 |||| FOR TESTS
	MsgBox("Win+3 gedrückt. Sende Testnachricht über Pipe.")
	Msg := DebugMessage("Theodeck.ahk::WIN+3", "Hello from AHK!")
	Senderr.SendMessage(Msg)
}