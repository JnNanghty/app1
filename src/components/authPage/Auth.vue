<style scoped lang="stylus">
.auth-main
  get_font_color(font_color)
  height: 100%
  overflow: hidden;
.auth-title
  text-align center
  margin-top: 50px
  margin-bottom: 50px
  font-size 24px
.auth-content
  display flex
  justify-content space-around

.login-item
  width: 140px
  height @width
  img
    width: 100%
.login-desc
  margin-top: 1.5rem;
  text-align center
  font-size 24px;
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
      <div class="code">
        <div class="login-item">
          <img style="border-radius: 6px" :src="qrCodeUrl" alt="">
        </div>
        <div class="login-desc">微信扫码</div>
      </div>
      <div class="face">
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
export default {
  name: "Auth",
  props: {
    title: {
      default: '请通过一下任一种方式进行身份验证',
      type: String
    }
  },
  data() {
    return {
      qrCodeUrl: ''
    }
  },
  created() {
    this.wxQrCode()
    mitt.on('brushCard', this.brushCard);
  },
  beforeUnmount() {
    mitt.off('brushCard', this.brushCard);
  },
  methods: {
    wxQrCode() {
      QRCode.toDataURL('nb').then(url => {
        this.qrCodeUrl = url;
      });
    },
    loginSuccess() {
      setToken('6669282:61646D696E36363639323130:1652167051808:F7353F580F31DF479A3D75B0A931164A');
      mitt.emit('loginSuccess');
    },
    icLogin(ic) {
      service.post('auth/icLogin', {
        ic: ic
      }).then(res => {
        if (res) {
          setToken(res.token);
          ls.set('userInfo', res, 6e5);
          msg({
            message: '登录成功！',
            type: 'success'
          })
        } else {
          msg({
            message: '未找到该用户！',
            type: 'wrong'
          });
        }
      }, () => {
        msg({
          message: '登录失败！',
          type: 'wrong'
        });
      });
    },
    brushCard(res) {
      this.icLogin(res);
    }
  }
}
</script>
