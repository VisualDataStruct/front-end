import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import lodash from 'lodash';
import axios from 'axios';

Vue.config.productionTip = false
Vue.use(ElementUI);

const Blockly = window.Blockly;
Vue.prototype.Blockly = Blockly;

Vue.config.productionTip = false;

axios.defaults.baseURL = '/api/';
Vue._ = Vue.prototype._ = window._ = Window.prototype._ = lodash;
Vue.$http = Vue.prototype.$http = axios;

window.title_suf = '|VDS';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
