/** HINTS:
 * StreamDeck logs: C:\Users\<user>\AppData\Roaming\Elgato\StreamDeck\logs
 * Project logs:    C:\devproj\theodeck\com.sweiguny.theodeck.sdPlugin\logs
 * Get icons from:  https://icons8.de/
*/

import streamDeck, { ApplicationDidLaunchEvent, ApplicationDidTerminateEvent, LogLevel, SystemDidWakeUpEvent } from "@elgato/streamdeck";
import open from "open";
import * as Constants from "./constants";
import { IncrementCounter } from "./actions/increment-counter";
import { SendTestMessageFromSDKtoAHKAction } from "./actions/SendTestMessageFromSDKtoAHKAction";
import { StartZoomMeetingAction } from "./actions/StartZoomMeetingAction";
import { ImageUtils } from "./utils/ImageUtils";
import { MessageHandler } from "./communication/MessageHandler";
import { Receiver } from "./communication/Receiver";
import { Sender } from "./communication/Sender";
import { DeviceManager } from "./utils/DeviceManager";
import { GlobalState } from "./misc/GlobalState";
import { StatusObject } from "./communication/StatusObject";
import { GlobalState1 } from "./misc/GlobalState1";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

streamDeck.system.onSystemDidWakeUp((ev: SystemDidWakeUpEvent) => {
    streamDeck.logger.trace("onSystemDidWakeUp");


});

streamDeck.logger.debug("after onSystemDidWakeUp");
await ImageUtils.initialize();
streamDeck.logger.debug("after imageutils.initialize()");
DeviceManager.getInstance(); // initializes already in constructor, but we need to call it to ensure it's loaded
// DeviceManager.getInstance().setDefaultAudioDevice("Headset (TheoDeck)"); // TODO: get from settings
streamDeck.logger.debug("after devicemanager.getInstance()");

const startZoomMeetingAction = new StartZoomMeetingAction();
streamDeck.actions.registerAction(startZoomMeetingAction);

streamDeck.system.onApplicationDidLaunch((ev: ApplicationDidLaunchEvent) => {
    streamDeck.logger.trace("onApplicationDidLaunch");
    streamDeck.logger.trace(ev.application);
    if (ev.application == Constants.ZoomExe) {
        //zoomAction.resetImage();
        streamDeck.logger.trace("Zoom started, so spinner can be removed");
    }

    if (ev.application == Constants.TheoDeckAHKexe) {
        streamDeck.logger.trace(Constants.TheoDeckAHKexe + " launched, initializing communication...");
        GlobalState.getInstance().assign(new StatusObject({AhkScriptActive: true}));

        // const receiver = Receiver.getInstance();
        // const messageHandler = new MessageHandler();
        // receiver.startListening(messageHandler.handleMessage.bind(messageHandler));

        // const sender = Sender.getInstance();
        // sender.sendMessage('Hello from SDK!');
    }
});

streamDeck.system.onApplicationDidTerminate((ev: ApplicationDidTerminateEvent) => {
    streamDeck.logger.trace("onApplicationDidTerminate");
    streamDeck.logger.trace(ev.application);
    GlobalState.getInstance().assign(new StatusObject({AhkScriptActive: false}));
    // TODO: globale "Warteliste": Bei Button-Press für Zoom beenden wird ein Eintrag in die Warteliste geschrieben.
    // Wenn das Event hier getriggert wird und es keinen Eintrag in der Warteliste gibt, dann wird ein Fehler geloggt.
    // Wenn das Event hier getriggert wird und es einen Eintrag in der Warteliste gibt, dann wird der Eintrag gelöscht.
    // Jedenfalls wird dann auch der Zoom-Button auf "stopped" gesetzt.
    
    /*if (ev.application == "Zoom.exe") {
        startZoomMeetingAction.resetImage();
        streamDeck.logger.info("Zoom exited, so spinner can be removed");
    }*/
});

streamDeck.system.onDidReceiveDeepLink((ev) => { // streamdeck://plugins/message/com.sweiguny.theodeck/path/to/something?query=123#fragment
    const { path, query, fragment } = ev.url;

    streamDeck.logger.info("onDidReceiveDeepLink");
    streamDeck.logger.info(path, query, fragment);
});


// Register the increment action.
streamDeck.actions.registerAction(new IncrementCounter());
streamDeck.actions.registerAction(new SendTestMessageFromSDKtoAHKAction());
//streamDeck.actions.registerAction(new ZoomStartAction());

// Finally, connect to the Stream Deck.
streamDeck.connect();
streamDeck.logger.debug("streamDeck connected");

open('.\\bin\\TheoDeck.exe').catch((err) => {
    streamDeck.logger.error('Fehler:', err);
});

streamDeck.logger.debug("AhkScriptActive", GlobalState1.getInstance().state.AhkScriptActive, GlobalState1.getInstance().state.AhkScriptActive.valueOf, GlobalState1.getInstance().state.AhkScriptActive.toString);

const receiver = Receiver.getInstance();
const messageHandler = new MessageHandler();

// Starte den Receiver und registriere den MessageHandler
receiver.registerHandler("master", messageHandler.handleMessage.bind(messageHandler));
receiver.startListening();

// Sende eine Testnachricht an AHK
// const sender = Sender.getInstance();