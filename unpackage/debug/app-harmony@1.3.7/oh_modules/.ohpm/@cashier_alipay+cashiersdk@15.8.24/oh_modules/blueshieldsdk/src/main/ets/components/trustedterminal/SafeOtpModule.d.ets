import { ISafeOtpModule, BS_SAFE_OTP_ALGO } from './ISafeOtpModule';
export declare class SafeOtpModule implements ISafeOtpModule {
    getOtpSHA1(p19: Uint8Array, q19: number, r19: number): string;
    getOtpSM3(l19: string, m19: string, n19: number, o19: number): string;
    getOtpCommon(f19: BS_SAFE_OTP_ALGO, g19: string, h19: string, i19: number, j19: number, k19: number): string;
}
