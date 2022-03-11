<style lang="stylus" scoped>
@import "~@/theme/mixin.styl";

.header {
  display: flex;
  justify-content: space-between;
  padding-top: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  max-height: 3.5rem;
  position: relative;

  get_font_color(font_color)
}

.logo {
  margin-left: .5rem;
}

.header-center {
  position: absolute;
  top: 0;
  width: 40%;
  left: 0
  right: 0
  margin: 0 auto;
  text-align: center;
  font-size: 0.9rem;
  padding-top:.5rem;

  &::before{
    content: ''
    display block
    position absolute
    top: 0
    left: 0
    right: 0
    margin: 0 auto;
    width: 2.6rem;
    height: 8px
    background: #FDA45E;
  }
}

.location-logo {
  color: #ffd400;
}

.header-right {

}

.setting-icon,
.header-time {
  float: right;
}

.setting-icon {
  width: 25px;
  height: 25px;
  background: url("../assets/icon/setting.png") no-repeat center;
  background-size: contain;
}

.header-time {
  margin-right: .5rem;
  font-size: .8rem;
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
  overflow: hidden;
}

.footer {
  display: flex;
  justify-content: center;
  height: 5rem;
  padding: .5rem 0;
  overflow-x: scroll;
  position relative
  get_font_color(font_color)
  .brush-tip{
    position absolute
    right: 0
    bottom: 0
  }
  .mj-logo{
    position absolute
    left: 8px;
    bottom: 8px;
  }
}

.app-icon {
  width: 3rem;
  margin-right: 1.5rem;
  text-align: center;
  position: relative;

  get_font_color(font_color);
}

.app-item-icon-active-dark::after {
  content: '';
  position: absolute;
  display: block;
  width: 100px;
  height: 100px;
  top: -30px;
  left: -37px;
  background-image: radial-gradient(50% 50% at 50% 50%, #CF7C0B 0%, rgba(114, 47, 0, 0.0001) 100%);
  background-blend-mode: lighten;
  opacity: 0.72;
}

.app-item-icon-active-bright::after {
  content: '';
  position: absolute;
  display: block;
  width: 100px;
  height: 100px;
  top: -30px;
  left: -37px;
  background-image: radial-gradient(50% 50% at 50% 50%, #0e0e0a 0%, rgba(114, 47, 0, 0.0001) 100%);
  background-blend-mode: lighten;
  opacity: 0.72;
}

.app-icon > span {
  white-space: nowrap;
}

.app-item-icon {
  position: relative;
  width: 25px;
  height: 25px;
  margin: 25px auto 8px;
}

.app-item-icon > img {
  width: 100%;
  height: 100%;
}

.fade-enter-active {
  transition: transform .5s ease, opacity .5s ease;
}

.fade-leave-active {

}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-50%);
}

.fade-leave-to {
  opacity: 0;
}
</style>
<template>
  <div>
    <div class="app-main-content">
      <header class="header">
        <div class="logo">
          <img style="height: 100%;" :src="config.logo" alt="">
        </div>
        <transition name="fade">
          <div class="header-center" v-show="showHeader">
            <div style="font-weight: 300">{{ terminalInfo.label }}</div>
            <div style="font-size: .6rem;font-weight: 200">{{terminalType}} / {{ terminalInfo.seatCount }}座 </div>
          </div>
        </transition>
        <div class="header-right">
          <div class="setting-icon" @click="goSetting"></div>
          <div class="header-time">{{ timeInfo.currentDate }}&nbsp;&nbsp;&nbsp;{{
              timeInfo.currentDay
            }}&nbsp;{{ timeInfo.currentTime }}
          </div>
        </div>
      </header>
      <main class="main-content">
        <router-view v-slot="{Component}">
          <transition name="fade">
            <component :is="Component"></component>
          </transition>
        </router-view>
      </main>
      <footer class="footer">
        <!--    应用图标   -->
        <div class="app-icon"
             v-for="item in appList" :key="item.path" @click="goItem(item)" v-show="item.visible">
          <div class="app-item-icon" :style="item.style"
               :class="$router.currentRoute.value.name === item.path ? 'app-item-icon-active-dark' : ''">
            <img class="app-item-icon-img" :src="item.src" alt="">
          </div>
          <span>{{ item.label }}</span>
        </div>

        <div class="brush-tip">
          刷卡区
        </div>
        <div class="mj-logo"><img src="../assets/mj_logo.png" alt=""></div>
      </footer>
    </div>
  </div>
