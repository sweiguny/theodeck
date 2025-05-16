import { ContextWrapper } from "../actions/ContextWrapper";
import { AnimationBase } from "./AnimationBase";

export class AnimatedComposition extends AnimationBase {
    public override animate(context: ContextWrapper): Promise<NodeJS.Timeout | void> {
        throw new Error("Method not implemented.");
    }
    
}