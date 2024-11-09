import router from "@ohos.router";
export class CaptchaViewManager {
    static show(t9) {
        const u9 = JSON.parse(t9);
        if (null === u9) {
            return;
        }
        let v9 = u9['action'];
        let w9 = u9['extInfo'];
        if ('wait' === v9 || 'block' === v9 || 'captcha' === v9) {
            router.pushNamedRoute({
                name: 'CaptchaDialogCaller',
                params: {
                    customUIElement: t9
                }
            });
        }
        else if ('deny' == v9) {
        }
    }
}
