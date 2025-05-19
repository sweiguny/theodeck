import { exec } from 'child_process';

const commands = [
    // needed for being able to create the icons and some other stuff (mainly for development)
    // checks whether the package ImageMagick is already installed, because otherwise an error occurs
    'powershell.exe -Command "if (-not (winget list --id ImageMagick.ImageMagick)) { winget install ImageMagick.ImageMagick -e --accept-package-agreements } else { Write-Host \'ImageMagick bereits installiert.\' }"',
    
    // needed for setting the default audio device (prevents annoying situation, when someone switches it)
    'powershell.exe -Command "Set-PSRepository PSGallery -InstallationPolicy Trusted; if (-not (Get-PackageProvider -Name NuGet -ErrorAction SilentlyContinue)) { Install-PackageProvider -Name NuGet -Force }"',
    'powershell.exe -Command "Install-Module -Name AudioDeviceCmdlets -Force -AllowClobber -Scope CurrentUser -Confirm:$false"'
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