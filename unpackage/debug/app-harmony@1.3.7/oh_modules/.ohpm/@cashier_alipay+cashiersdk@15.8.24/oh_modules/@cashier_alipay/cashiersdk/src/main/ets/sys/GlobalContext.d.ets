import { MspConfig } from '../data/MspConfig';
import { Context } from '@kit.AbilityKit';
export declare class GlobalContext {
    private static instance;
    private constructor();
    static getInstance(): GlobalContext;
    getConfig(): MspConfig;
    getUtdid(x40: Context): string;
}
