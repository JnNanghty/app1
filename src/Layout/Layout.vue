<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding-top: .5rem;
  height: 3.5rem;
  color: #ffffff;
  position: relative;
}

.logo {
  margin-left: .5rem;
}

.header-center {
  position: absolute;
  top: .25rem;
  width: 100%;
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
}

.location-logo {
  color: #ffd400;
}

.header-right {

}

.header-temperature,
.header-date,
.header-time {
  float: right;
  margin-right: .5rem;
}

.header-time {
  font-size: 1.5rem;
}

ion-content {
  background: v-bind('config.background');
  background-size: cover;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex: 1;
  position: relative;
  height: calc(100% - 10rem);
}

.footer {
  display: flex;
  justify-content: center;
  height: 5rem;
  padding: .5rem 0;
  overflow-x: scroll;
}

.app-icon {
  width: 3rem;
  border-radius: .4rem;
  margin-right: 1.5rem;
  color: #ffffff;
  text-align: center;
}

.app-icon > span {
  white-space: nowrap;
}

.notice {
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: 10;
  background: #a9ccf5;
  height: 1.5rem;
}

.notice-text {
  white-space: nowrap;
  width: fit-content;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  font-size: 1rem;
  line-height: 1.5rem;
  letter-spacing: 3px;
}

.app-icon > ion-icon {
  font-size: 2rem;
  padding: .5rem;
  border-radius: .5rem;
  background-image: linear-gradient(to bottom, white 0, transparent 60%) !important;
}
</style>
<template>
  <div>
    <div>
      <header class="header">
        <div class="logo">
          <img style="height: 100%;" :src="config.logo" alt="">
        </div>
        <div class="header-center" v-show="router.currentRoute.value.name !== 'Home'">
          <ion-icon class="location-logo" :icon="location"></ion-icon>
          {{ terminalInfo.label }}
        </div>
        <div class="header-right">
          <div class="header-temperature">
            <i :class="weatherInfo.icon"></i>
            {{ weatherInfo.weather }} <br> {{ weatherInfo.temperature }}℃
          </div>
          <div class="header-date">
            <div class="header-date-up">{{ currentDay }}</div>
            <div class="header-date-down">{{ currentDate }}</div>
          </div>
          <div class="header-time">{{ currentTime }}</div>
        </div>
      </header>
      <main class="main-content">
        <router-view></router-view>
      </main>
      <footer class="footer">
        <!--    应用图标   -->
        <div class="app-icon" v-for="item in appList" :key="item.path" @click="goItem(item)" v-show="item.visible">
          <ion-icon :icon="item.icon" :style="item.style"></ion-icon>
          <br>
          <span>{{ item.label }}</span>
        </div>
      </footer>
      <div class="notice" v-show="showNotice">
        <div ref="scrollText" class="notice-text">
          通知通知通知通知通知通知通知通知通知通知通知通知通知
          通知通知通知通知通知通知通知通知通知通知通知通知通知
        </div>
      </div>
    </div>
    <Login ref="login" @loginSuccess="handleLoginSuccess"></Login>
  </div>
</template>

<script setup>
import {IonContent, IonPage, IonRouterOutlet, IonIcon, onIonViewWillEnter} from '@ionic/vue';
import {
  homeOutline,
  newspaperOutline,
  calendarOutline,
  personOutline,
  fingerPrintOutline,
  buildOutline,
  location,
  settingsOutline
} from 'ionicons/icons';
import timeUtil from "@/util/timeUtil";
import {ref, onBeforeUnmount} from "vue";
import router from "@/router";
import service from "@/api/services";
import {msg} from "@/components/message";
import ls from "@/store";
import Login from '@/components/LoginPanel/Login.vue';
// import { AppLauncher } from '@capacitor/app-launcher';


let time = Date.now();
// 当前时间
const currentTime = ref(timeUtil.formatTime(time));
// 当前日期
const currentDate = ref(timeUtil.formatDate(time));
// 当前星期
const currentDay = ref(timeUtil.getCurrentDay(time));
// 用于更新时间日期的定时器
let timeInterval = setInterval(() => {
  time = Date.now();
  currentTime.value = timeUtil.formatTime(time);
  currentDate.value = timeUtil.formatDate(time);
  currentDay.value = timeUtil.getCurrentDay(time);
}, 1e3);
// 组件注销前销毁定时器
onBeforeUnmount(() => {
  clearInterval(timeInterval);
});
// 背景图片 使用 v-bind 直接在css中引入，避免行内样式
// const background = ref('#afb09e');

