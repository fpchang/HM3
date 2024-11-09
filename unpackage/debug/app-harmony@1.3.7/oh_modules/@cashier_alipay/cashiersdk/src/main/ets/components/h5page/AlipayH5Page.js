if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import promptAction from "@ohos.promptAction";
import router from "@ohos.router";
import window from "@ohos.window";
import { Result, ResultStatus } from '../../api/Result';
import webview from "@ohos.web.webview";
import { getQueryMap } from '../../utils/Utils';
import { GlobalConstants } from '../../const/GlobalConstants';
import { JS_BRIDGE_V2 } from '../../utils/JS';
import { LogUtils } from '../../utils/LogUtils';
export function AlipayH5PageBuilder(a8, b8, c8 = null) {
    {
        (c8 ? c8 : this).observeComponentCreation2((e8, f8) => {
            if (f8) {
                let g8 = new AlipayH5Page(ViewPU.__proto__ !== NativeViewPartialUpdate && c8 instanceof PUV2ViewBase ? c8 : this, { navPageIntent: b8 }, undefined, e8, () => { }, { page: "cashiersdk/src/main/ets/components/h5page/AlipayH5Page.ets", line: 12 });
                ViewPU.create(g8);
                let h8 = () => {
                    return {
                        navPageIntent: b8
                    };
                };
                g8.paramsGenerator_ = h8;
            }
            else {
                (c8 ? c8 : this).updateStateVarsOfChildByElmtId(e8, {});
            }
        }, { name: "AlipayH5Page" });
    }
}
export class RouterParams {
    constructor() {
        this.url = "";
        this.method = "";
        this.cookie = "";
        this.title = "";
        this.isBackExit = false;
        this.containerVersion = 'v1';
    }
}
const JS_BRIDGE_PREFIX = "alipayjsbridge://";
const V2_FUNCTION_CALLNATIVE = "callNativeFuncV2";
const V2_FUNCTION_CAN_USE_TAO_LOGIN = "canUseTaoLoginV2";
export class AlipayH5Page extends ViewPU {
    constructor(u7, v7, w7, x7 = -1, y7 = undefined, z7) {
        super(u7, w7, x7, z7);
        if (typeof y7 === "function") {
            this.paramsGenerator_ = y7;
        }
        this.context = getContext(this);
        this.url = undefined;
        this.__progress = new ObservedPropertySimplePU(0, this, "progress");
        this.method = undefined;
        this.cookie = undefined;
        this.__title = new ObservedPropertyObjectPU('', this, "title");
        this.__showRefresh = new ObservedPropertySimplePU(true, this, "showRefresh");
        this.__showHeader = new ObservedPropertySimplePU(false, this, "showHeader");
        this.__showProgress = new ObservedPropertySimplePU(false, this, "showProgress");
        this.navPageIntent = undefined;
        this.navPathStack = undefined;
        this.isBackExit = true;
        this.containerVersion = 'v1';
        this.isErrorPage = false;
        this.webviewController = undefined;
        this.__isFullScreen = new ObservedPropertySimplePU(false, this, "isFullScreen");
        this.__statusBarHeight = new ObservedPropertySimplePU(0, this, "statusBarHeight");
        this.setInitiallyProvidedValue(v7);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(t7) {
        if (t7.context !== undefined) {
            this.context = t7.context;
        }
        if (t7.url !== undefined) {
            this.url = t7.url;
        }
        if (t7.progress !== undefined) {
            this.progress = t7.progress;
        }
        if (t7.method !== undefined) {
            this.method = t7.method;
        }
        if (t7.cookie !== undefined) {
            this.cookie = t7.cookie;
        }
        if (t7.title !== undefined) {
            this.title = t7.title;
        }
        if (t7.showRefresh !== undefined) {
            this.showRefresh = t7.showRefresh;
        }
        if (t7.showHeader !== undefined) {
            this.showHeader = t7.showHeader;
        }
        if (t7.showProgress !== undefined) {
            this.showProgress = t7.showProgress;
        }
        if (t7.navPageIntent !== undefined) {
            this.navPageIntent = t7.navPageIntent;
        }
        if (t7.navPathStack !== undefined) {
            this.navPathStack = t7.navPathStack;
        }
        if (t7.isBackExit !== undefined) {
            this.isBackExit = t7.isBackExit;
        }
        if (t7.containerVersion !== undefined) {
            this.containerVersion = t7.containerVersion;
        }
        if (t7.isErrorPage !== undefined) {
            this.isErrorPage = t7.isErrorPage;
        }
        if (t7.webviewController !== undefined) {
            this.webviewController = t7.webviewController;
        }
        if (t7.isFullScreen !== undefined) {
            this.isFullScreen = t7.isFullScreen;
        }
        if (t7.statusBarHeight !== undefined) {
            this.statusBarHeight = t7.statusBarHeight;
        }
    }
    updateStateVars(s7) {
    }
    purgeVariableDependenciesOnElmtId(r7) {
        this.__progress.purgeDependencyOnElmtId(r7);
        this.__title.purgeDependencyOnElmtId(r7);
        this.__showRefresh.purgeDependencyOnElmtId(r7);
        this.__showHeader.purgeDependencyOnElmtId(r7);
        this.__showProgress.purgeDependencyOnElmtId(r7);
        this.__isFullScreen.purgeDependencyOnElmtId(r7);
        this.__statusBarHeight.purgeDependencyOnElmtId(r7);
    }
    aboutToBeDeleted() {
        this.__progress.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__showRefresh.aboutToBeDeleted();
        this.__showHeader.aboutToBeDeleted();
        this.__showProgress.aboutToBeDeleted();
        this.__isFullScreen.aboutToBeDeleted();
        this.__statusBarHeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get progress() {
        return this.__progress.get();
    }
    set progress(q7) {
        this.__progress.set(q7);
    }
    get title() {
        return this.__title.get();
    }
    set title(p7) {
        this.__title.set(p7);
    }
    get showRefresh() {
        return this.__showRefresh.get();
    }
    set showRefresh(o7) {
        this.__showRefresh.set(o7);
    }
    get showHeader() {
        return this.__showHeader.get();
    }
    set showHeader(n7) {
        this.__showHeader.set(n7);
    }
    get showProgress() {
        return this.__showProgress.get();
    }
    set showProgress(m7) {
        this.__showProgress.set(m7);
    }
    get isFullScreen() {
        return this.__isFullScreen.get();
    }
    set isFullScreen(l7) {
        this.__isFullScreen.set(l7);
    }
    get statusBarHeight() {
        return this.__statusBarHeight.get();
    }
    set statusBarHeight(k7) {
        this.__statusBarHeight.set(k7);
    }
    aboutToAppear() {
        let i7;
        if (this.navPageIntent) {
            i7 = this.navPageIntent?.get('params');
        }
        else {
            i7 = router.getParams();
        }
        this.url = i7.url;
        this.method = i7.method;
        this.cookie = i7.cookie;
        this.title = i7.title;
        this.isBackExit = i7.isBackExit;
        this.containerVersion = i7.containerVersion;
        this.navPathStack = i7.navPathStack;
        this.showHeader = !this.isV1();
        this.showProgress = !this.isV1();
        if (!this.url) {
            LogUtils.w('H5Page', 'url is null');
            this.goBack();
        }
        this.updateCookie();
        let j7 = this.context.windowStage?.getMainWindowSync();
        this.isFullScreen = j7?.getWindowProperties().isLayoutFullScreen;
        this.getStatusBarHeight(j7);
    }
    getStatusBarHeight(f7) {
        let g7 = window.AvoidAreaType.TYPE_SYSTEM;
        let h7 = f7.getWindowAvoidArea(g7);
        this.statusBarHeight = px2vp(h7.topRect.height);
        return this.statusBarHeight;
    }
    updateCookie() {
        if (this.cookie) {
            webview.WebCookieManager.configCookieSync(this.url, this.cookie);
            webview.WebCookieManager.saveCookieAsync();
        }
    }
    aboutToDisappear() {
    }
    onBackPress() {
        this.goBack();
        return true;
    }
    emitPayResult(e7) {
        this.context.eventHub.emit("payResult", e7);
    }
    goBack() {
        if (this.isBackExit) {
            this.finish();
            return;
        }
        if (this.webviewController?.accessBackward()) {
            if (this.isErrorPage) {
                this.finish();
                this.emitPayResult(Result.parseResult(ResultStatus.NETWORK_ERROR));
                return;
            }
            return;
        }
        this.finish();
        this.emitPayResult(Result.getCancel());
    }
    finish() {
        if (this.navPathStack) {
            this.navPathStack.pop();
        }
        else {
            router.back();
        }
    }
    onPageShow() {
    }
    onRefresh() {
        this.webviewController?.refresh();
        this.showRefresh = false;
    }
    isV1() {
        return this.containerVersion == 'v1';
    }
    initialRender() {
        this.observeComponentCreation2((v6, w6) => {
            If.create();
            if (this.navPathStack || this.navPageIntent) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((a7, b7) => {
                        NavDestination.create(() => {
                            this.buildContent.bind(this)(this);
                        }, { moduleName: "cashiersdk", pagePath: "" });
                        NavDestination.backgroundColor(Color.Transparent);
                        NavDestination.hideTitleBar(true);
                        NavDestination.onBackPressed(() => {
                            this.onBackPress();
                            return true;
                        });
                    }, NavDestination);
                    NavDestination.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.buildContent.bind(this)(this);
                });
            }
        }, If);
        If.pop();
    }
    buildContent(y3 = null) {
        this.observeComponentCreation2((s6, t6) => {
            Column.create();
            Column.margin({ top: this.isFullScreen ? this.statusBarHeight : 0 });
        }, Column);
        this.observeComponentCreation2((s5, t5) => {
            If.create();
            if (this.showHeader) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((q6, r6) => {
                        Row.create();
                        Row.width('100%');
                        Row.height(50);
                        Row.backgroundColor(0xffffff);
                    }, Row);
                    this.observeComponentCreation2((n6, o6) => {
                        Image.create({ "id": -1, "type": 20000, params: ['app.media.title_bar_back_btn_black'], "bundleName": "__harDefaultBundleName__", "moduleName": "__harDefaultModuleName__" });
                        Image.width(48);
                        Image.height(48);
                        Image.padding(12);
                        Image.onClick(() => {
                            this.goBack();
                        });
                    }, Image);
                    this.observeComponentCreation2((l6, m6) => {
                        Text.create(this.title);
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ right: 50 });
                        Text.textAlign(TextAlign.Center);
                        Text.align(Alignment.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((j6, k6) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((b6, c6) => {
                        If.create();
                        if (this.showRefresh) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((g6, h6) => {
                                    Image.create({ "id": -1, "type": 20000, params: ['app.media.alipay_msp_refresh_nav'], "bundleName": "__harDefaultBundleName__", "moduleName": "__harDefaultModuleName__" });
                                    Image.width(48);
                                    Image.height(48);
                                    Image.padding(12);
                                    Image.onClick(() => {
                                        this.onRefresh();
                                    });
                                }, Image);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((l5, m5) => {
            If.create();
            if (this.showProgress) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((q5, r5) => {
                        Progress.create({
                            value: this.progress,
                            total: 100,
                            style: ProgressStyle.Linear,
                        });
                        Progress.width('100%');
                        Progress.height(2);
                        Progress.visibility(this.progress != 100 ? Visibility.Visible : Visibility.Hidden);
                    }, Progress);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((d4, e4) => {
            Web.create({
                src: this.url,
                controller: this.createWebViewController(),
            });
            Web.overviewModeAccess(true);
            Web.javaScriptAccess(true);
            Web.password(true);
            Web.allowWindowOpenMethod(true);
            Web.fileAccess(false);
            Web.domStorageAccess(true);
            Web.onControllerAttached(() => {
                LogUtils.d('H5Page', this.webviewController?.getUserAgent());
            });
            Web.onAppear(() => {
                this.onPageShow();
            });
            Web.onDownloadStart((k5) => {
            });
            Web.onProgressChange((i5) => {
                let j5 = i5?.newProgress ?? 0;
                this.progress = j5;
            });
            Web.onPrompt((g5) => {
                LogUtils.d('H5Page', "onPrompt" + g5?.message + " " + g5?.url);
                let h5 = g5?.message;
                if (h5 && h5.startsWith("<head>") && h5.includes('sdk_result_code:')) {
                    this.goBack();
                }
                return true;
            });
            Web.onTitleReceive((e5) => {
                let f5 = e5?.title;
                if (f5 && (!f5.startsWith("http") && !this.url?.endsWith(f5))) {
                    this.title = f5;
                }
            });
            Web.onPageBegin((c5) => {
                let d5 = c5?.url;
                if (d5 && !d5.endsWith(".apk")) {
                    this.injectJsApi();
                }
            });
            Web.onLoadIntercept((t4) => {
                let u4 = t4?.data;
                if (u4 instanceof WebResourceRequest) {
                    let v4 = u4.getRequestUrl();
                    LogUtils.d('H5Page', "onUrlLoadIntercept " + v4);
                    if (v4 == GlobalConstants.H5_QUIT_TAG) {
                        this.finish();
                        this.emitPayResult(Result.getCancel());
                        return true;
                    }
                    if (v4.startsWith(JS_BRIDGE_PREFIX)) {
                        this.processJsBridge(v4.substring(JS_BRIDGE_PREFIX.length));
                        return true;
                    }
                    if (v4.startsWith(GlobalConstants.PAY_RESULT_TAG)) {
                        let w4 = getQueryMap(v4);
                        let x4 = w4.get("result") ?? "";
                        let y4 = w4.get("end_code") ?? "";
                        let z4 = parseInt(y4);
                        if (z4 == ResultStatus.SUCCEEDED.status || z4 == ResultStatus.PAY_WAITTING.status) {
                            let b5 = ResultStatus.getResultStatus(z4);
                            this.finish();
                            this.emitPayResult(Result.parseResultV1(b5.status, b5.memo, x4));
                        }
                        else {
                            let a5 = ResultStatus.FAILED;
                            this.emitPayResult(Result.parseResult(a5, ""));
                        }
                        return true;
                    }
                    if (v4.endsWith(".apk")) {
                        promptAction.showToast({
                            message: '暂不支持下载',
                            duration: 2000
                        });
                        return true;
                    }
                    return false;
                }
                return false;
            });
            Web.onPageEnd((s4) => {
                this.injectJsApi();
                this.showRefresh = true;
            });
            Web.onErrorReceive((r4) => {
                LogUtils.d('H5Page', "onErrorReceive: " + r4?.error.getErrorInfo());
                this.isErrorPage = true;
                this.showRefresh = true;
                return true;
            });
            Web.onSslErrorEventReceive((q4) => {
                LogUtils.d('H5Page', "onSslErrorEventReceive");
                AlertDialog.show({
                    alignment: DialogAlignment.Center,
                    title: { "id": -1, "type": 10003, params: ['app.string.msp_ssl_error_title'], "bundleName": "__harDefaultBundleName__", "moduleName": "__harDefaultModuleName__" },
                    message: { "id": -1, "type": 10003, params: ['app.string.msp_ssl_error'], "bundleName": "__harDefaultBundleName__", "moduleName": "__harDefaultModuleName__" },
                    primaryButton: {
                        value: { "id": -1, "type": 10003, params: ['app.string.ok'], "bundleName": "__harDefaultBundleName__", "moduleName": "__harDefaultModuleName__" },
                        action: () => {
                            this.finish();
                        }
                    }
                });
                return true;
            });
        }, Web);
        Column.pop();
    }
    createWebViewController() {
        this.webviewController = new webview.WebviewController();
        return this.webviewController;
    }
    injectJsApi() {
        this.webviewController?.runJavaScript(`javascript:${JS_BRIDGE_V2};window.AlipayJSBridge.callListener('h5PageFinished');`);
    }
    processJsBridge(w3) {
        LogUtils.d('H5Page', "processJsBridge " + w3);
        let x3 = getQueryMap(w3);
        if (w3.startsWith(V2_FUNCTION_CALLNATIVE)) {
            this.processJsBridgeInner(x3.get("func") ?? "", x3.get("cbId") ?? "", x3.get("data") ?? "");
        }
    }
    processJsBridgeInner(t3, u3, v3) {
        LogUtils.d('H5Page', "processJsBridgeInner " + t3 + " " + u3 + " " + v3);
        switch (t3) {
            case V2_FUNCTION_CAN_USE_TAO_LOGIN:
                break;
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName() {
        return "AlipayH5Page";
    }
}
{
    let r3 = 'alipay/sdk/pages/h5page/index';
    registerNamedRoute(() => new AlipayH5Page(undefined, {}), r3, { bundleName: "__harDefaultBundleName__", moduleName: "__harDefaultModuleName__", pagePath: "", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__" });
}
(function () {
    if (typeof NavigationBuilderRegister === "function") {
        NavigationBuilderRegister("alipay/cashier/H5Page", wrapBuilder(AlipayH5PageBuilder));
    }
})();
