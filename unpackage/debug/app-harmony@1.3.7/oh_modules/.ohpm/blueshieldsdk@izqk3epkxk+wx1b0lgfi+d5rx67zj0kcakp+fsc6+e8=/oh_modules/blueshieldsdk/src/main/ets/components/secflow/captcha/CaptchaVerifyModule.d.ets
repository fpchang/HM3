import { CaptchaVerifyCallback, ICaptchaVerifyModule } from './ICaptchaVerifyModule';
export declare class CaptchaVerifyModule implements ICaptchaVerifyModule {
    onCaptchaVerify(i21: Map<string, string>, j21: CaptchaVerifyCallback): void;
}
