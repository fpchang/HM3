if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { LogUtils } from '../utils/LogUtils';
import { GlobalConstants } from '../const/GlobalConstants';
export class Loading {
    show() {
        return new Promise((q9) => {
            let r9 = getContext();
            if (!r9 || !r9.windowStage) {
                LogUtils.e(GlobalConstants.GENERAL_TAG, "pay prepared: Loading show failed no windowStage");
                q9();
                return;
            }
            r9.windowStage.createSubWindow("alipayCashierPayLoading").then((v9) => {
                this.loadingWindow = v9;
                v9.setWindowLayoutFullScreen(true);
                v9.loadContentByName('alipay/component/payLoading').then(() => {
                    v9.setWindowBackgroundColor('#00000000');
                    v9.showWindow();
                    q9();
                }).catch((y9) => {
                    q9();
                });
            }).catch((u9) => {
                q9();
            });
        });
    }
    hide() {
        return this.loadingWindow?.destroyWindow() ?? Promise.resolve();
    }
}
class PayLoadingDialogComponent extends ViewPU {
    constructor(j9, k9, l9, m9 = -1, n9 = undefined, o9) {
        super(j9, l9, m9, o9);
        if (typeof n9 === "function") {
            this.paramsGenerator_ = n9;
        }
        this.setInitiallyProvidedValue(k9);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(i9) {
    }
    updateStateVars(h9) {
    }
    purgeVariableDependenciesOnElmtId(g9) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation2((e9, f9) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#00000000');
            Column.align(Alignment.Center);
        }, Column);
        PayLoadingDialog.bind(this)(this);
        Column.pop();
    }
    onBackPress() {
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName() {
        return "PayLoadingDialogComponent";
    }
}
function PayLoadingDialog(n8 = null) {
    (n8 ? n8 : this).observeComponentCreation2((b9, c9) => {
        Row.create();
        Row.align(Alignment.Center);
        Row.height('100%');
    }, Row);
    (n8 ? n8 : this).observeComponentCreation2((z8, a9) => {
        Column.create();
        Column.backgroundColor('#E51F2337');
        Column.width('50%');
        Column.height(40);
        Column.align(Alignment.Center);
        Column.borderRadius(50);
    }, Column);
    (n8 ? n8 : this).observeComponentCreation2((x8, y8) => {
        Row.create();
        Row.height(40);
        Row.align(Alignment.Center);
        Row.alignSelf(ItemAlign.Center);
        Row.padding(10);
    }, Row);
    (n8 ? n8 : this).observeComponentCreation2((v8, w8) => {
        Progress.create({ value: 0, total: 100, type: ProgressType.Ring });
        Progress.width(40);
        Progress.height(40);
        Progress.align(Alignment.Center);
        Progress.color('#1677FF');
        Progress.padding({
            top: 10,
            bottom: 10
        });
        Progress.style({ strokeWidth: 20, status: ProgressStatus.LOADING });
    }, Progress);
    (n8 ? n8 : this).observeComponentCreation2((t8, u8) => {
        Text.create("去支付宝付款");
        Text.align(Alignment.Center);
        Text.fontColor(Color.White);
    }, Text);
    Text.pop();
    Row.pop();
    Column.pop();
    Row.pop();
}
{
    let l8 = 'alipay/component/payLoading';
    registerNamedRoute(() => new PayLoadingDialogComponent(undefined, {}), l8, { bundleName: "com.alipay.sdk.pay.demo", moduleName: "cashiersdk", pagePath: "", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__" });
}
