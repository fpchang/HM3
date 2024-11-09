import { IDynamicCryptoModule } from './IDynamicCryptoModule';
export declare class DynamicCryptoModule implements IDynamicCryptoModule {
    encrypt(u18: Uint8Array): Uint8Array;
    encryptStringBase64(t18: string): string;
    decrypt(s18: Uint8Array): Uint8Array;
    decryptStringBase64(r18: string): string;
}
