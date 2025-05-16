# This script is necessary (at least for Windows) to have a proper output of compile error on 'npm run build'
taskkill /IM TheoDeck.exe /F > $null 2>&1 # || exit 0
cmd /c "C:\Program Files\AutoHotkey\Compiler\Ahk2Exe.exe" /in .\src\ahk\TheoDeck.ahk /out .\com.sweiguny.theodeck.sdPlugin\bin\TheoDeck.exe /icon .\com.sweiguny.theodeck.sdPlugin\imgs\plugin\TheoDeck.ico /silent 2>&1