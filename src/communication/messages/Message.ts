import streamDeck from "@elgato/streamdeck";
import { StatusObject } from "../StatusObject";
import { MessageType } from "./MessageType";

export abstract class Message {
    private msgType: string;
    public data?: StatusObject;
    public timestamp: string;
    public source?: string;
    public remark?: string;

    public constructor(msgType: MessageType, data?: StatusObject, source?: string, remark?: string) {
        this.msgType   = msgType;
        this.data      = data;
        this.timestamp = new Date().toISOString(); // ISO-8601 Zeitstempel
        this.source    = source;
        this.remark    = remark;
    }

    public toString(): string {
        const result: any = {
            msgType:   this.msgType,
            data:      this.data,
            timestamp: this.timestamp,
            source:    this.source,
            remark:    this.remark
        };

        result[this.msgType] = this.getSubMessage();
        streamDeck.logger.trace("SubMessage", result[this.msgType]);
        return JSON.stringify(result);
    }
    public toJSON(): string {
        return this.toString();
    }

    protected abstract getSubMessage(): object;

    public getMessageType(): string {
        return this.msgType.toString();
    }

}