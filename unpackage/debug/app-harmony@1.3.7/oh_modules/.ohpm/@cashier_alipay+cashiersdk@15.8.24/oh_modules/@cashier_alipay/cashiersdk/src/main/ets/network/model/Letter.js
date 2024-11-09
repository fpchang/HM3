import { isEmpty } from '../../utils/Utils';
export class Letter {
    constructor(q17, r17) {
        this.envelop = q17;
        this.body = r17;
    }
    getEnvelop() {
        return this.envelop;
    }
    getBody() {
        return this.body;
    }
    getTemplate() {
        if (isEmpty(this.body)) {
            return {};
        }
        let o17 = {};
        try {
            o17 = JSON.parse(this.body);
        }
        catch (p17) {
            console.log(p17);
        }
        return o17;
    }
}
