import streamDeck from "@elgato/streamdeck";
import { AnimationBase } from "./AnimationBase";
import { CompositeOperator, ImageMagick, MagickColor, MagickFormat, Point } from "@imagemagick/magick-wasm";
import { ImageUtils } from "../utils/ImageUtils";
import { ContextWrapper } from "../actions/ContextWrapper";

export class Spinner extends AnimationBase {
    private spinnerImage: string = "imgs/plugin/icons8-ladeschild-100.png";

    public override async animate(context: ContextWrapper): Promise<NodeJS.Timeout> {
        if (!context) {
            throw new Error("context is undefined!");
        }
        // const baseImageBuffer = await ImageUtils.loadImageBuffer(this.refImage);
        const baseImageBuffer = await ImageUtils.loadImageBuffer(this.getRefImage());
        const spinnerBuffer   = await ImageUtils.loadImageBuffer(this.spinnerImage);
        let angle = 0;

        const interval = setInterval(async () => {
            // try {
                const result = await new Promise<Uint8Array>((resolve) => {
                    ImageMagick.read(baseImageBuffer, (baseImage) => {
                        ImageMagick.read(spinnerBuffer, (spinner) => {
                            // Format absichern (PNG mit Alpha)
                            spinner.format = MagickFormat.Png;
                            spinner.backgroundColor = new MagickColor('none');
                            
                            spinner.resize(250,250);

                            // Drehung
                            spinner.rotate(angle);
                            angle = (angle + 20) % 360;

                            // Zentrierung berechnen
                            const offsetX = Math.floor((baseImage.width - spinner.width) / 2);
                            const offsetY = Math.floor((baseImage.height - spinner.height) / 2);

                            // Überlagern
                            baseImage.composite(spinner, CompositeOperator.Over, new Point(offsetX, offsetY));

                            // Exportieren
                            baseImage.write((output) => {
                                resolve(new Uint8Array(output));
                            });
                        });
                    });
                });

                const base64 = Buffer.from(result).toString('base64');
                const dataUrl = `data:image/png;base64,${base64}`;
                context.setImage(dataUrl);
                context.lastImage = dataUrl; // eigentlich nicht nötig, da wir den Spinner nicht speichern wollen
                streamDeck.logger.info("Spinner", "dataUrl:      ", dataUrl);
            // } catch (err) {
            //     console.error('SpinnerOverlayAnimation error:', err);
            // }
        }, 50); // 150ms Intervall → ≈6.6 FPS

        return interval;
    }
}