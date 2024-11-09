export interface RegisterReflectionFuncModel {
    name: string;
    func: Function;
}
export const setAppContext: (ctx: Object) => boolean;
export const setMainEnv: () => boolean;
export const getBlueShieldMangerInstance: () => number;
export const initBlueShieldManger: (pointer: number, authName?: string, extConfig?: Map<string, string>) => number;
export const ScpInvokeNative: (proto: number, ...args: Object[]) => Object;
export const nativeRegisterReflectionFunc: (funcList: RegisterReflectionFuncModel[]) => number;
export const registerRpcInterceptor: () => number;
