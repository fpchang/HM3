export class CollectBase {
    constructor() {
        this.name = '';
        this.timeout = 5000;
    }
    promiseWithTimeout(z2, a3) {
        const b3 = new Promise((d3) => {
            setTimeout(() => {
                let f3 = {};
                f3[this.name] = null;
                d3(f3);
            }, a3);
        });
        return Promise.race([z2, b3]);
    }
    getCollectName() {
        return this.name;
    }
    getResult(h2) {
        const i2 = new Promise((l2, m2) => {
            const n2 = new Date().getTime();
            const o2 = (w2) => {
                const x2 = new Date().getTime();
                let y2 = {};
                y2[this.name] = w2;
                l2(y2);
            };
            const p2 = (u2) => {
                let v2 = {};
                v2[this.name] = '';
                l2(v2);
            };
            try {
                const t2 = this.doCollect(h2);
                if (t2 instanceof Promise) {
                    t2.then(o2).catch(p2);
                }
                else {
                    o2(t2);
                }
            }
            catch (s2) {
                p2(s2);
            }
        });
        const j2 = this.timeout && this.timeout > 0 ? this.timeout : 5000;
        return this.promiseWithTimeout(i2, j2);
    }
}
