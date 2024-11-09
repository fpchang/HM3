export class JsonUtils {
    static parseJsonToInstance(d34, e34) {
        let f34;
        if (typeof d34 === "string") {
            f34 = JSON.parse(d34);
        }
        else {
            f34 = d34;
        }
        const g34 = new e34();
        Object.assign(g34, f34);
        return g34;
    }
}
