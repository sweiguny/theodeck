#Requires AutoHotkey v2.0

class WindowManager {
	SecondsToWait := 5 ; timeframe to wait until a window appears
	SleepInterval := 100
	
	__New() {
	
	}

	waitForWindow(window, secondsToWait := this.SecondsToWait) {
		;MsgBox("Wie viele Sekunden warten wir: " . secondsToWait)
		numberOfIterations := secondsToWait * 1000 / this.SleepInterval
		found := false
		
		Loop {
			numberOfIterations--
			Sleep(this.SleepInterval)
			;MsgBox(numberOfIterations)
			
			if this.doesWindowExist(window) {
				found := true
			}
		} Until (found or numberOfIterations <= 0)
		
		return found
	}
	
	doesWindowExist(window) {
		return WinExist(window)
	}
	
	activateWindow(window) {
		WinActivate(window)
	}

	BlinkWindow(window) {
		if (this.doesWindowExist(window)) {
			; Fenster aktivieren und sichtbar machen
			this.activateWindow(window)
			; Fenster für 500ms aktivieren, dann wieder de-aktivieren (blinkend)
			Sleep(500)
			WinMinimize(window)  ; Minimiere das Fenster
			Sleep(500)
			WinRestore(window)   ; Stelle es wieder her
			Sleep(500)
			this.activateWindow(window)  ; Fenster aktivieren
		}
	}
}