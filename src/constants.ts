import streamDeck from '@elgato/streamdeck';
import { Config } from './utils/Config';

const cfgPath = `${process.cwd()}/cfg/cfg.ini`
streamDeck.logger.debug(`Path to config: ${cfgPath}`);
const config = Config.read(cfgPath);

export const ZoomExe          = config.AHK.Zoom_ahk_exe;
export const TheoDeckAHKexe   = config.Constants.TheoDeckAHKexe;
export const PipeFromSDKtoAHK = config.Constants.PipeFromSDKtoAHK;
export const PipeFromAHKtoSDK = config.Constants.PipeFromAHKtoSDK;

