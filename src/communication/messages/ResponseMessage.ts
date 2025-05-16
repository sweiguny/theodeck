import streamDeck from "@elgato/streamdeck";
import { Message } from "./Message";
import { MessageType } from "./MessageType";

export class ResponseMessage extends Message {
    private id: string;

    public constructor(id: string, source?: string, remark?: string) {
        super(MessageType.Response, undefined, source, remark);
        this.id = id;
    }

    public getId(): string {
        return this.id;
    }

    protected override getSubMessage(): object {
        return {
            id: this.id
        };
    }
}