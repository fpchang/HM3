import { isRepeatedPay } from '../utils/DebounceUtil';
import { Result, ResultStatus } from './Result';
import { BizContext } from '../context/BizContext';
import { Loading } from '../components/Loading';
import { elapsedRealtime, isEmpty } from '../utils/Utils';
import { PayNetwork } from '../network/PayNetwork';
import { ElementAction } from '../protocol/ElementAction';
import { ActionType } from '../protocol/ActionType';
import { TidStorage } from '../tid/TidStorage';
import router from "@ohos.router";
import { GlobalConstants } from '../const/GlobalConstants';
import { LogUtils } from '../utils/LogUtils';
import { StatisticManager } from '../statistic/StatisticManager';
import { StatisticRecord } from '../statistic/StatisticRecord';
import json from '@ohos.util.json';
import('../components/h5page/AlipayH5Page');
export class Pay {
    constructor() {
        this.showLoading = false;
        this.context = getContext();
    }
    async pay(h3, i3 = false) {
        return this.payWithNav(h3, i3, undefined, undefined);
    }
    async payWithNav(y2, z2 = false, a3, b3 = undefined) {
        this.navCallback = a3;
        this.showLoading = z2;
        this.navPathStack = b3;
        return await new Promise(async (d3, e3) => {
            if (isRepeatedPay()) {
                d3(Result.getDoubleRequest());
                return;
            }
            let f3 = await BizContext.createInstance(this.context, y2, "payV2");
            let g3 = await this.innerPay(f3, y2, z2);
            d3(g3);
        });
    }
    async innerPay(t2, u2, v2) {
        if (v2) {
            await this.showPayLoading();
        }
        if (u2.includes(GlobalConstants.FROM_12306_FLAG)) {
            GlobalConstants.isFrom12306 = true;
        }
        if (GlobalConstants.isFrom12306) {
            if (u2.startsWith(GlobalConstants.ONLINE_ORDER_FLAG_1)) {
                u2 = u2.substring(u2.indexOf(GlobalConstants.ONLINE_ORDER_FLAG_1)
                    + GlobalConstants.ONLINE_ORDER_FLAG_1.length);
            }
            else if (u2.startsWith(GlobalConstants.ONLINE_ORDER_FLAG_2)) {
                u2 = u2.substring(u2.indexOf(GlobalConstants.ONLINE_ORDER_FLAG_2)
                    + GlobalConstants.ONLINE_ORDER_FLAG_2.length);
            }
        }
        let w2 = new Map();
        try {
            LogUtils.i(GlobalConstants.GENERAL_TAG, "pay prepared: " + u2);
            w2 = await this.payResult(t2, u2);
            LogUtils.i(GlobalConstants.GENERAL_TAG, "pay raw result: " +
                `resultStatus: ${w2.get('resultStatus')} memo: ${w2.get('memo')} result: ${w2.get('result')}`);
        }
        catch (x2) {
            LogUtils.printExceptionStackTrace(x2);
            w2 = Result.getCancel();
        }
        finally {
            StatisticManager.putAction(t2, StatisticRecord.ET_BIZ, 'fin', `${elapsedRealtime()}`);
            StatisticManager.putAction(t2, StatisticRecord.ET_BIZ, 'returnV', w2.get('resultStatus') + "|" + w2.get('memo'));
            StatisticManager.submit(t2, u2, t2.apLinkToken ?? '');
        }
        await this.hidePayLoading();
        return w2;
    }
    async payResult(q2, r2) {
        let s2 = new Map();
        r2 = q2.format(r2);
        if (r2.includes('paymethod=expressGateway')) {
            await this.hidePayLoading();
            s2 = await this.requestH5Pay(q2, r2);
            return s2;
        }
        s2 = await this.openAlipay(q2, r2);
        return s2;
    }
    async openAlipay(z1, a2) {
        let b2 = z1.getSafeContext();
        let c2 = {
            deviceId: '',
            bundleName: 'com.alipay.mobile.client',
            abilityName: 'EntryAbility',
            uri: 'alipays/cashier/standard/pay',
            parameters: {
                orderInfo: a2,
            }
        };
        await this.hidePayLoading();
        return new Promise(async (e2, f2) => {
            StatisticManager.stash(z1, a2, z1.apLinkToken ?? '');
            b2.startAbilityForResult(c2).then((k2) => {
                if (!k2.want?.parameters) {
                    LogUtils.i(GlobalConstants.GENERAL_TAG, "pay raw result: data.want?.parameters == null " + `resultStatus: ${ResultStatus.FAILED} memo: ${""} result: ${""}`);
                    StatisticManager.putAction(z1, StatisticRecord.ET_BIZ, 'AliReturn', "wantNull");
                    e2(Result.parseResult(ResultStatus.FAILED));
                    return;
                }
                if (k2.resultCode != 20000125) {
                    LogUtils.i(GlobalConstants.GENERAL_TAG, "pay raw result: data.resultCode != 20000125 " + `resultStatus: ${ResultStatus.FAILED} memo: ${""} result: ${""}`);
                    StatisticManager.putAction(z1, StatisticRecord.ET_BIZ, 'AliReturn', "codeErr");
                    e2(Result.parseResult(ResultStatus.FAILED));
                    return;
                }
                let l2 = k2.want?.parameters;
                let m2 = l2.resultCode ?? "";
                let n2 = l2.memo ?? "";
                let o2 = l2.result ?? "";
                let p2 = Result.parseResultV1(m2, n2, o2);
                e2(p2);
            }).catch(async (i2) => {
                LogUtils.printExceptionStackTrace(i2);
                StatisticManager.putErrorWithRes(z1, StatisticRecord.ET_BIZ, 'AliReturn', undefined, `openErr|${i2.code}`);
                let j2 = await this.requestH5Pay(z1, a2);
                e2(j2);
                return;
            });
        });
    }
    async requestH5Pay(j1, k1) {
        return new Promise(async (m1, n1) => {
            if (this.showLoading) {
                await this.showPayLoading();
            }
            try {
                let p1 = null;
                if (!this.context) {
                    this.context = getContext();
                    if (!this.context) {
                        LogUtils.i(GlobalConstants.GENERAL_TAG, "h5pay prepared failed, context is null");
                        StatisticManager.putErrorWithRes(j1, StatisticRecord.ET_BIZ, 'H5Return', undefined, "contextNull");
                        let y1 = ResultStatus.FAILED;
                        m1(Result.parseResult(y1));
                    }
                    j1.context = this.context;
                }
                let q1 = await new PayNetwork().request(j1, k1);
                LogUtils.i(GlobalConstants.GENERAL_TAG, "letter result: " + ` letter: ${json.stringify(q1?.getTemplate())}`);
                if (q1 == null) {
                    p1 = ResultStatus.NETWORK_ERROR;
                    LogUtils.i(GlobalConstants.GENERAL_TAG, "pay raw result: letter == null " + `resultStatus: ${p1} memo: ${""} result: ${""}`);
                    StatisticManager.putErrorWithRes(j1, StatisticRecord.ET_BIZ, 'H5Return', undefined, "LetterNull");
                    m1(Result.parseResult(p1));
                    return;
                }
                let r1 = q1.getTemplate();
                let s1 = r1.end_code;
                let t1 = r1.form;
                let u1 = t1?.onload;
                let v1 = ElementAction.parse(u1);
                for (let x1 = 0; x1 < v1.length; x1++) {
                    if (v1[x1].actionType == ActionType.Update) {
                        ElementAction.update(j1, v1[x1]);
                    }
                }
                this.updateTid(j1, r1);
                await this.hidePayLoading();
                StatisticManager.stash(j1, k1, j1.apLinkToken ?? '');
                for (let w1 = 0; w1 < v1.length; w1++) {
                    if (v1[w1].actionType == ActionType.WapPay) {
                        LogUtils.i(GlobalConstants.GENERAL_TAG, "ElementAction to process h5 pay. js://wappay");
                        StatisticManager.putAction(j1, StatisticRecord.ET_BIZ, 'H5Return', "wappay");
                        m1(await this.processH5Pay(j1, v1[w1]));
                    }
                    else if (v1[w1].actionType == ActionType.OpenWeb) {
                        LogUtils.i(GlobalConstants.GENERAL_TAG, "ElementAction to process h5 pay. js://openweb but not implemented");
                        StatisticManager.putAction(j1, StatisticRecord.ET_BIZ, 'H5Return', "openweb");
                        m1(Result.parseResult(ResultStatus.FAILED));
                    }
                }
                LogUtils.i(GlobalConstants.GENERAL_TAG, "no action");
                StatisticManager.putAction(j1, StatisticRecord.ET_BIZ, 'H5Return', "actionN");
                m1(Result.parseResult(ResultStatus.FAILED));
            }
            catch (o1) {
                LogUtils.printExceptionStackTrace(o1);
                StatisticManager.putError(j1, StatisticRecord.ET_BIZ, 'H5Return', o1);
                m1(Result.getCancel());
            }
        });
    }
    async processH5Pay(s, t) {
        return new Promise((v, w) => {
            let x = t.params;
            let y = {
                url: x[0],
                method: '',
                cookie: '',
                title: '',
                isBackExit: false,
                containerVersion: 'v1',
                navPathStack: this.navPathStack
            };
            let z = s.getSafeContext();
            z.eventHub.on("payResult", (h1) => {
                let i1 = `resultStatus: ${h1.get('resultStatus')} memo: ${h1.get('memo')} result: ${h1.get('result')}`;
                LogUtils.i(GlobalConstants.GENERAL_TAG, "pay raw result: " + i1);
                StatisticManager.putAction(s, StatisticRecord.ET_BIZ, 'H5Return', `${h1.get('resultStatus')}`);
                this.context.eventHub.off("payResult");
                v(h1);
            });
            try {
                if (this.navCallback) {
                    let g1 = new Map();
                    g1.set("params", y);
                    this.navCallback("alipay/cashier/H5Page", g1);
                }
                else if (this.navPathStack) {
                    let c1 = new Map();
                    c1.set("params", y);
                    this.navPathStack.pushDestinationByName('alipay/cashier/H5Page', c1).then(() => {
                        LogUtils.i(GlobalConstants.GENERAL_TAG, "pushNamedRoute " + `Success to push destination by name. ALIPAY_SDK_H5Page`);
                    }).catch((f1) => {
                        LogUtils.i(GlobalConstants.GENERAL_TAG, "pushNamedRoute " +
                            `Failed to push destination by name. ALIPAY_SDK_H5Page. Code is ${f1.code}, message is ${f1.message}`);
                        y.navPathStack = undefined;
                        this.router(y, s, v);
                    });
                }
                else {
                    this.router(y, s, v);
                }
            }
            catch (b1) {
                LogUtils.i(GlobalConstants.GENERAL_TAG, "processH5Pay " + `Failed to process h5 pay. Code is ${b1.code}, message is ${b1.message}`);
                StatisticManager.putErrorWithRes(s, StatisticRecord.ET_BIZ, 'H5Return', b1, `RouteES|${b1.code}`);
                v(Result.parseResult(ResultStatus.FAILED));
            }
        });
    }
    router(n, o, p) {
        router.pushNamedRoute({
            name: 'alipay/sdk/pages/h5page/index',
            params: n
        }).catch((r) => {
            LogUtils.i(GlobalConstants.GENERAL_TAG, "pushNamedRoute " +
                `Failed to push named route. Code is ${r.code}, message is ${r.message}`);
            StatisticManager.putErrorWithRes(o, StatisticRecord.ET_BIZ, 'H5Return', r, `RouteE|${r.code}`);
            p(Result.parseResult(ResultStatus.FAILED));
        });
    }
    updateTid(h, i) {
        try {
            let k = i.tid ?? "";
            let l = i.client_key ?? "";
            if (!isEmpty(k) && !isEmpty(l)) {
                let m = TidStorage.getInstance(h);
                m.save(h, k, l);
            }
        }
        catch (j) {
            LogUtils.e(GlobalConstants.GENERAL_TAG, "updateTid " + `Failed to update tid. Code is ${j.code}, message is ${j.message}`);
            StatisticManager.putErrorWithRes(h, StatisticRecord.ET_BIZ, 'TID', j, 'upE');
        }
    }
    showPayLoading() {
        if (this.loading && this.loading.loadingWindow?.isWindowShowing()) {
            return Promise.resolve();
        }
        this.loading = new Loading();
        return this.loading.show();
    }
    hidePayLoading() {
        return new Promise((c, d) => {
            if (this.loading == undefined) {
                c();
                return;
            }
            this.loading.hide().then(() => {
                this.loading = undefined;
                c();
            }).catch((g) => {
                c();
            });
        });
    }
}
