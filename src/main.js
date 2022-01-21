import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'


import './theme/main.css';

import './util/adaptive';
import 'qweather-icons/font/qweather-icons.css';
import './util/mqttUtil';
import './util/serialPort';
import {Icon} from 'vant';
import 'vant/lib/icon/local.css';

Vue.config.productionTip = false
Vue.use(Icon);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
