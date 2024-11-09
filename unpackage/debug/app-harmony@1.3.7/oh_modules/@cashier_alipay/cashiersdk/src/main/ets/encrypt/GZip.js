import { gzip, ungzip } from 'pako';
export class GZip {
    static toGzip(f16) {
        return gzip(f16) ?? new Uint8Array();
    }
    static unGzip(e16) {
        return ungzip(e16);
    }
}
