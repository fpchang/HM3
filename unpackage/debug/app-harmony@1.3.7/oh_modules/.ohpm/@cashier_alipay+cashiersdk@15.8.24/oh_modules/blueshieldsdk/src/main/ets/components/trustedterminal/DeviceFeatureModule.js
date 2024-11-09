import { ScpInvokeNative } from 'libblueshield.so';
export class DeviceFeatureModule {
    getDeviceFeature() {
        let n11 = ScpInvokeNative(0xd6e0062f);
        return n11;
    }
}
