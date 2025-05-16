import streamDeck from '@elgato/streamdeck';
import { MessageType } from './messages/MessageType';
import { StatusObject } from './StatusObject';
import { ResponseMessage } from './messages/ResponseMessage';
import { MessageFactory } from './messages/MessageFactory';

export class MessageHandler {
    public handleMessage(msg: string): void {
        streamDeck.logger.debug('message from pipe:', msg);
        const message = MessageFactory.createMessageFromJSON(msg);
        const msgType = message.getMessageType();
        streamDeck.logger.debug('message:', msgType, typeof message);

        switch (msgType) {
            case MessageType.Error:
                throw new Error(`Error occured at ${message.timestamp} from '${message.source}': '${message.remark}'. Data: ${message.data}`);
            case MessageType.Info:
                streamDeck.logger.info(`Info message received at ${message.timestamp} from '${message.source}': '${message.remark}'. Data: ${message.data}`);
                break;
            case MessageType.Debug:
                streamDeck.logger.debug(`Debug message received at ${message.timestamp} from '${message.source}': '${message.remark}'. Data: ${message.data}`);
                break;


            case MessageType.Demand:
                throw new Error("Demands from AHK to SDK are not allowed yet.");
            case MessageType.Response:
                this.handleResponse((message as ResponseMessage).getId() as string, message.data as StatusObject);
                break;
            case MessageType.StatusUpdate:
                this.handleStatusUpdate(message.data as StatusObject);
                break;
            case MessageType.Command:
                streamDeck.logger.info('Command message received:', message.data);
                break;
            default: throw new Error(`Unknown message type: ${msgType}`);
        }
    }

    private handleResponse(id: string, data: StatusObject): void {
        streamDeck.logger.info('Response message received:', id, data);
        
        //throw new Error('handleResponse Method not implemented.');
    }

    private handleStatusUpdate(data: StatusObject): void {
        streamDeck.logger.info('Status update:', data);
        throw new Error('handleStatusUpdate Method not implemented.');
    }

    private triggerCommand(command: string, data: StatusObject): void {
        streamDeck.logger.info(`Triggering command: ${command}`, data);
        throw new Error('triggerCommand Method not implemented.');
    }
}