import { MessageType } from "./MessageType";
import { DemandMessage } from "./DemandMessage";
import { ResponseMessage } from "./ResponseMessage";
import { Message } from "./Message";
import streamDeck from "@elgato/streamdeck";

export class MessageFactory {
    public static createMessageFromJSON(json: string): Message {
        streamDeck.logger.info('Parsing message from JSON:', json);
        let message = JSON.parse(json);
        streamDeck.logger.debug('result after Parsing:', message, typeof message, message.msgType);

        switch (message.msgType) {
            case MessageType.Demand:
                return new DemandMessage(message.Demand.type, message.source, message.remark);
            case MessageType.Response:
                return new ResponseMessage(message.Response.id, message.source, message.remark);
            default:
                throw new Error(`Unknown message type: ${message.msgType}`);
        }
    }
}