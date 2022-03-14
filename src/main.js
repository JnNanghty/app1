import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import './theme/main.css';

import './util/adaptive';
import './util/serialPort';

import ls from "@/store/ls";
import {initMqtt} from "@/util/mqttUtil";

const app = createApp(App)
app.use(router)

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

import Message from "@/components/Message.vue";
import Confirm from "@/components/Confirm";
app.component(Message.name, Message);
app.component(Confirm.name, Confirm);

router.isReady().then(() => app.mount('#app'));


const serviceUrl = ls.get('serviceUrl');
if (serviceUrl) {
  initMqtt();
}

