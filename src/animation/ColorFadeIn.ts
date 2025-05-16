import streamDeck from "@elgato/streamdeck";
import { AnimationBase } from "./AnimationBase";
import { ImageMagick, Percentage } from '@imagemagick/magick-wasm';
import { ImageUtils } from "../utils/ImageUtils";
import { ContextWrapper } from "../actions/ContextWrapper";

export class ColorFadeIn extends AnimationBase {

    public override async animate(context: ContextWrapper): Promise<void> {
        if (!context) {
            throw new Error("context is undefined!");
        }
        const toPercentage = (value: number) => new Percentage(value);
        // const originalImage = state.lastImage;
        // streamDeck.logger.info("ColorFadeIn", "originalImage:", originalImage);
        // streamDeck.logger.info("ColorFadeIn", "lastImage    :", state.lastImage);
        let progress = 0;

        const interval = setInterval(async () => {
            progress = Math.min(progress + 0.075, 1);

            const buffer = await ImageUtils.loadImageBuffer(this.getRefImage());

            const newBuffer = await new Promise<Buffer>((resolve) => {
                ImageMagick.read(buffer, (img) => {
                    const saturation = Math.floor(progress * 100);
                    img.modulate(toPercentage(100), toPercentage(saturation), toPercentage(100));
                    img.write((output: Uint8Array) => {
                        // streamDeck.logger.info("ColorFadeIn", "saturation:", saturation);
                        //const uint8 = output as Uint8Array;
                        resolve(Buffer.from(output));
                    });
                });
            });

            const dataUrl = `data:image/png;base64,${newBuffer.toString('base64')}`;
            context.setImage(dataUrl);
            // streamDeck.logger.info("ColorFadeIn", "originalImage:", this.refImage);
            // streamDeck.logger.info("ColorFadeIn", "dataUrl:      ", dataUrl);

            if (progress >= 1) {
                clearInterval(interval);
                context.lastImage = dataUrl;
            }
        }, 100);
    }
}