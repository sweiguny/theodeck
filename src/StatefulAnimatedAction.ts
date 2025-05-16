import { SingletonAction } from "@elgato/streamdeck";
import { AnimationBase } from "./animation/AnimationBase"
import { InternalAnimationState } from "./animation/InternalAnimationState";

export enum ActionState {
    stopped  = 'stopped',
    starting = 'starting',
    running  = 'running',
    error    = 'error'
}

export class StatefulAnimatedAction extends SingletonAction {
    
    protected states: Map<ActionState, AnimationBase> = new Map();
    private runningAnimation: Promise<void | NodeJS.Timeout> | undefined;
    // protected internalAnimationState: InternalAnimationState;

    /*constructor(currentAction: ActionState, currentImage: string) {
        super();

        this.internalAnimationState = new InternalAnimationState(currentAction, currentImage);
    }*/

    /**
     * Usually called within constructor of the extending class.
     * 
     * @param actionState 
     * @param animation 
     */
    protected setStateTransition(actionState: ActionState, animation: AnimationBase) {
        this.states.set(actionState, animation);
    }

    public setState(newActionState: ActionState, context: any) {
        if (this.states.has(newActionState)) {
            if (this.runningAnimation) {
                this.runningAnimation.then((result) => {
                    if (result) clearInterval(result);
                });
                this.runningAnimation = undefined;
            }
            this.runningAnimation = this.states.get(newActionState)?.animate(context/*, this.internalAnimationState*/);
        } else {
            throw Error("ActionState '" + newActionState + "' existiert nicht!");
        }
    }
}