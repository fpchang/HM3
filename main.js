import App from './App'
import store from "./store/store";
import {CF} from './static/utils/CF';
import Vuex from "vuex";
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  return {
    app
  }
}