</template>
<script>
import {getToken} from "@/util/auth";
import mitt from "@/util/mitt";
import ls from "@/store/ls";
import service from "@/api/services";
import {msg} from "@/components/message";
import timeUtil from "@/util/timeUtil";

export default {
  name: 'Layout-view',
  components: {},
  data() {
    let time = Date.now();
    return {
      showNotice: false,
      noticeText: '',
      loginToPath: null,
      terminalId: null,
      config: {
        logo: '',
        label: ''
      },
      appList: [
        {
          src: require('../assets/icon/home.png'),
          label: '主页',
          name: 'home',
          path: 'Home',
          needLogin: false,
          visible: true
        },
        {
          src: require('../assets/icon/curriculum.png'),
          label: '课程表',
          name: 'timetable',
          path: 'Curriculum',
          needLogin: false,
          visible: false
        },
        {
          src: require('../assets/icon/patrol.png'),
          label: '巡课',
          name: 'patrol',
          path: 'Patrol',
          needLogin: true,
          visible: false
        },
        {
          src: require('../assets/icon/borrow.png'),
          label: '预约',
          name: 'borrow',
          path: 'ClassroomBorrow',
          needLogin: false,
          visible: false
        },
        {
          src: require('../assets/icon/repair.png'),
          label: '报修',
          name: 'repair',
          path: 'Repair',
          needLogin: true,
          visible: true
        },
        {
          src: require('../assets/icon/open.png'),
          label: '开门',
          name: 'open',
          path: 'Open',
          needLogin: true,
          visible: true
        },
      ],
      terminalInfo: {}, // 教室信息  label
      timeInterval: null, // 用于右上角时间
      timeInfo: {
        currentTime: timeUtil.formatTime(time),
        currentDate: timeUtil.formatDate(time),
        currentDay: timeUtil.getCurrentDay(time),
      },
      terminalTypeList: [
        { id: 7, name: 'media', label: '多媒体教室' },
        { id: 1, name: 'wisdom', label: '智慧教室' },
        { id: 3, name: 'record', label: '录播教室' },
        { id: 4, name: 'computer', label: '计算机教室' },
        { id: 2, name: 'experiment', label: '实验实训室' },
        { id: 5, name: 'art', label: '功能教室' },
        { id: 6, name: 'other', label: '其他' }
      ]
    }
  },
  computed: {
    showHeader() {
      return true;
    },
    terminalType() {
      let label = ''
      this.terminalTypeList.forEach(i => {
        if(i.id === this.terminalInfo.type) {
          label = i.label
        }
      })
      return label;
    }
  },
  mounted() {

    // 绑定教室后需要刷新
    mitt.on('refresh', this.refresh);

    // 后台下发更新班牌设置
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

  },
  updated() {
  },
  beforeUnmount() {
    mitt.off('refresh', this.refresh);
    clearInterval(this.timeInterval);
  },
  methods: {
    // 用name导航  传参用params
    goItem(item) {
      if (this.$route.name === item.path) return;
      const token = getToken();
      if (item.needLogin && !token) {
        this.loginToPath = item.path;
      } else {
        this.loginToPath = null;
        this.$router.push({
          name: item.path
        });
      }
    },
    goSetting() {
      let t = getToken()
      let path = 'Auth'
      if (t) {
        path = 'SystemSettingHome'
      }
      this.$router.push({
        name: path
      });
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
        this.getConfig();
      }
    },
    getTerminalInfo() {
      service.post('classCard/terminalInfo', {
        id: this.terminalId
      }).then(res => {
        this.terminalInfo = res.data ? res.data : {};
        ls.set('terminalInfo', this.terminalInfo);
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
      this.config.logo = serviceUrl + data.logo;

      const custom = data.custom ? JSON.parse(data.custom) : [];
      this.appList.forEach(i => {
        custom.forEach(j => {
          if (i.name === j.name) {
            i.visible = j.value;
          }
        })
      });
    }
  }
}
</script>
