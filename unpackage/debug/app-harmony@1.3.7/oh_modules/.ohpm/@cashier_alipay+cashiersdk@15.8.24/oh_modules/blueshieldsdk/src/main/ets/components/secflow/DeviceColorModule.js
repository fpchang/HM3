import { ScpInvokeNative } from 'libblueshield.so';
import { DEVICE_COLOR_CONSTANTS } from './IDeviceColorModule';
import util from "@ohos.util";
export class DeviceColorModule {
    getColorLabel(o10, p10) {
        let q10 = "";
        let r10 = 0;
        let s10 = "";
        q10 = ScpInvokeNative(0xb48ab48e, r10, s10, o10);
        return q10;
    }
    initColorInfo() {
        let j10 = -1;
        let k10 = "";
        let l10 = 0;
        let m10 = 0;
        try {
            k10 = ScpInvokeNative(0x17fad170, m10);
        }
        catch (n10) {
        }
        if (k10 != null && k10.length > 0) {
            j10 = 1;
        }
        return j10;
    }
    getColorInfo(x9, y9, z9) {
        let a10 = "";
        let b10;
        let c10;
        let d10;
        if (z9 != null && z9.size > 0) {
            b10 = z9.get(DEVICE_COLOR_CONSTANTS.EDGE_TRACE_KEY);
            c10 = z9.get(DEVICE_COLOR_CONSTANTS.EDGE_APPID_KEY);
            d10 = z9.get(DEVICE_COLOR_CONSTANTS.EDGE_MODE_KEY);
            z9.delete(DEVICE_COLOR_CONSTANTS.EDGE_TRACE_KEY);
            z9.delete(DEVICE_COLOR_CONSTANTS.EDGE_APPID_KEY);
            z9.delete(DEVICE_COLOR_CONSTANTS.EDGE_MODE_KEY);
        }
        let e10 = "1" == d10 ? 1 : 0;
        let f10 = 0;
        let g10 = "";
        try {
            let i10 = new util.TextEncoder().encodeInto(y9);
            a10 = ScpInvokeNative(0xe90cca92, f10, g10, x9, i10, e10);
        }
        catch (h10) {
        }
        return a10;
    }
}
