export class EnvelopeCryptoParams {
    constructor() {
        this.masterAlgo = -1;
        this.sessionAlgo = -1;
        this.masterKey = null;
        this.sessionKey = null;
        this.sessionIV = null;
    }
}
export class EnvelopeCryptoResult {
    constructor() {
        this.sessionKey = null;
        this.sessionIV = null;
        this.cryptoData = null;
        this.errorCode = 0;
    }
}
