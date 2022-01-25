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
  font-size: 1.6rem;
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

.app-main-content {
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

.app-item-icon {
  font-size: 2rem;
  padding: .5rem;
  border-radius: .5rem;
  background-image: linear-gradient(to bottom, white 0, transparent 60%) !important;
}

.fade-enter-active {
  transition: transform .5s, opacity .5s;
}

.fade-leave-active {

}

.fade-enter {
  transform: translateX(-50%);
}

.fade-leave-to, .fade-enter {
  opacity: 0;
}
</style>
<template>
  <div>
    <div class="app-main-content" :style="{background: config.background}">
      <header class="header">
        <div class="logo">
          <img style="height: 100%;" :src="config.logo" alt="">
        </div>
        <transition name="fade">
          <div class="header-center" v-show="$router.currentRoute.name !== 'Home'">
            <van-icon class="location-logo" name="location"/>
            {{ terminalInfo.label }}
          </div>
        </transition>
        <div class="header-right">
          <div class="header-temperature">
            <i :class="weatherInfo.icon"></i>
            {{ weatherInfo.weather }} <br> {{ weatherInfo.temperature }}℃
          </div>
          <div class="header-date">
            <div class="header-date-up">{{ timeInfo.currentDay }}</div>
            <div class="header-date-down">{{ timeInfo.currentDate }}</div>
          </div>
          <div class="header-time">{{ timeInfo.currentTime }}</div>
        </div>
      </header>
      <main class="main-content">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </main>
      <footer class="footer">
        <!--    应用图标   -->
        <div class="app-icon" v-for="item in appList" :key="item.path" @click="goItem(item)" v-show="item.visible">
          <van-icon class="app-item-icon" :style="item.style" :name="item.icon"/>
          <br>
          <span>{{ item.label }}</span>
        </div>
      </footer>
    </div>
    <Login ref="login" @loginSuccess="handleLoginSuccess"></Login>
  </div>
</template>
<script>
import {getToken} from "@/util/auth";
import mitt from "@/util/mitt";
import ls from "@/store/ls";
import service from "@/api/services";
import {msg} from "@/components/message";
import timeUtil from "@/util/timeUtil";
import Login from "@/components/LoginPanel/Login";

export default {
  name: 'Layout-view',
  components: {
    Login
  },
  data() {
    let time = Date.now();
    return {
      showNotice: false,
      noticeText: '',
      loginToPath: null,
      terminalId: null,
      config: {
        background: 'url(' + require('../assets/default_background.jpg') + ') 0/cover no-repeat',
        logo: '',
        label: ''
      },
      appList: [
        {
          icon: 'wap-home-o',
          style: {background: '#f6054e'},
          label: '主页',
          name: 'home',
          path: 'Home',
          needLogin: false,
          visible: true
        },
        {
          icon: 'notes-o',
          style: {background: '#009bff'},
          label: '课程表',
          name: 'timetable',
          path: 'Curriculum',
          needLogin: false,
          visible: false
        },
        {
          icon: 'user-circle-o',
          style: {background: '#36ff00'},
          label: '巡课',
          name: 'patrol',
          path: 'Patrol',
          needLogin: true,
          visible: false
        },
        {
          icon: 'sign',
          style: {background: '#00ffd0'},
          label: '考勤',
          name: 'attendance',
          path: 'Attendance',
          needLogin: false,
          visible: false
        },
        {
          icon: 'setting-o',
          style: {background: '#2200ff'},
          label: '系统设置',
          name: 'system',
          path: 'SystemSettingHome',
          needLogin: false,
          visible: true
        },
        {
          icon: 'newspaper-o',
          style: {background: '#dd03ff'},
          label: '教室借用',
          name: 'borrow',
          path: 'ClassroomBorrow',
          needLogin: true,
          visible: false
        },
        {
          icon: 'bulb-o',
          style: {background: '#ff8800'},
          label: '报修',
          name: 'home',
          path: 'Repair',
          needLogin: true,
          visible: true
        },
      ],
      terminalInfo: {}, // 教室信息  label
      weatherInfo: {
        temperature: '无',
        weather: '无',
        icon: ''
      },
      weatherInterval: null,
      timeInterval: null, // 用于右上角时间
      timeInfo: {
        currentTime: timeUtil.formatTime(time),
        currentDate: timeUtil.formatDate(time),
        currentDay: timeUtil.getCurrentDay(time),
      }
    }
  },
  mounted() {
    mitt.on('refresh', this.refresh);

    mitt.on('mqttConfig', (data) => {
      ls.set('deviceConfig', data);
      this.handleConfig(data);
    });
    this.refresh();


    let time = Date.now();
    this.timeInterval = setInterval(() => {
      time = Date.now();
      this.timeInfo.currentTime = timeUtil.formatTime(time);
      this.timeInfo.currentDate = timeUtil.formatDate(time);
      this.timeInfo.currentDay = timeUtil.getCurrentDay(time);
    }, 1e3);

    // 每六个小时查一次天气
    this.weatherInterval = setInterval(() => {
      this.getPosition();
    }, 6 * 36e5);
  },
  beforeDestroy() {
    mitt.off('refresh', this.refresh);
    clearInterval(this.timeInterval);
    clearInterval(this.weatherInterval);
  },
  methods: {
    // 用name导航  传参用params
    goItem(item) {
      if (this.$route.name === item.path) return;
      const token = getToken();
      if (item.needLogin && !token) {
        this.loginToPath = item.path;
        this.$refs.login.visible = true;
      } else {
        this.loginToPath = null;
        this.$router.push({
          name: item.path
        });
      }
    },
    handleLoginSuccess() {
      // 需要登录的界面
      this.$router.push({
        name: this.loginToPath
      });
    },
    refresh() {
      console.log('Layout refresh')
      this.terminalId = ls.get('terminalId');
      if (this.terminalId) {
        this.getTerminalInfo()
      }
      const serviceUrl = ls.get('serviceUrl');
      if (serviceUrl) {
        this.getPosition();
        this.getConfig();
      }
    },
    getTerminalInfo() {
      service.post('classCard/terminalInfo', {
        id: this.terminalId
      }).then(res => {
        this.terminalInfo = res.data;
        ls.set('terminalInfo', res.data);
      })
    },
    getConfig() {
      service.post('classCard/getConfig').then((res) => {
        if (res.message === 'success') {
          ls.set('deviceConfig', res.data);
          mitt.emit('mqttConfig', res.data);
          this.handleConfig(res.data);
        } else {
          msg({
            message: '获取班牌信息失败！'
          });
        }
      });
    },
    handleConfig(data) {
      const serviceUrl = ls.get('serviceUrl') || '';
      this.config.background = data.background ? ('url(' + serviceUrl + data.background + ') 0/cover no-repeat') : 'url(' + require('../assets/default_background.jpg') + ') 0/cover no-repeat';
      this.config.logo = serviceUrl + data.logo;

      const custom = JSON.parse(data.custom) || [];
      this.appList.forEach(i => {
        custom.forEach(j => {
          if (i.name === j.name) {
            i.visible = j.value;
          }
        })
      });
    },
    getPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const {longitude, latitude} = position.coords;
          service.post('weather/now', {
            location: longitude.toFixed(2) + ',' + latitude.toFixed(2)
          }).then(res => {
            this.weatherInfo.temperature = res.now.temp;
            this.weatherInfo.weather = res.now.text || '无';
            this.weatherInfo.icon = 'qi-' + res.now.icon;
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
    },
  }
}
</script>
