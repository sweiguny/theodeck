import * as usb from 'usb';
import { exec } from 'child_process';
import streamDeck from '@elgato/streamdeck';

/**
 * Note for the PTZ Camera of SMTAV (BA30S | BA30N | BA30S-W | BA30N-W): npm install onvif
 * ONVIF Settings: The ONVIF Settings section allows you to adjust the ONVIF settings of the camera.
 * ONVIF: Enable / Disable ONVIF protocol control.
 * ONVIF Auth.: Enable / Disable ONVIF authorization.
 */

export class DeviceManager {
    private static instance: DeviceManager;
    private usbDevices: usb.Device[] = [];
    private audioDevices: { [name: string]: number } = {}; // Name as Key, Index as Value

    private constructor() {
        this.initialize();
    }

    public static getInstance(): DeviceManager {
        if (!DeviceManager.instance) {
            DeviceManager.instance = new DeviceManager();
        }
        return DeviceManager.instance;
    }

    private initialize(): void {
        this.loadAudioDevices();

        // TODO: Check for events like device added/removed
        /*usb.on('connect', (device: usb.Device) => {
            this.devices.push(device);
            console.log(`Device attached: ${device.deviceDescriptor.idVendor}:${device.deviceDescriptor.idProduct}`);
        });

        usb.on('disconnect', (device: usb.Device) => {
            this.devices = this.devices.filter(d => d.deviceDescriptor.idVendor !== device.deviceDescriptor.idVendor || d.deviceDescriptor.idProduct !== device.deviceDescriptor.idProduct);
            console.log(`Device detached: ${device.deviceDescriptor.idVendor}:${device.deviceDescriptor.idProduct}`);
        });*/
    }

    private loadAudioDevices(): void {
        const command = 'powershell.exe -Command "Get-AudioDevice -List"';
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing PowerShell command:', error);
                return;
            }
            if (stderr) {
                console.error('PowerShell error:', stderr);
                return;
            }

            this.audioDevices = this.parseAudioDevices(stdout);
            streamDeck.logger.debug('Audio devices loaded:', this.audioDevices);
        });
    }

    private parseAudioDevices(output: string): { [name: string]: number } {
        const devices: { [name: string]: number } = {};
        const lines = output.split('\n');

        lines.forEach(line => {
            const match = line.match(/^\s*(\d+)\s+(.+)$/);
            if (match) {
                const index = parseInt(match[1], 10);
                const name = match[2].trim();
                devices[name] = index;
            }
        });

        return devices;
    }

    public setDefaultAudioDevice(deviceName: string): void {
        const index = this.audioDevices[deviceName];
        if (index !== undefined) {
            const command = `powershell.exe -Command "Set-AudioDevice -Index ${index}"`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error setting default audio device:', error);
                    return;
                }
                if (stderr) {
                    console.error('PowerShell error:', stderr);
                    return;
                }
                streamDeck.logger.debug(`Default audio device set to: ${deviceName}`);
            });
        } else {
            streamDeck.logger.warn(`Audio device not found: ${deviceName}`);
        }
    }
}