import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'


import './theme/main.css';

import './util/adaptive';
import 'qweather-icons/font/qweather-icons.css';


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
