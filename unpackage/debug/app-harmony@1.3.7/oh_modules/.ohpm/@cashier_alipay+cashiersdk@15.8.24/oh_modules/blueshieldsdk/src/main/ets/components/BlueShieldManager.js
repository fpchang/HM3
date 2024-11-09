import { PreferencesUtil } from './common/PreferencesUtil';
import GlobalContext from './common/GlobalContext';
import { StaticStoreModule } from './trustedterminal/StaticStoreModule';
import { StaticCryptoModule } from './trustedterminal/StaticCryptoModule';
import { DynamicCryptoModule } from './trustedterminal/DynamicCryptoModule';
import { EnvelopeCryptoModule } from './trustedterminal/EnvelopeCryptoModule';
import { SafeOtpModule } from './trustedterminal/SafeOtpModule';
import { SafeSignatureModule } from './trustedterminal/SafeSignatureModule';
import { DeviceFeatureModule } from './trustedterminal/DeviceFeatureModule';
import { TrustedSignatureModule } from './trustedterminal/TrustedSignatureModule';
import { APDIDModule } from './apdid/APDIDModule';
import { APDIDNetworkUtil } from './apdid/network/APDIDNetworkUtil';
import { generateStaticDataHash, collectAllData, collectAtomicData } from './collect/Index';
import { RDSModule } from './secflow/RDSModule';
import { DeviceColorModule } from './secflow/DeviceColorModule';
import { CaptchaVerifyModule } from './secflow/captcha/CaptchaVerifyModule';
import { CaptchaViewManager } from './secflow/captcha/CaptchaViewManager';
import { EdgeRiskModule } from './edge/EdgeRiskModule';
import { EdgeNetworkUtil } from './edge/network/EdgeNetworkUtil';
import { setAppContext, setMainEnv, getBlueShieldMangerInstance, initBlueShieldManger, nativeRegisterReflectionFunc, registerRpcInterceptor } from 'libblueshield.so';
import { CDNDownloader } from './common/CDNDownloader';
export class BlueShieldManager {
    constructor(a2) {
        this.manager = a2;
    }
    static setContext(z1) {
        GlobalContext.setContext(z1);
        return setAppContext(z1);
    }
    static setMainEnv() {
        return setMainEnv();
    }
    static getInstance() {
        let y1 = getBlueShieldMangerInstance();
        return new BlueShieldManager(y1);
    }
    initialize(u1, v1) {
        let w1 = 0;
        do {
            w1 = initBlueShieldManger(this.manager, u1, v1);
            if (0 !== w1) {
                break;
            }
            const x1 = [
                { name: "PreferencesUtil_Read", func: PreferencesUtil.read },
                { name: "PreferencesUtil_Save", func: PreferencesUtil.save },
                { name: "Collect_StaticDataHash", func: generateStaticDataHash },
                { name: "Collect_AllData", func: collectAllData },
                { name: "Collect_AtomicData", func: collectAtomicData },
                { name: "APDIDNetworkUtil_ExecuteRPC", func: APDIDNetworkUtil.executeRPC },
                { name: "EdgeNetworkUtil_ExecuteUpdateRPC", func: EdgeNetworkUtil.executeUpdateRPC },
                { name: "CDNDownloader_Download", func: CDNDownloader.download },
                { name: "CaptchaViewManager_Show", func: CaptchaViewManager.show },
            ];
            w1 = nativeRegisterReflectionFunc(x1);
        } while (false);
        w1 = registerRpcInterceptor();
        return w1;
    }
    getModule(t1) {
        switch (t1) {
            case 0:
                return new StaticStoreModule();
            case 1:
                return new StaticCryptoModule();
            case 2:
                return new EnvelopeCryptoModule();
            case 3:
                return new DynamicCryptoModule();
            case 4:
                return new SafeSignatureModule();
            case 5:
                return new SafeOtpModule();
            case 6:
                return new TrustedSignatureModule();
            case 7:
                break;
            case 8:
                return new DeviceFeatureModule();
            case 16:
                return new APDIDModule();
            case 32:
                return new RDSModule();
            case 33:
                return new DeviceColorModule();
            case 34:
                return new CaptchaVerifyModule();
            case 48:
                return new EdgeRiskModule();
            default:
                break;
        }
        return null;
    }
}
