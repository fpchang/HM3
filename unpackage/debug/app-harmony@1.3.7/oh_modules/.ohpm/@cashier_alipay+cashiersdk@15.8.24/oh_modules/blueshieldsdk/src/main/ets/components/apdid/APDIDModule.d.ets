import { IAPDIDModule, TokenResult } from './IAPDIDModule';
import { AsyncCallback } from '@ohos.base';
export declare class APDIDModule implements IAPDIDModule {
    initToken(f20: Map<string, string>, g20: AsyncCallback<TokenResult, void>): void;
    initToken(h20: Map<string, string>): Promise<TokenResult>;
    getTokenResult(): TokenResult;
    getApdidToken(): string;
    initOpenToken(a20: string, b20: string, c20: AsyncCallback<string, void>): void;
    initOpenToken(d20: string, e20: string): Promise<string>;
    registerDeviceIdChanged(z19: AsyncCallback<number, void>): void;
}
