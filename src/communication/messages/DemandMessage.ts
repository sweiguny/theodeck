import { DemandType } from "./DemandType";
import { Message } from "./Message";
import { MessageType } from "./MessageType";
import { v4 as uuidv4 } from 'uuid';

export class DemandMessage extends Message {
    protected type: DemandType;
    private id: string;

    public constructor(type: DemandType, source?: string, remark?: string) {
        super(MessageType.Demand, undefined, source, remark);
        
        this.type = type;
        this.id = uuidv4();
    }

    public getId(): string {
        return this.id;
    }

    public getType(): DemandType {
        return this.type;
    }

    protected override getSubMessage(): object {
        return {
            type: this.type,
            id: this.id
        };
    }

    /*public toString(): string {
        return JSON.stringify({
            type: this.type,
            data: this.data,
            timestamp: this.timestamp,
            source: this.source,
            remark: this.remark
        });
    }*/

    /*public static fromJSON(json: string): Message {
        let message = JSON.parse(json);
        let comObj  = new CommunicationObject(message.data);

        return new Message(
            message.type as MessageType,
            comObj,
            // CommunicationObject.fromJSON(JSON.stringify(obj.data)),
            message.source as string,
            message.remark as string
        );
    }*/
}