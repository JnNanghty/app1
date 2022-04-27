<style scoped lang="stylus">
.auth-main
  get_font_color(font_color)
  height: 100%
  overflow: hidden;

.auth-title
  text-align center
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  font-size 1.2rem

.auth-content
  display flex
  justify-content space-around

.login-item
  width: 7rem
  height @width

  img
    width: 100%

.login-desc
  margin-top: 1.5rem;
  text-align center
  font-size 1.2rem;

.face-box
  width: 100%
  height: 100%
  border-radius 50%
  border 5px solid #FFFFFF
  box-sizing border-box
</style>
<template>
  <div class="auth-main">
    <div class="auth-title">{{ title }}</div>
    <div class="auth-content">
      <div class="card">
        <div class="login-item">
          <img src="../../assets/brush.png" alt="">
        </div>
        <div class="login-desc">一卡通刷卡</div>
      </div>
      <div class="code" v-show="showQrCode">
        <div class="login-item">
          <img style="border-radius: 6px" :src="qrCodeUrl" alt="">
        </div>
        <div class="login-desc">微信扫码</div>
      </div>
      <div class="face" v-show="showFace">
        <div class="login-item">
          <div class="face-box"></div>
        </div>
        <div class="login-desc">人脸识别</div>
      </div>
    </div>
  </div>
</template>

<script>
import mitt from "@/util/mitt";
import service from "@/api/services";
import ls from "@/store/ls";
import {msg} from "@/components/message";
import axios from "axios";

export default {
  name: "SignAuth",
  data() {
    return {
      title: '请通过以下任一种方式进行签到',
      qrCodeUrl: '',
      config: [],
      timer: null,
      key: null,
      getTokenKey: null,
      attendanceInfo: {
        students: []
      },
      currentCourse: {}
    }
  },
  created() {
    this.getKey()
    mitt.on('brushCard', this.brushCard);
    mitt.emit('showBackButton')
    this.currentCourse = ls.get('currentCourse') || {};
    this.attendanceInfo = ls.get('attendanceInfo') || {students: []}
    let config = ls.get('deviceConfig');
    this.config = config.signInTypes ? JSON.parse(config.signInTypes) : []
    this.timer = setInterval(this.getQrToken, 1e3);
  },
  computed: {
    currentCourseFlag() {
      return !!this.currentCourse.courseId;
    },
    showQrCode() {
      let show = false;
      this.config.forEach(item => {
        if (item.name === 'code') {
          show = item.value
        }
      });
      return show;
    },
    showFace() {
      let show = false;
      this.config.forEach(item => {
        if (item.name === 'face') {
          show = item.value
        }
      });
      return show;
    }
  },
  beforeUnmount() {
    mitt.off('brushCard', this.brushCard);
    mitt.emit('hideBackButton')
    ls.set('attendanceInfo', this.attendanceInfo)
    clearInterval(this.timer)
  },
  methods: {
    getKey() {
      service.post('device/getQrLoginKey').then(res => {
        this.key = res.key;
        this.getTokenKey = res.getTokenKey;
        this.wxQrCode()
      })
    },
    wxQrCode() {
      let url = ls.get('serviceUrl')
      let para = {
        page: 'pages/qrLogin/qrLogin',
        scene: this.key
      };
      axios.post(url + '/rest/weChatApp/getWxAppQrCode', JSON.stringify(para), {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        this.key = res.data.key;
        this.getTokenKey = res.data.getTokenKey
        this.qrCodeUrl = 'data:;base64,' + res.data.buffer;
      })
    },
    icLogin(ic) {
      service.post('classCard/signIn', {
        ic: ic,
        lessonId: this.attendanceInfo.id
      }).then(res => {
        if (res) {
          this.afterLogin(res.data);
        } else {
          msg({
            message: '未找到该用户！',
            type: 'wrong'
          });
        }
      }, () => {
        msg({
          message: '签到失败！',
          type: 'wrong'
        });
      });
    },
    brushCard(res) {
      this.icLogin(res);
    },
    getQrToken() {
      let para = {
        getTokenKey: this.getTokenKey,
        key: this.key
      }
      let url = ls.get('serviceUrl')
      axios.post(url + '/rest/device/getQrLoginToken', JSON.stringify(para), {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        if (JSON.stringify(res.data) === '{}' || !res.data) {} else {
          this.afterLogin(res.data.extraInformation);
        }
      })
    },
    afterLogin(res) {
      let status = 3;
      if (this.currentCourseFlag) {
        status = 2;
      }
      this.attendanceInfo.students.forEach(item => (item.label === res.label) && (item.signInStatus = status));
      msg({
        message: '签到成功！',
        type: 'success'
      })
    }
  }
}
</script>
