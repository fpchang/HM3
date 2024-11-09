export class BASE64Helper {
    constructor() {
        this.BASELENGTH = 128;
        this.LOOKUPLENGTH = 64;
        this.base64Alphabet = new Uint8Array(this.BASELENGTH);
        this.lookUpBase64Alphabet = new Uint8Array(this.LOOKUPLENGTH);
        for (let a31 = 0; a31 < this.BASELENGTH; a31++) {
            this.base64Alphabet[a31] = -1;
        }
        for (let z30 = 'Z'.charCodeAt(0); z30 >= 'A'.charCodeAt(0); z30--) {
            this.base64Alphabet[z30] = z30 - 'A'.charCodeAt(0);
        }
        for (let y30 = 'z'.charCodeAt(0); y30 >= 'a'.charCodeAt(0); y30--) {
            this.base64Alphabet[y30] = y30 - 'a'.charCodeAt(0) + 26;
        }
        for (let x30 = '9'.charCodeAt(0); x30 >= '0'.charCodeAt(0); x30--) {
            this.base64Alphabet[x30] = x30 - '0'.charCodeAt(0) + 52;
        }
        this.base64Alphabet['+'.charCodeAt(0)] = 62;
        this.base64Alphabet['/'.charCodeAt(0)] = 63;
        for (let w30 = 0; w30 <= 25; w30++) {
            this.lookUpBase64Alphabet[w30] = 'A'.charCodeAt(0) + w30;
        }
        for (let u30 = 26, v30 = 0; u30 <= 51; u30++, v30++) {
            this.lookUpBase64Alphabet[u30] = 'a'.charCodeAt(0) + v30;
        }
        for (let s30 = 52, t30 = 0; s30 <= 61; s30++, t30++) {
            this.lookUpBase64Alphabet[s30] = '0'.charCodeAt(0) + t30;
        }
        this.lookUpBase64Alphabet[62] = '+'.charCodeAt(0);
        this.lookUpBase64Alphabet[63] = '/'.charCodeAt(0);
    }
    decode(z29) {
        if (z29 == null)
            return null;
        let a30 = new Uint8Array(z29.length);
        for (let r30 = 0; r30 < z29.length; r30++) {
            a30[r30] = z29.charCodeAt(r30);
        }
        let b30 = this.removeWhiteSpace(a30);
        if (b30 % 4 != 0) {
            return null;
        }
        let c30 = (b30 / 4);
        if (c30 == 0) {
            return null;
        }
        let d30 = new Uint8Array(c30 * 3);
        let e30 = 0;
        let f30 = 0;
        let g30 = 0;
        let h30 = 0, i30 = 0, j30 = 0, k30 = 0;
        let l30 = 0, m30 = 0, n30 = 0, o30 = 0;
        for (; e30 < c30 - 1; e30++) {
            if (!this.isData((l30 = a30[g30++]))
                || !this.isData((m30 = a30[g30++]))
                || !this.isData((n30 = a30[g30++]))
                || !this.isData((o30 = a30[g30++]))) {
                return null;
            }
            h30 = this.base64Alphabet[l30];
            i30 = this.base64Alphabet[m30];
            j30 = this.base64Alphabet[n30];
            k30 = this.base64Alphabet[o30];
            d30[f30++] = (h30 << 2 | i30 >> 4);
            d30[f30++] = (((i30 & 0xf) << 4) | ((j30 >> 2) & 0xf));
            d30[f30++] = (j30 << 6 | k30);
        }
        if (!this.isData((l30 = a30[g30++]))
            || !this.isData((m30 = a30[g30++]))) {
            return null;
        }
        h30 = this.base64Alphabet[l30];
        i30 = this.base64Alphabet[m30];
        n30 = a30[g30++];
        o30 = a30[g30++];
        if (!this.isData((n30)) || !this.isData((o30))) {
            if (this.isPad(n30) && this.isPad(o30)) {
                if ((i30 & 0xf) != 0) {
                    return null;
                }
                let q30 = new Uint8Array(e30 * 3 + 1);
                this.arrayCopy(d30, 0, q30, 0, e30 * 3);
                q30[f30] = (h30 << 2 | i30 >> 4);
                return q30;
            }
            else if (!this.isPad(n30) && this.isPad(o30)) {
                j30 = this.base64Alphabet[n30];
                if ((j30 & 0x3) != 0) {
                    return null;
                }
                let p30 = new Uint8Array(e30 * 3 + 2);
                this.arrayCopy(d30, 0, p30, 0, e30 * 3);
                p30[f30++] = (h30 << 2 | i30 >> 4);
                p30[f30] = (((i30 & 0xf) << 4) | ((j30 >> 2) & 0xf));
                return p30;
            }
            else {
                return null;
            }
        }
        else {
            j30 = this.base64Alphabet[n30];
            k30 = this.base64Alphabet[o30];
            d30[f30++] = (h30 << 2 | i30 >> 4);
            d30[f30++] = (((i30 & 0xf) << 4) | ((j30 >> 2) & 0xf));
            d30[f30++] = (j30 << 6 | k30);
        }
        return d30;
    }
    removeWhiteSpace(v29) {
        if (v29 == null)
            return 0;
        let w29 = 0;
        let x29 = v29.length;
        for (let y29 = 0; y29 < x29; y29++) {
            if (!this.isWhiteSpace(v29[y29])) {
                v29[w29++] = v29[y29];
            }
        }
        return w29;
    }
    arrayCopy(p29, q29, r29, s29, t29) {
        for (let u29 = 0; u29 < t29; u29++) {
            r29[s29 + u29] = p29[q29 + u29];
        }
    }
    isData(o29) {
        return (o29 < this.BASELENGTH && this.base64Alphabet[o29] != -1);
    }
    isPad(n29) {
        return (n29 == '='.charCodeAt(0));
    }
    isWhiteSpace(m29) {
        return (m29 == 0x20 || m29 == 0xd || m29 == 0xa || m29 == 0x9);
    }
}
