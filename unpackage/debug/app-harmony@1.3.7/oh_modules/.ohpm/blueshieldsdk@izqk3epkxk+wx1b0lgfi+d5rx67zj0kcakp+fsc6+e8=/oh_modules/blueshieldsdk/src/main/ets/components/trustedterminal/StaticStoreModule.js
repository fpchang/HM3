import { ScpInvokeNative } from 'libblueshield.so';
export class StaticStoreModule {
    getCustomData(h16, i16) {
        let j16 = ScpInvokeNative(0xc8e1e72a, h16, i16);
        return j16;
    }
}
