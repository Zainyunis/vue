import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/gloable.css'
import request from "./utils/request";
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios,axios);
Vue.use(router);
Vue.use(ElementUi,{size:"mini"})
Vue.config.productionTip = false
Vue.prototype.request=request

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
