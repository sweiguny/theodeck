import { exec } from 'child_process';

const commands = [
    // needed for being able to create the icons and some other stuff (mainly for development)
    'powershell.exe -Command "winget install ImageMagick.ImageMagick -e --accept-package-agreements"',
    
    // needed for setting the default audio device (prevents annoying situation, when someone switches it)
    'powershell.exe -Command "Install-Module -Name AudioDeviceCmdlets -Force -Scope CurrentUser"'
];

function install(commands: string[]): void {
    commands.forEach(command => {
        console.log(`Executing: ${command}`);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: >>> ${command} <<<`, error);
                return;
            }
            if (stderr) {
                console.error(`PowerShell error for command: >>> ${command} <<<`, stderr);
                return;
            }
            console.log(`Command executed successfully: >>> ${command} <<<`);
            console.log(stdout);
        });
    });
}

install(commands);