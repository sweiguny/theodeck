import streamDeck from "@elgato/streamdeck";
import * as Constants from "../constants";
import { PipeCommunication } from './PipeCommunication';

export class Receiver {
    private static instance: Receiver;
    private pipe: PipeCommunication;
    private handlers: { [key: string]: (message: string) => void } = {};

    private constructor() {
        this.pipe = new PipeCommunication(Constants.PipeFromAHKtoSDK);
    }

    public static getInstance(): Receiver {
        if (!Receiver.instance) {
            Receiver.instance = new Receiver();
        }
        return Receiver.instance;
    }

    public startListening(): void {
        this.pipe.startServer((message: string) => {
            streamDeck.logger.debug('Received message:', message);
            Object.values(this.handlers).forEach(handler => handler(message));
        });
    }

    public registerHandler(key: string, handler: (message: string) => void): void {
        if (this.handlers[key]) {
            streamDeck.logger.warn(`Handler with key '${key}' is already registered.`);
            return;
        }
        this.handlers[key] = handler;
    }
    
    public unregisterHandler(key: string): void {
        if (this.handlers[key]) {
            delete this.handlers[key];
        }
    }
}