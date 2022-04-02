<style lang="stylus" scoped>
.main
  get_font_color(font_color)
  width: 100%
  height: 100%
  display flex
  padding: 0.65rem;
  box-sizing border-box
  .main-left,
  .main-right
    flex: 1;
    get_background(setting_panel_bancground)
    padding-top: .7rem
    padding-left: 1.25rem
    position relative
    border-radius .4rem;

    .form-input
      max-width: 19.5rem;
      height: 2rem

  .main-left
    margin-right: 0.75rem
.form-item
  margin-bottom: 0.85rem
.form-label
  margin-bottom: 0.35rem
  font-size 0.7rem;

.form-title
  margin-bottom: 1.15rem
  font-size 1rem;

.submit-button
  text-align center;
  border-radius 0.4rem;
  width: 15.5rem
  height: 2rem
  line-height @height;
  margin-top: 2rem
</style>
<template>
  <div class="main">
    <div class="main-left">
      <h3 class="form-title">融合平台地址信息</h3>
      <form class="form-content">
        <div class="form-item">
          <div class="form-label">迈杰云平台</div>
          <input class="form-input _input" v-model="serviceUrl" style="width: 19.5rem">
        </div>
        <div class="submit-button _button" @click="checkIp">保存</div>
      </form>
    </div>
    <div class="main-right">
      <h3 class="form-title">登录融合平台</h3>
      <form class="form-content">
        <div class="form-item">
          <div class="form-label">账号</div>
          <input class="form-input _input" v-model="account" style="width: 19.5rem">
        </div>
        <div class="form-item">
          <div class="form-label">密码</div>
          <input class="form-input _input" type="password" v-model="password" style="width: 19.5rem">
        </div>
        <div class="submit-button _button" @click="login">登录</div>
      </form>
    </div>
  </div>
</template>

<script>
import ls from "@/store/ls";
import service from "@/api/services";
import {msg} from "@/components/message";
import {initMqtt} from "@/util/mqttUtil";
import Auth from "@/components/authPage/Auth";
import mitt from "@/util/mitt";
import {setToken} from "@/util/auth";

export default {
  name: "FirstSetting",
  components: {Auth},
  data() {
    return {
      serviceUrl: '',
      ipChecked: false,
      account: '',
      password: ''
    }
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  beforeUnmount() {
  },
  methods: {
    checkIp() {
      ls.set('serviceUrl', this.serviceUrl.toLowerCase());
      service.post('classCard/testLink').then(res => {
        if (res.message === 'success') {
          msg({
            message: '连接成功!',
            type: 'success'
          });
          initMqtt();
          this.ipChecked = true;
        } else {
          ls.remove('serviceUrl');
          msg({
            message: '连接服务器失败!',
            type: 'wrong'
          });
          this.ipChecked = false;
        }
      }, () => {
        ls.remove('serviceUrl');
        this.ipChecked = false;
      })
    },
    login() {
      service.post('auth/login', {
        account: this.account,
        password: this.password
      }).then(res => {
        setToken(res.token);
        ls.set('userInfo', res, 6e5);
        this.getConfig()
      })
    },
    getUserPermission() {
      service.post('permission/getUserPermission').then(res => {
        ls.set('permission', res, 6e5);
        msg({
          message: '登录成功！',
          type: 'success'
        })
        this.$router.push({
          name: 'SystemSettingHome'
        })
      })
    },
    getConfig() {
      service.post('classCard/getConfig').then((res) => {
        if (res.message === 'success') {
          ls.set('deviceConfig', res.data);
          this.getUserPermission();
        } else {
          msg({
            message: '获取班牌信息失败！',
            type: 'wrong'
          });
        }
      });
    }
  }
}
</script>

