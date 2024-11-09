import { TidStorage } from '../tid/TidStorage';
import bundleManager from "@ohos.bundle.bundleManager";
import { isEmpty } from '../utils/Utils';
import deviceInfo from "@ohos.deviceInfo";
import I18n from '@ohos.i18n';
import display from "@ohos.display";
import { DeviceInfo } from '../utils/DeviceInfo';
import { GlobalContext } from '../sys/GlobalContext';
import { GlobalConstants } from '../const/GlobalConstants';
import BuildProfile from '../../../../BuildProfile';
import dataPreferences from '@ohos.data.preferences';
import { ApdIdManager } from '../security/ApdIdManager';
import connection from "@ohos.net.connection";
import { LogUtils } from '../utils/LogUtils';
export class MspConfig {
    constructor() {
        this.mKernelVersion = 'sdk-and-lite';
    }
    static getInstance() {
        if (!MspConfig.instance) {
            MspConfig.instance = new MspConfig();
        }
        return MspConfig.instance;
    }
    getUserAgent(f13, g13, h13) {
        if (isEmpty(this.mUserAgent)) {
            let y13 = "Msp/" + BuildProfile.HAR_VERSION;
            let z13 = deviceInfo.distributionOSName + " " + deviceInfo.distributionOSVersion;
            let a14 = "";
            let b14 = I18n.System.getSystemLocale();
            let c14 = 'https';
            let d14 = display.getDefaultDisplaySync().width + '*' + display.getDefaultDisplaySync().height;
            let e14 = '39';
            this.mUserAgent = `${y13} (${z13};${a14};${b14};${c14};${d14};${e14}`;
        }
        let i13 = this.getNetworkTypeSync();
        let j13 = "-1;-1";
        let k13 = '1';
        let l13 = DeviceInfo.getIMSI();
        let m13 = DeviceInfo.getIMEI();
        let n13 = this.getVirtualImsi(f13);
        let o13 = this.getVirtualImei(f13);
        if (g13 != null) {
            this.mClientKey = g13.getClientKey();
        }
        let p13 = deviceInfo.manufacture.replace(";", " ");
        let q13 = deviceInfo.productModel.replace(";", " ");
        let r13 = DeviceInfo.getMacAddress();
        let s13 = '-1';
        let t13 = '00';
        let u13 = 'false';
        let v13 = "-1;-1";
        let w13 = '';
        w13 += `${this.mUserAgent};`;
        w13 += `${i13};`;
        w13 += `${j13};`;
        w13 += `${k13};`;
        w13 += `${l13};`;
        w13 += `${m13};`;
        w13 += `${this.mClientKey};`;
        w13 += `${p13};`;
        w13 += `${q13};`;
        w13 += `${u13};`;
        w13 += `${r13};`;
        w13 += `${v13};`;
        w13 += `${this.mKernelVersion};`;
        w13 += `${n13};`;
        w13 += `${o13};`;
        w13 += `${s13};`;
        w13 += `${t13}`;
        if (g13) {
            let x13 = ApdIdManager.getInstance().getToken();
            if (!isEmpty(x13)) {
                w13 += `;;;${x13}`;
            }
        }
        w13 += ')';
        return w13;
    }
    static getPa(b13) {
        let c13 = b13.applicationInfo.name;
        let d13 = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
        let e13 = d13.versionName;
        return `(${c13};${e13})`;
    }
    getNetworkTypeSync() {
        try {
            let z12 = connection.getNetCapabilitiesSync(connection.getDefaultNetSync()).bearerTypes;
            if (z12.length > 0) {
                let a13 = z12[0];
                if (a13 == connection.NetBearType.BEARER_CELLULAR) {
                    return 'cellular';
                }
                else if (a13 == connection.NetBearType.BEARER_WIFI) {
                    return 'wifi';
                }
                else if (a13 == connection.NetBearType.BEARER_ETHERNET) {
                    return 'ethernet';
                }
                else if (a13 == connection.NetBearType.BEARER_VPN) {
                    return 'vpn';
                }
            }
        }
        catch (y12) {
            LogUtils.eStack("msp", "getNetworkTypeSync", y12);
        }
        return "";
    }
    getVirtualImsi(t12) {
        let u12 = { name: MspConfig.SHARE_PREFERENCE_NAME };
        let v12 = dataPreferences.getPreferencesSync(t12.getSafeContext(), u12);
        let w12 = v12.getSync(MspConfig.PREFERENCE_VIRTUAL_IMSI, '').toString();
        if (isEmpty(w12)) {
            if (isEmpty(TidStorage.getInstance(t12).getTid())) {
                let x12 = GlobalContext.getInstance().getUtdid(t12.getSafeContext());
                if (isEmpty(x12) || x12.length < 18) {
                    w12 = TidStorage.genVirtualCode();
                }
                else {
                    w12 = x12.substring(3, 18);
                }
            }
            else {
                w12 = DeviceInfo.getIMSI();
            }
            v12.putSync(MspConfig.PREFERENCE_VIRTUAL_IMSI, w12);
            v12.flush();
        }
        return w12;
    }
    getVirtualImei(p12) {
        let q12 = { name: MspConfig.SHARE_PREFERENCE_NAME };
        let r12 = dataPreferences.getPreferencesSync(p12.getSafeContext(), q12);
        let s12 = r12.getSync(MspConfig.PREFERENCE_VIRTUAL_IMEI, '').toString();
        if (isEmpty(s12)) {
            if (isEmpty(TidStorage.getInstance(p12).getTid())) {
                s12 = TidStorage.genVirtualCode();
            }
            else {
                s12 = DeviceInfo.getIMEI();
            }
            r12.putSync(MspConfig.PREFERENCE_VIRTUAL_IMEI, s12);
            r12.flush();
        }
        return s12;
    }
    static setRsaPublicKey(o12) {
        if (isEmpty(o12)) {
            return;
        }
        GlobalConstants.RSA_PUBLIC_KEY = o12;
    }
}
MspConfig.SHARE_PREFERENCE_NAME = "virtualImeiAndImsi";
MspConfig.PREFERENCE_VIRTUAL_IMSI = "virtual_imsi";
MspConfig.PREFERENCE_VIRTUAL_IMEI = "virtual_imei";
