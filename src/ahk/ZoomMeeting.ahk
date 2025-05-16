#Requires AutoHotkey v2.0

; Attention: This mustn't be named "Zoom", as this is a reserved Classname.
class ZoomMeeting {
    ; @string
	MeetingID := MeetingPW := HostKey := "" ; 
	ZoomExe := MeetingView := NoHostPermMsgBox := ClaimHostModalBox := ScreenShareView := ControlPanel := ""
	
	isRunning := false
	
	; @class WindowManager
	wm := ""
	
	__New(config) {
        this.MeetingID := config["Zoom"]["MeetingID"]
        this.MeetingPW := config["Zoom"]["MeetingPW"]
        this.HostKey   := config["Zoom"]["HostKey"]
		
		this.ZoomExe           := "ahk_exe "   . config["AHK"]["Zoom_ahk_exe"]
		this.MeetingView       := "ahk_class " . config["AHK"]["Zoom_MeetingView_ahk_class"]
		this.NoHostPermMsgBox  := "ahk_class " . config["AHK"]["Zoom_NoHostPermMsgBox_ahk_class"]
		this.ClaimHostModalBox := "ahk_class " . config["AHK"]["Zoom_ClaimHostModalBox_ahk_class"]
		this.ScreenShareView   := "ahk_class " . config["AHK"]["Zoom_ScreenShareView_ahk_class"]
		this.ControlPanel      := config["AHK"]["Zoom_ControlPanel_ahk_class"]
		
		this.wm := WindowManager()
		this.isRunning := this.wm.doesWindowExist(this.MeetingView)
		;MsgBox("Is Zoom running? " . this.isRunning)
    }
	
    startMeeting() {
		if !this.wm.doesWindowExist(this.MeetingView) {
		;if !this.isRunning {
			this.startProgram()
		} else {
			;MsgBox "Zoom gefunden, daher nicht gestartet"
			;MsgBox("Is Zoom running? " . this.isRunning)
			this.wm.activateWindow(this.ZoomExe) ; Fenster im Vordergrund holen
		}
	}
	
	endMeeting() {
	
	}
	
	
	startProgram() {
		run("zoommtg://zoom.us/join?confno=" . this.MeetingID . "&pwd=" . this.MeetingPW)
		this.wm.waitForWindow(this.MeetingView, 30)
		
		if this.wm.doesWindowExist(this.MeetingView) {
			;MsgBox("ZoomFenster da")
			this.wm.activateWindow(this.MeetingView)
			Send("{#Right}")
			this.isRunning := true
			this.turnAudioVideoOnOrOff()
			; this.registerControls() ; TODO!
		} else {
			;MsgBox("ZoomFenster nicht da..")
			this.isRunning := false ; pretty senseless, but for better understanding
		}
	}
	
	hasHostPerms() {
		ControlPanel := UIA.ElementFromHandle(this.MeetingView).FindElement([{ClassName: this.ControlPanel}])
		HostButton   := ControlPanel.ElementExist([{Type: "MenuItem", Name: "Host-Tools"}])
		;y:=HostButton.Highlight().Dump()
		;MsgBox(y)
		ControlPanel.ElementExist([{Type:"MenuItem", Name:"Host-Tools"}]).Click()
		MsgBox(UIA.ElementFromHandle(this.MeetingView).FindElement([{Type: "MenuItem", Name: "Warteraumfreigabe", matchmode: "Substring"}]).Highlight().Dump())
		
		return HostButton
	}
	
	retrieveHostPerms() {
		if !UIA.ElementFromHandle(this.MeetingView).ElementExist([{Name: "ContentRightPanel"}]) {
			;MsgBox("Scheinbar ist das ContentRightPanel nicht geöffnet")
			ControlPanel := UIA.ElementFromHandle(this.MeetingView).FindElement([{ClassName: this.ControlPanel}]).FindElement([{Type: "Button", Name: "Teilnehmer", matchmode: "Substring"}])
			ControlPanel.Highlight().Click()
		}
		
		;MsgBox("Scheinbar ist das ContentRightPanel doch geöffnet, aber nicht zu sehen?!")
		ContentRightPanel := UIA.ElementFromHandle(this.MeetingView).FindElement([{Name: "ContentRightPanel"}])
		ClaimHostButton   := ContentRightPanel.FindElement([{Name: "Den Host beanspruchen"}])
		ClaimHostButton.Highlight().Click()
		
		Send(this.HostKey)
		Send("{Enter}")
	}
	
	shareScreen() {
		Send "!s"  ; Alt + S – Standard-Hotkey für Screen-Sharing
		this.wm.waitForWindow(this.ScreenShareView)
		
		if this.wm.doesWindowExist(this.ScreenShareView) {
			;MsgBox("Search for correct screen + ton freigeben + video optimieren")
			;ShareScreen()
		} else if this.wm.doesWindowExist(this.NoHostPermMsgBox) {
			MsgBox("Please login as Host")
			
			npEl := UIA.ElementFromHandle(this.NoHostPermMsgBox)
			documentEl := npEl.FindElement([{Type: "Button", Name: "OK"}]).Highlight().Dump()
			MsgBox(documentEl)
			npEl.FindElement([{Type: "Button", Name: "OK"}]).Click()
		} else {
			MsgBox("No sharing")
		}
		;MsgBox("wos is jetz los?")
	}
	
	
	
	turnAudioVideoOnOrOff() {
		if (this.isRunning) {
			;Send("{!a}") ; switch Audio
			;Send("{!v}") ; switch Video
			;AudioVideoOn := !AudioVideoOn
		}
	}
	
}