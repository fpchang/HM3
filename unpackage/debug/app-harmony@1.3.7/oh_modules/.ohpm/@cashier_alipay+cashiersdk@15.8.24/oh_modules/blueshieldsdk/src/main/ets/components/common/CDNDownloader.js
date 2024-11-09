import http from '@ohos.net.http';
export class CDNDownloader {
    static async download(y6) {
        const z6 = await new Promise((b7, c7) => {
            let d7 = http.createHttp();
            d7.request(y6, {
                method: http.RequestMethod.GET,
                priority: 1,
                connectTimeout: 30000,
                readTimeout: 30000,
            }, (f7, g7) => {
                if (!f7) {
                    let h7 = JSON.stringify(g7.responseCode);
                    let i7 = new Uint8Array(g7.result);
                    b7(i7);
                    d7.destroy();
                }
                else {
                    b7(null);
                    d7.destroy();
                }
            });
        });
        return z6;
    }
}
