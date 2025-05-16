import streamDeck, { action, ActionContext, JsonObject, KeyDownEvent, SingletonAction, WillAppearEvent } from '@elgato/streamdeck';
import { exec } from 'child_process';
import path from 'path';
import { loadImage } from 'canvas';
import open from 'open';
import { ColorFadeOut } from '../animation/ColorFadeOut';
import { ActionState, StatefulAnimatedAction } from '../StatefulAnimatedAction';
import { ColorFadeIn } from '../animation/ColorFadeIn';
import { Spinner } from '../animation/Spinner';
import { ContextWrapper } from './ContextWrapper';
import { Sender } from '../communication/Sender';
import { Message } from '../communication/messages/Message';
import { MessageType } from '../communication/messages/MessageType';
import { DemandMessage } from '../communication/messages/DemandMessage';
import { DemandType } from '../communication/messages/DemandType';
import { GlobalState } from '../misc/GlobalState';
import { GlobalStateEvent } from '../misc/GlobalStateEvent';



@action({ UUID: "com.sweiguny.theodeck.start-zoom-meeting" })
export class StartZoomMeetingAction extends StatefulAnimatedAction {
    private isLaunching: boolean = false;
    private animationInterval: NodeJS.Timeout | null = null;
    private meetingId!: string;
    private meetingPW!: string;
    private sender: Sender = Sender.getInstance();

    // private context: ContextWrapper = new ContextWrapper(null);
    private context!: ContextWrapper;

    private zoomLogoPath: string = "imgs/plugin/zoom.png";
    private currentState: ActionState = ActionState.stopped;

    constructor() {
        super();

        this.setStateTransition(ActionState.stopped, new ColorFadeOut(this.zoomLogoPath));
        // this.setStateTransition(ActionState.starting, new Spinner(() => this.context?.lastImage));
        this.setStateTransition(ActionState.starting, new Spinner(() => {
            if (!this.context) throw new Error("Context not set!"); // TODO: check if this is needed
            return this.context.lastImage;
        }));
        this.setStateTransition(ActionState.running, new ColorFadeIn(this.zoomLogoPath));
        this.setStateTransition(ActionState.error, new ColorFadeIn(this.zoomLogoPath)); // TODO: Error Animation

        
        // registers the event handler for listening whether a Zoom meeting is running or not
        // the check whether a Zoom meeting is running or not is done in the onWillAppear method
        streamDeck.logger.debug("GlobalState.getInstance()");
        GlobalState.getInstance().on(GlobalStateEvent.ZoomMeetingRunningChanged, (value: boolean) => {
            streamDeck.logger.debug("in GlobalState.getInstance() on");
            // TODO: kann vereinfacht werden
            streamDeck.logger.info("ZoomMeetingRunning changed:", value);
            if (value) {
                this.setState(ActionState.running, this.context);
                this.currentState = ActionState.running;
            } else {
                this.setState(ActionState.stopped, this.context);
                this.currentState = ActionState.stopped;
            }
        });
    }

    override async onWillAppear(ev: WillAppearEvent): Promise<void> {
        this.context = new ContextWrapper(ev.action); // Speichere context
        streamDeck.logger.info("class of context (should be ContextWrapper; but may differ due to bundling)", this.context.constructor.name);
        streamDeck.logger.info("Is instance of ContextWrapper:", this.context instanceof ContextWrapper);

        const settings = ev.payload.settings;
        this.meetingId = settings.meetingId as string;
        this.meetingPW = settings.meetingPW as string;

        streamDeck.logger.info("Loaded settings:", settings);

        /**
         * TODO:
         * Alter Schwede, jetzt wird's häftik!
         * Wir brauchen einen globalen Status: Zoom Meeting läuft, Ahk läuft
         * Wir brauchen einen lokalen Status: Button ist ausgegraut
         * Eigentlich müssen wir anhand des globalen Status sagen, welchen _NEUEN_ Status der Button einnehmen soll
         * und welche Funktion er anhand dessen hat....
         * Um den Zustandsübergang zu definieren brauchen wir die Animationen.
         */
        // TODO: if zoom meeting not started
        // this.setState(ActionState.stopped, this.context);

        // check whether Zoom is running or not
        // in case the Zoom meeting is running, the MessageHandler will set the global state to true, which triggers a GlobalStateEvent
        // the GlobalStateEvent will be handled in the constructor of this class
        

        streamDeck.logger.info("Going to send message:", DemandType.ZoomMeetingRunning);
        const message = new DemandMessage(DemandType.ZoomMeetingRunning, "onWillAppear", "Hello from SDK!");
        this.sender.sendMessage(message);
    }


    override async onKeyDown(ev: KeyDownEvent<JsonObject>): Promise<void> {
        streamDeck.logger.info("onKeyDown in start-zoom", "Value of isLauchning: '" + this.isLaunching + "'");
        if (this.currentState == ActionState.stopped) {
            //this.isLaunching = true;
            this.setState(ActionState.starting, this.context);
            this.currentState = ActionState.starting;
        } else if (this.currentState == ActionState.starting) {
            this.setState(ActionState.running, this.context);
            this.currentState = ActionState.running;
        } else {
            this.isLaunching = false;
            this.setState(ActionState.stopped, this.context);
            this.currentState = ActionState.stopped;
        }
        /* if (!this.isLaunching) {
            this.isLaunching = true;
            this.animationInterval = ImageUtils.startAnimation(
                zoomLogoPath,
                spinnerPath,
                (image) => ev.action.setImage(image),
                () => (this.isLaunching = false)
            );

            //streamDeck.logger.info("Zoom starten via Deeplink?");
            try {
                await open('zoommtg://zoom.us/join?confno=87227222722&pwd=bUJVNDE3dHFkQzFqeThnMU9KQ0xsdz09');
            } catch (err) {
                console.error('Fehler beim Starten von Zoom:', err);
                if (this.animationInterval) {
                    clearInterval(this.animationInterval);
                    this.animationInterval = null;
                }
            }
        }*/
    }

    /*async resetImage(): Promise<void> {
        if (this.isLaunching && this.context) {
            this.isLaunching = false;
            if (this.animationInterval) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
            }
            ImageUtils.fadeInImage(
                zoomLogoPath,
                (image) => this.context.setImage(image),
                () => { }
            );
        }
    }*/
}