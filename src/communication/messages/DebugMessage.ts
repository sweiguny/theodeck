import { Message } from "./Message";
import { MessageType } from "./MessageType";

export class DebugMessage extends Message {

    public constructor(source: string, remark: string) {
        super(MessageType.Debug, undefined, source, remark);
    }

    protected override getSubMessage(): object {
        return {
        };
    }
}