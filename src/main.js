import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import './theme/main.css';

import './util/adaptive';
import 'qweather-icons/font/qweather-icons.css';
import './util/serialPort';

import Vant from 'vant';
import 'vant/lib/index.css';
import ls from "@/store/ls";
import {initMqtt} from "@/util/mqttUtil";

const app = createApp(App)
app.use(router).use(Vant);

router.isReady().then(() => app.mount('#app'));


const serviceUrl = ls.get('serviceUrl');
if (serviceUrl) {
  initMqtt();
}
