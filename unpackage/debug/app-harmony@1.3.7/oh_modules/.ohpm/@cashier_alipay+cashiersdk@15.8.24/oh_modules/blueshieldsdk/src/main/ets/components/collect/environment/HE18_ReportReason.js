import { CollectBase } from '../CollectBase';
class ReportReason extends CollectBase {
    constructor() {
        super();
        this.name = 'HE18';
    }
    doCollect(u5) {
        return (u5 && u5.reportReason) ? u5.reportReason : null;
    }
}
export default new ReportReason();