const appList = ref([
  {
    icon: homeOutline,
    style: {background: '#f6054e'},
    label: '主页',
    name: 'home',
    path: 'Home',
    needLogin: false,
    visible: true
  },
  {
    icon: calendarOutline,
    style: {background: '#009bff'},
    label: '课程表',
    name: 'timetable',
    path: 'Curriculum',
    needLogin: false,
    visible: false
  },
  {
    icon: personOutline,
    style: {background: '#36ff00'},
    label: '巡课',
    name: 'patrol',
    path: 'Patrol',
    needLogin: false,
    visible: false
  },
  {
    icon: fingerPrintOutline,
    style: {background: '#00ffd0'},
    label: '考勤',
    name: 'attendance',
    path: 'Attendance',
    needLogin: false,
    visible: false
  },
  {
    icon: settingsOutline,
    style: {background: '#2200ff'},
    label: '系统设置',
    name: 'system',
    path: 'SystemSettingHome',
    needLogin: false,
    visible: true
  },
  {
    icon: newspaperOutline,
    style: {background: '#dd03ff'},
    label: '教室借用',
    name: 'borrow',
    path: 'ClassroomBorrow',
    needLogin: true,
    visible: false
  },
  {
    icon: buildOutline,
    style: {background: '#ff8800'},
    label: '报修',
    name: 'home',
    path: 'Repair',
    needLogin: false,
    visible: false
  },
]);


// 打开app
// const openApp = async () => {
//   const url = 'com.name.page'
//   const { value } = await AppLauncher.canOpenUrl({ url });
//   if (value) {
//     await AppLauncher.openUrl({ url });
//   } else {
//     msg({
//       message: '请检查应用是否安装或应用包名是否正确！'
//     });
//   }
// }


// 天气信息
const weatherInfo = ref({
  temperature: '无',
  weather: '无',
  icon: ''
});
// 获取经纬度  然后查询天气信息
const getPosition = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const {longitude, latitude} = position.coords;
      service.post('weather/now', {
        location: longitude.toFixed(2) + ',' + latitude.toFixed(2)
      }).then(res => {
        weatherInfo.value.temperature = res.now.temp;
        weatherInfo.value.weather = res.now.text || '无';
        weatherInfo.value.icon = 'qi-' + res.now.icon;
      })
    }, error => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          msg({
            message: '您拒绝对获取地理位置的请求!'
          });
          break;
        case error.POSITION_UNAVAILABLE:
          msg({
            message: '位置信息不可用!'
          });
          break;
        case error.TIMEOUT:
          msg({
            message: '请求您的地理位置超时!'
          });
          break;
        default:
          msg({
            message: '未知错误!'
          });
          break;
      }
    })
  }
}


// 获取班牌配置
const config = ref({
  background: 'url(' + require('../assets/default_background.jpg') + ') no-repeat',
  logo: '',
  label: ''
})
const getConfig = () => {
  service.post('classCard/getConfig').then(async (res) => {
    if (res.message === 'success') {
      const serviceUrl = await ls.get('serviceUrl') || '';
      config.value.background = res.data.background ? ('url(' + serviceUrl + res.data.background + ')') : 'url(' + require('../assets/default_background.jpg') + ') no-repeat';
      config.value.logo = serviceUrl + res.data.logo;
      await ls.set('deviceConfig', res.data);
      const custom = JSON.parse(res.data.custom);
      console.log(custom);
      appList.value.forEach(i => {
        custom.forEach(j => {
          if (i.name === j.name) {
            i.visible = j.value;
          }
        })
      });
    } else {
      msg({
        message: '获取班牌信息失败！'
      });
    }
  })
}

// 获取教室信息
const terminalInfo = ref({});
const terminalId = ref(null);
const getTerminalInfo = () => {
  service.post('classCard/terminalInfo', {
    id: terminalId.value
  }).then(async res => {
    terminalInfo.value = res.data;
    await ls.set('terminalInfo', res.data);
  })
}
onIonViewWillEnter(async () => {
  // enter
  // openApp();
  terminalId.value = await ls.get('terminalId');
  if (terminalId.value) {
    getTerminalInfo()
  }
});


import mitt from "@/util/mitt";
const refresh = async () => {
  console.log('refreshLayout');
  terminalId.value = await ls.get('terminalId');
  if (terminalId.value) {
    getTerminalInfo()
  }
  getConfig()
  getPosition()
}
mitt.on('refresh', refresh);

</script>
<script>
import {defineComponent} from 'vue';
import {getToken} from "@/util/auth";

export default defineComponent({
  name: 'Layout-view',
  data() {
    return {
      showNotice: false,
      loginToPath: null
    }
  },
  mounted() {
    // this.scroll();
  },
  methods: {
    // 通知滚动Animate
    scroll() {
      const keyframe = [
        {transform: 'translateX(100vw)'},
        {transform: 'translateX(-100%)'}
      ];
      const dom = this.$refs.scrollText;
      const animate = dom.animate(keyframe, {
        duration: 2e4,
        fill: 'forwards',
        easing: 'linear'
      });
      animate.onfinish = () => {
        this.showNotice = false;
      }
    },
    // 用name导航  传参用params
    async goItem(item) {
      const token = await getToken();
      if (item.needLogin && !token) {
        this.loginToPath = item.path;
        this.$refs.login.visible = true;
      } else {
        this.loginToPath = null;
        await this.$router.push({
          name: item.path
        });
      }
    },
    handleLoginSuccess() {
      // 需要登录的界面
      this.$router.push({
        name: this.loginToPath
      });
    }
  }
})
</script>

