export interface ICaptchaVerifyModule {
    onCaptchaVerify(params: Map<string, string>, callback: CaptchaVerifyCallback): void;
}
export interface CaptchaVerifyCallback {
    onVerified(secToken: string, extraInfo: Map<string, string>, errorCode: number): void;
}
