import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import './theme/main.css';

import './util/adaptive';
import './util/serialPort';

import Vant from 'vant';
import 'vant/lib/index.css';
import ls from "@/store/ls";
import {initMqtt} from "@/util/mqttUtil";

const app = createApp(App)
app.use(router).use(Vant);

app.directive('doubleclick', {
  mounted(el, binding) {
    console.log('click')
    console.log(el, binding)
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
})

router.isReady().then(() => app.mount('#app'));


const serviceUrl = ls.get('serviceUrl');
if (serviceUrl) {
  initMqtt();
}

