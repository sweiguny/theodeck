import streamDeck from "@elgato/streamdeck";
import * as Constants from "../constants";
import { Message } from "./messages/Message";
import { PipeCommunication } from './PipeCommunication';
import { GlobalState } from "../misc/GlobalState";
import { GlobalState1 } from "../misc/GlobalState1";

export class Sender {
    private static instance: Sender;
    private pipe: PipeCommunication;

    private constructor() {
        this.pipe = new PipeCommunication(Constants.PipeFromSDKtoAHK);

    }

    public static getInstance(): Sender {
        if (!Sender.instance) {
            Sender.instance = new Sender();
        }
        return Sender.instance;
    }

    /**
     * 
     * @param message 
     */
    public sendMessage(message: Message): void {
        /*if (GlobalState1.getInstance().state.AhkScriptActive) {
            this.pipe.sendMessage(message.toString());
        }*/
    }
}