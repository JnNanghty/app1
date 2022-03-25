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
      <div class="card" @click="loginSuccess">
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
import QRCode from 'qrcode'
import mitt from "@/util/mitt";
import {setToken} from "@/util/auth";
import service from "@/api/services";
import ls from "@/store/ls";
import {msg} from "@/components/message";
import axios from "axios";

export default {
  name: "Auth",
  data() {
    return {
      title: '请通过以下方式进行身份验证',
      qrCodeUrl: '',
      config: [],
      timer: null,
      key: null,
      getTokenKey: null
    }
  },
  created() {
    this.getKey()
    mitt.on('brushCard', this.brushCard);
    mitt.emit('showBackButton')
    let config = ls.get('deviceConfig');
    this.config = config.signInTypes ? JSON.parse(config.signInTypes) : []
    // this.timer = setInterval(this.getQrToken, 1e3);
  },
  computed: {
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
    clearInterval(this.timer)
  },
  methods: {
    getKey() {
      this.key = '';
      this.getTokenKey = '';
      this.wxQrCode()
    },
    wxQrCode() {
      this.key = ''
      this.getTokenKey = ''
      QRCode.toDataURL(JSON.stringify({
        terminalId: 6669946
      })).then(url => {
        this.qrCodeUrl = url;
      })
    },
    loginSuccess() {
      setToken('6669282:61646D696E36363639323130:1652167051808:F7353F580F31DF479A3D75B0A931164A');
      this.getUserPermission();
    },
    icLogin() {
      this.afterLogin({
        token: '6669282:61646D696E36363639323130:1652167051808:F7353F580F31DF479A3D75B0A931164A'
      });
    },
    brushCard(res) {
      this.icLogin(res);
    },
    getUserPermission() {
      ls.set('permission', {
        "terminalControl": true,
        "assetManagement": true,
        "courseLive": true,
        "listenTeaching": true,
        "course": true,
        "faultHanding": true,
        "guardControl": true,
        "educationalData": true,
        "supervisoryPatrol": true,
        "dataCentre": true
      }, 6e5);
      mitt.emit('loginSuccess');
    },
    getQrToken() {
    },
    afterLogin(res) {
      setToken(res.token);
      this.$cookies.set('token', res.token, 6e5);
      ls.set('userInfo', res, 6e5);
      msg({
        message: '登录成功！',
        type: 'success'
      })
      this.loginSuccess();
    }
  }
}
</script>
