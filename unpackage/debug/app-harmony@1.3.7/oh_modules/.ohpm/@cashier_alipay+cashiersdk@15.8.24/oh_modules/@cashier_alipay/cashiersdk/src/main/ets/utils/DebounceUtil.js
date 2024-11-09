const MIN_DELAY_TIME = 3000;
let lastClickTime = 0;
export function isRepeatedPay() {
    let b31 = new Date().getTime();
    if (b31 - lastClickTime < MIN_DELAY_TIME) {
        return true;
    }
    lastClickTime = b31;
    return false;
}
