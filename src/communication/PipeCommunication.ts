import streamDeck from '@elgato/streamdeck';
import * as net from 'net';

export class PipeCommunication {
    private server?: net.Server;
    private pipeName: string;

    constructor(pipeName: string) {
        this.pipeName = `\\\\.\\pipe\\${pipeName}`;
    }

    public startServer(onMessage: (message: string) => void): void {
        this.server = net.createServer((stream) => { // callback stream is called on connection
            streamDeck.logger.debug(`Server notice: Client connected to pipe ${this.pipeName}`);

            stream.on('data', (data) => { // is called when data is received
                const message = data.toString().trim();
                onMessage(message);
            });
            stream.on('error', (err) => {
                streamDeck.logger.error(`Server notice: Stream error on pipe ${this.pipeName}: ${err.message}`);
            });
        });

        this.server.listen(this.pipeName, () => {
            streamDeck.logger.debug(`Server notice: started listening on ${this.pipeName}`);
            // Aktualisiere den Serverstatus in einem Monitoring-System
            // this.updateServerStatus("healthy");
        }).on('error', (err) => {
            streamDeck.logger.error(`Failed to start server on pipe ${this.pipeName}: ${err.message}`);
            // Wie reagieren? Buttons rot?
        });

        this.server.on('error', (err) => {
            streamDeck.logger.error(`Server error on pipe ${this.pipeName}: ${err.message}`);
            // Optional: Versuche, den Server neu zu starten?!
        });
    }

    public sendMessage(message: string): void {
        const client = net.connect(this.pipeName, () => {
            streamDeck.logger.debug(`Client notice: Connected to pipe ${this.pipeName}`);
            streamDeck.logger.trace(`Sending message to pipe ${this.pipeName}:`, message);

            client.write(message);
            client.end();
        });

        client.on('error', (err) => {
            streamDeck.logger.error(`Error sending message to pipe ${this.pipeName}: ${err.message}`);
        });
    }
}