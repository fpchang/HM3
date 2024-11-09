import { IStaticCryptoModule, BS_STAIC_CRYPTO_MODE } from './IStaticCryptoModule';
export declare class StaticCryptoModule implements IStaticCryptoModule {
    encrypt(n18: BS_STAIC_CRYPTO_MODE, o18: string, p18: Uint8Array, q18?: string): Uint8Array;
    decrypt(j18: BS_STAIC_CRYPTO_MODE, k18: string, l18: Uint8Array, m18?: string): Uint8Array;
    encryptBase64(f18: BS_STAIC_CRYPTO_MODE, g18: string, h18: Uint8Array, i18?: string): Uint8Array;
    decryptBase64(b18: BS_STAIC_CRYPTO_MODE, c18: string, d18: Uint8Array, e18?: string): Uint8Array;
    encryptStringBase64(x17: BS_STAIC_CRYPTO_MODE, y17: string, z17: string, a18?: string): string;
    decryptStringBase64(t17: BS_STAIC_CRYPTO_MODE, u17: string, v17: string, w17?: string): string;
    private doEncrypt;
    private doDecrypt;
}
