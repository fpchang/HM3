import { ISafeSignatureModule, BS_SAFE_SIGNATURE_ALGO } from './ISafeSignatureModule';
export declare class SafeSignatureModule implements ISafeSignatureModule {
    sign(v19: BS_SAFE_SIGNATURE_ALGO, w19: string, x19: Uint8Array): Uint8Array;
    signString(s19: BS_SAFE_SIGNATURE_ALGO, t19: string, u19: string): string;
    private signInternal;
}
