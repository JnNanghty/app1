import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import './theme/main.css';

import './util/adaptive';
import './util/serialPort';

import ls from "@/store/ls";
import {initMqtt} from "@/util/mqttUtil";
import VueCookies from 'vue3-cookies'

const app = createApp(App)
app.use(router).use(VueCookies)
// 取消inject的.value
app.config.unwrapInjectedRef = true
app.directive('doubleclick', {
  mounted(el, binding) {
    let clicked = false;
    let resetTimeout = null
    el.onclick = () => {
      if (clicked) {
        binding.value()
        clicked = false;
        clearTimeout(resetTimeout);
      } else {
        clicked = true;
        resetTimeout = setTimeout(() => {
          clicked = false;
        }, 200)
      }
    }
  }
});

import UserInfo from "@/components/UserInfo";
app.component(UserInfo.name, UserInfo);

router.isReady().then(() => app.mount('#app'));


const serviceUrl = ls.get('serviceUrl');
if (serviceUrl) {
  initMqtt();
}

