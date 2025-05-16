import { ActionState } from "../StatefulAnimatedAction";

export class InternalAnimationState {
    public currentAction: ActionState;
    public lastAction: ActionState;
    public currentImage: string;
    public lastImage: string;

    constructor(currentAction: ActionState, currentImage: string) {
        this.currentAction = this.lastAction = currentAction;
        this.currentImage  = this.lastImage  = currentImage;
    }
}