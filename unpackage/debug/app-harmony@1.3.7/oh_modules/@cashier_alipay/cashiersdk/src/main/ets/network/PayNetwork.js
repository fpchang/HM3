import { NetworkTask } from './NetworkTask';
export class PayNetwork extends NetworkTask {
    buildAction() {
        return NetworkTask.buildAction("cashier", 'main');
    }
    isWifiMocked() {
        return false;
    }
    getName() {
        return 'pay';
    }
    needStatic() {
        return true;
    }
}
