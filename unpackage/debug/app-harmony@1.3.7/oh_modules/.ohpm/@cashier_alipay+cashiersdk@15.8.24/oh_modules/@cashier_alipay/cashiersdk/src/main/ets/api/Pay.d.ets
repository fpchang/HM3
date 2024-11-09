import { Context } from '@kit.AbilityKit';
import { Loading } from '../components/Loading';
export declare class Pay {
    context: Context;
    showLoading: boolean;
    loading?: Loading;
    navPathStack?: NavPathStack;
    navCallback?: (name: string, params: Map<string, Object>) => void;
    constructor();
    /**
     *
     * @param orderInfo
     * @param showPayLoading 为 true时需要传入对应的component
     * @returns
     */
    pay(t45: string, u45?: boolean): Promise<Map<string, string>>;
    /**
     *
     * @param orderInfo
     * @param showPayLoading
     * @param navCallback 商户传入自定义的nav跳转，由商户控制H5跳转
     * @param navPathStack 商户自定义跳转时的navPath，以及使用系统路由表的navPath
     * @returns
     */
    payWithNav(p45: string, q45?: boolean, r45?: (name: string, params: Map<string, Object>) => void, s45?: NavPathStack | undefined): Promise<Map<string, string>>;
    private innerPay;
    private payResult;
    private openAlipay;
    private requestH5Pay;
    private processH5Pay;
    private router;
    private updateTid;
    private showPayLoading;
    private hidePayLoading;
}
