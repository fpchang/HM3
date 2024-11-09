import { EnvelopeCryptoParams, EnvelopeCryptoResult, IEnvelopeCryptoModule } from './IEnvelopeCryptoModule';
export declare class EnvelopeCryptoModule implements IEnvelopeCryptoModule {
    encrypt(a19: EnvelopeCryptoParams, b19: Uint8Array): EnvelopeCryptoResult;
    encrypt(c19: EnvelopeCryptoParams, d19: Uint8Array, e19: string): EnvelopeCryptoResult;
    decrypt(v18: EnvelopeCryptoParams, w18: Uint8Array): EnvelopeCryptoResult;
    decrypt(x18: EnvelopeCryptoParams, y18: Uint8Array, z18: string): EnvelopeCryptoResult;
    private doEncrypt;
    private doDecrypt;
}
