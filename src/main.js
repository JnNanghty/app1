import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import './theme/main.css';

import './util/adaptive';
import 'qweather-icons/font/qweather-icons.css';
import './util/serialPort';

import Vant from 'vant';
import 'vant/lib/index.css';

const app = createApp(App)
app.use(router).use(Vant);

app.mount('#app')

