export class Result {
    static getParamsError() {
        return Result.parseResult(ResultStatus.PARAMS_ERROR);
    }
    static getCancel() {
        return Result.parseResult(ResultStatus.CANCELED);
    }
    static getDoubleRequest() {
        return Result.parseResult(ResultStatus.DOUBLE_REQUEST);
    }
    static parseResult(p3, q3 = "") {
        return new Map().set("resultStatus", p3.status.toString())
            .set("memo", p3.memo)
            .set("result", q3);
    }
    static parseResultV1(m3, n3, o3) {
        return new Map().set("resultStatus", m3.toString())
            .set("memo", n3)
            .set("result", o3);
    }
}
export class ResultStatus {
    constructor(k3, l3) {
        this.status = k3;
        this.memo = l3;
    }
    toString() {
        return this.status.toString() + ":" + this.memo;
    }
    static getResultStatus(j3) {
        switch (j3) {
            case 9000:
                return ResultStatus.SUCCEEDED;
            case 4000:
                return ResultStatus.FAILED;
            case 6001:
                return ResultStatus.CANCELED;
            case 6002:
                return ResultStatus.NETWORK_ERROR;
            case 6007:
                return ResultStatus.ACTIVITY_NOT_START_EXIT;
            case 4001:
                return ResultStatus.PARAMS_ERROR;
            case 5000:
                return ResultStatus.DOUBLE_REQUEST;
            case 8000:
                return ResultStatus.PAY_WAITTING;
        }
        return ResultStatus.FAILED;
    }
}
ResultStatus.SUCCEEDED = new ResultStatus(9000, "处理成功");
ResultStatus.FAILED = new ResultStatus(4000, "系统繁忙，请稍后再试");
ResultStatus.CANCELED = new ResultStatus(6001, "用户取消");
ResultStatus.NETWORK_ERROR = new ResultStatus(6002, "网络连接异常");
ResultStatus.ACTIVITY_NOT_START_EXIT = new ResultStatus(6007, "支付未完成");
ResultStatus.PARAMS_ERROR = new ResultStatus(4001, "参数错误");
ResultStatus.DOUBLE_REQUEST = new ResultStatus(5000, "重复请求");
ResultStatus.PAY_WAITTING = new ResultStatus(8000, "支付结果确认中");
