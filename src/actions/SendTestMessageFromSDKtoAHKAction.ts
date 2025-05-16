import streamDeck, { action, type JsonObject, type KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { Sender } from "../communication/Sender";
import { Message } from "../communication/messages/Message";
import { MessageType } from "../communication/messages/MessageType";
import { MessageFactory } from "../communication/messages/MessageFactory";
import { DebugMessage } from "../communication/messages/DebugMessage";

@action({ UUID: "com.sweiguny.theodeck.from-sdk-to-ahk" })
export class SendTestMessageFromSDKtoAHKAction extends SingletonAction {
	private sender: Sender = Sender.getInstance();
	/**
	 * Handles the user pressing a Stream Deck key (pedal, G-key, etc).
	 * @param ev Information about the event.
	 */
	override async onKeyDown(ev: KeyDownEvent<JsonObject>): Promise<void> {
		streamDeck.logger.info("Going to send test message.");
		const message = new DebugMessage("SendTestMessageFromSDKtoAHKAction::onKeyDown", "Hello from SDK!");
		this.sender.sendMessage(message);
	}
}