import streamDeck from "@elgato/streamdeck";
import { AnimationBase } from "./AnimationBase";
import { ImageMagick, Percentage } from '@imagemagick/magick-wasm';
import { ImageUtils } from "../utils/ImageUtils";
import { ContextWrapper } from "../actions/ContextWrapper";

export class ColorFadeOut extends AnimationBase {

    public override async animate(context: ContextWrapper): Promise<void> {
        if (!context) {
            throw new Error("context is undefined!");
        }
        
        const toPercentage = (value: number) => new Percentage(value);
        // const originalImage = state.currentImage;
        // streamDeck.logger.info("ColorFadeOut", "originalImage:", originalImage);
        let progress = 1;

        const interval = setInterval(async () => {
            progress = Math.max(progress - 0.075, 0);

            const buffer = await ImageUtils.loadImageBuffer(this.getRefImage());

            const newBuffer = await new Promise<Buffer>((resolve) => {
                ImageMagick.read(buffer, (img) => {
                    const saturation = Math.floor(progress * 100);
                    img.modulate(toPercentage(100), toPercentage(saturation), toPercentage(100));
                    img.write((output: Uint8Array) => {
                        streamDeck.logger.info("ColorFadeOut", "saturation:", saturation);
                        //const uint8 = output as Uint8Array;
                        resolve(Buffer.from(output));
                    });
                });
            });

            const dataUrl = `data:image/png;base64,${newBuffer.toString('base64')}`;
            context.setImage(dataUrl);
            // streamDeck.logger.info("ColorFadeOut", "originalImage:", this.refImage);
            // streamDeck.logger.info("ColorFadeOut", "dataUrl:      ", dataUrl);

            if (progress <= 0) {
                clearInterval(interval);
                // streamDeck.logger.info("ColorFadeOut", "class of context (should be ContextWrapper; but may differ due to bundling)", context.constructor.name);
                // streamDeck.logger.info("ColorFadeOut", "Is instance of ContextWrapper:", context instanceof ContextWrapper);
                // streamDeck.logger.info("typeof context", context._animationState);
                try {
                    context.lastImage = dataUrl;
                } catch (error) {
                    streamDeck.logger.error("ColorFadeOut", "(TypeError?) Error setting lastImage:", error);
                }
            }
        }, 100);
    }
}