<style scoped lang="stylus">
.auth-main
  get_font_color(font_color)
  height: 100%
  overflow: hidden;

.auth-title
  text-align center
  margin-top: 1.5rem;
  //margin-bottom: 2rem;
  font-size 1.2rem

.auth-content
  display flex
  justify-content space-around
  margin-top: 2rem;

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

.submit-form
  text-align center
  margin-top: 1rem

  .form-item
    margin: 1rem 0;
    font-size 1rem;

    .form-input
      height: 2rem

  .submit
    width: 30%
    margin-top: 3rem

.password-mode-button
  margin: .5rem auto;
  width: 30%
  get_background(patrol_course_info_background)
</style>
<template>
  <div class="auth-main">
    <div class="auth-title">{{ title }}</div>
    <template v-if="mode === 1">
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
    </template>
    <template v-else>
      <form class="submit-form">
        <div class="form-item">
          <label for="account">
            账号：
            <input type="text" v-model="account" class="form-input _input" id="account">
          </label>
        </div>
        <div class="form-item">
          <label for="password">
            密码：
            <input type="password" v-model="password" class="form-input _input" id="password">
          </label>
        </div>
        <div class="submit _button" @click="passwordLogin">确认</div>
      </form>
    </template>
    <div class="password-mode-button _button" v-if="showChangeLoginModeButton" @click="changeMode">
      {{ mode === 1 ? '通过账号密码登录' : '其他登录方式' }}
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
      getTokenKey: null,
      mode: 1,
      account: '',
      password: '',
      showChangeLoginModeButton: false
    }
  },
  created() {
    this.getKey()
    mitt.on('brushCard', this.brushCard);
    mitt.emit('showBackButton', () => {
      if (ls.get('isExamMode')) {
        this.$router.push({name: 'ExamMode'})
      } else {
        this.$router.push({name: 'Home'})
      }
    })
    let config = ls.get('deviceConfig');
    this.config = config.signInTypes ? JSON.parse(config.signInTypes) : []
    this.timer = setInterval(this.getQrToken, 1e3);
    let params = this.$route.params;
    this.showChangeLoginModeButton = params.showChangeLoginModeButton && JSON.parse(params.showChangeLoginModeButton) || false;
    if (this.showChangeLoginModeButton) {
      this.mode = 2;
    }
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
      axios.post(url + '/rest/weChatApp/getWxAppQrCode', para, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        this.qrCodeUrl = 'data:;base64,' + res.data.buffer;
      })
    },
    loginSuccess() {
      // setToken('6669282:61646D696E36363639323130:1652167051808:F7353F580F31DF479A3D75B0A931164A');
      this.getUserPermission();
    },
    icLogin(ic) {
      service.post('auth/icLogin', {
        ic: ic
      }).then(res => {
        if (res) {
          this.afterLogin(res);
        } else {
          msg({
            message: '未找到该用户！ 卡号：' + ic,
            type: 'wrong'
          });
        }
      }, () => {
        msg({
          message: '登录失败！ 卡号：' + ic,
          type: 'wrong'
        });
      });
    },
    brushCard(res) {
      if (this.mode === 1) {
        this.icLogin(res);
      }
    },
    getUserPermission() {
      service.post('permission/getUserPermission').then(res => {
        ls.set('permission', res, 3e5);
        mitt.emit('loginSuccess');
      })
    },
    getQrToken() {
      let url = ls.get('serviceUrl')
      axios.post(url + '/rest/device/getQrLoginToken', {
        getTokenKey: this.getTokenKey,
        key: this.key
      }, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        if (JSON.stringify(res.data) === '{}' || !res.data) {
        } else {
          this.afterLogin(res.data);
        }
      })
    },
    afterLogin(res) {
      setToken(res.token);
      this.$cookies.set('token', res.token, 3e5);
      ls.set('userInfo', res, 3e5);
      msg({
        message: '登录成功！',
        type: 'success'
      });
      this.loginSuccess();
    },
    passwordLogin() {
      if (this.account === 'admin' && this.password === '090402') {
        let userInfo = {
          extraInformation: {
            label: "系统管理员(离线)"
          },
          offline: true
        };
        let permission = {
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
        }
        ls.set('userInfo', userInfo, 3e5);
        ls.set('permission', permission, 3e5);
        msg({
          message: '登录成功！',
          type: 'success'
        });
        mitt.emit('loginSuccess');
        return;
      }
      service.post('auth/login', {
        account: this.account,
        password: this.password
      }).then(res => {
        if (res) {
          this.afterLogin(res);
        }
      }, () => {
        msg({
          message: '登录失败！',
          type: 'wrong'
        });
      })
    },
    changeMode() {
      if (this.mode === 1) {
        this.mode = 2;
      } else {
        this.mode = 1;
      }
    }
  }
}
</script>
