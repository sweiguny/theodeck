import { AnimationBase } from "./AnimationBase";

export class SequentialAnimation extends AnimationBase {
    public override animate(): Promise<NodeJS.Timeout | void> {
        throw new Error("Method not implemented.");
    }
    
}