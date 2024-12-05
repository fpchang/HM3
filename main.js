import App from './App'
import store from "./store/store";
import {CF} from './static/utils/CF';
import Vuex from "vuex";
import { createSSRApp } from 'vue';
export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  // app.config.globalProperties.$onLaunched = new Promise(resolve => {
  //   app.config.globalProperties.$isResolve = resolve
  // })
  uniCloud.addInterceptor('callFunction', {
    invoke(param) {
      // param为拦截Api的参数 例 {name: 'functionName', data: {'functionParam1': 1, 'functionParam2': 2}}
      // 此处返回错误可终止api执行
   
    },
    success(res) {
      // res为callFunction的返回值，此处可以对返回值进行修改
    },
    fail(err) {
      // err为callFunction抛出的错误
    },
    complete(res){
      // complete内res为上面的res或err
    }
  })
  return {
    app
  }
}
