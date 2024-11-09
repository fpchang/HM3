import { ScpInvokeNative } from 'libblueshield.so';
export class SafeOtpModule {
    getOtpSHA1(x13, y13, z13) {
        let a14 = '';
        let b14 = ScpInvokeNative(0x8e80ce0c);
        if (b14 != 0) {
            return a14;
        }
        a14 = ScpInvokeNative(0xed28b16b, x13, y13, z13);
        return a14;
    }
    getOtpSM3(r13, s13, t13, u13) {
        let v13 = '';
        let w13 = ScpInvokeNative(0x8e80ce0c);
        if (w13 != 0) {
            return v13;
        }
        v13 = ScpInvokeNative(0x965cbf31, r13, s13, t13, u13);
        return v13;
    }
    getOtpCommon(j13, k13, l13, m13, n13, o13) {
        let p13 = '';
        let q13 = ScpInvokeNative(0x8e80ce0c);
        if (q13 != 0) {
            return p13;
        }
        p13 = ScpInvokeNative(0xa2431e15, j13, k13, l13, m13, n13, o13);
        return p13;
    }
}
