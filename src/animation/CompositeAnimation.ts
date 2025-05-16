import { AnimationBase } from "./AnimationBase";

export class CompositeAnimation extends AnimationBase {
    public override animate(): Promise<NodeJS.Timeout | void> {
        throw new Error("Method not implemented.");
    }

    //public example(prefix: string, ...rest: number[]) {}

}