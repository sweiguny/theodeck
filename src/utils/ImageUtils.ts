import streamDeck from '@elgato/streamdeck';
import { fileURLToPath } from "url";
import fs from 'fs/promises';
import path from "path";
import { initializeImageMagick } from "@imagemagick/magick-wasm";

export class ImageUtils {

    public static async initialize() {
        const wasmPath   = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../node_modules/@imagemagick/magick-wasm/dist/magick.wasm');
        const wasmBuffer = await fs.readFile(wasmPath);
        
        await initializeImageMagick(wasmBuffer);
        streamDeck.logger.debug("magick-wasm initialized");
    }

    public static async loadImageBuffer(source: string): Promise<Buffer> {
        if (source.startsWith('data:')) {
            const base64 = source.split(',')[1];
            return Buffer.from(base64, 'base64');
        }

        if (source.startsWith('http')) {
            const res = await fetch(source);
            if (!res.ok) {
                throw new Error(`Fehler beim Laden des Bildes: ${res.statusText}`);
            }
            
            const arrayBuffer = await res.arrayBuffer();
            return Buffer.from(arrayBuffer);
        }

        // Fallback: lokale Datei
        const fs = await import('fs/promises');
        return await fs.readFile(source);
    }

}