import { ContextWrapper } from "../actions/ContextWrapper";
import { InternalAnimationState } from "./InternalAnimationState";


export abstract class AnimationBase {
    /**
     * Can be the path or base64 (URI)
     */
    protected readonly getRefImage: () => string;

    constructor(refImageOrDelegate: string | (() => string)) {
        this.getRefImage = typeof refImageOrDelegate === 'function'
                         ? refImageOrDelegate
                         : () => refImageOrDelegate;
    }

    public abstract animate(context: ContextWrapper/*, state: InternalAnimationState*/): Promise<NodeJS.Timeout | void>;
}