import { BizContext } from '../context/BizContext';
import { TidStorage } from '../tid/TidStorage';
import { Context } from '@kit.AbilityKit';
export declare class MspConfig {
    static SHARE_PREFERENCE_NAME: string;
    static PREFERENCE_VIRTUAL_IMSI: string;
    static PREFERENCE_VIRTUAL_IMEI: string;
    mUserAgent: string | undefined;
    mKernelVersion: string | undefined;
    mClientKey: string | undefined;
    static instance: MspConfig;
    private constructor();
    static getInstance(): MspConfig;
    getUserAgent(f44: BizContext, g44: TidStorage, h44: boolean): string;
    static getPa(e44: Context): string;
    private getNetworkTypeSync;
    getVirtualImsi(d44: BizContext): string;
    getVirtualImei(c44: BizContext): string;
    static setRsaPublicKey(b44: string): void;
}
