import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import './theme/main.css';

import './util/adaptive';
import './util/serialPort';

import ls from "@/store/ls";
import {initMqtt} from "@/util/mqttUtil";
import VueCookies from 'vue3-cookies'
import '@/util/mock'

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

app.directive('clickoutside', {
  mounted(el, binding) {
    function handler(e) {
      if (el.contains(e.target)) return false;
      binding.value(e)
    }
    document.addEventListener('click', handler)
    el.__vueClickOutside__ = handler
  },
  beforeUnmount(el, binding) {
    document.removeEventListener('click', el.__vueClickOutside__)
    delete el.__vueClickOutside__
  }
});

import UserInfo from "@/components/UserInfo";

app.component(UserInfo.name, UserInfo);
import MySelect from "@/components/MySelect";

app.component(MySelect.name, MySelect);
import MyOption from "@/components/MyOption";

app.component(MyOption.name, MyOption);

router.isReady().then(() => app.mount('#app'));


const serviceUrl = ls.get('serviceUrl');
if (serviceUrl) {
  initMqtt();
}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  StatusBar.hide();
}
