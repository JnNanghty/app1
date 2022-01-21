<style scoped>
.__login-shadow {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.6);
}

.__login-main {
  position: absolute;
  top: 20%;
  left: 12.5%;
  width: 75%;
  height: 60%;
  display: flex;
  background: #0df896;
}

.__login-qrcode-wrap, .__login-video-wrap {
  flex: 1;
}

.content-transform-enter-active,
.content-transform-leave-active {
  transition: all 0.3s ease;
}

.content-transform-enter-from,
.content-transform-leave-to {
  top: 100%;
}
</style>
<template>
  <div to="body">
    <div class="__login-shadow" @click.self="close" v-if="visible">
      <transition name="content-transform">
        <div class="__login-main" v-if="visibleMain">
          <div class="__login-qrcode-wrap">
            <div>二维码
              <button @click="loginSuccess">点击登录成功</button>
            </div>
          </div>
          <div class="__login-video-wrap">
            <div>摄像头 人脸识别</div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import service from "@/api/services";
import {setToken} from "@/util/auth";
import mitt from "@/util/mitt";
import {msg} from "@/components/message";
export default {
  name: 'Login',
  emits: ['loginSuccess'],
  data() {
    return {
      visible: false,
      visibleMain: false
    };
  },
  created() {
    mitt.on('brushCard', this.brushCard);
  },
  beforeDestroy() {
    mitt.off('brushCard');
  },
  methods: {
    close() {
      this.visibleMain = false;
    },
    loginSuccess() {
      this.$emit('loginSuccess');
      this.close();
    },
    // 使用ic卡刷卡登录
    icLogin(ic) {
      service.post('auth/icLogin', {
        ic: ic
      }).then(res => {
        setToken(res.token);
        this.loginSuccess();
      }, () => {
        msg({
          message: '登录失败！'
        });
      });
    },
    brushCard(res) {
      console.log(res);
      this.icLogin();
    }
  },
  watch: {
    visible(nv) {
      if (nv) {
        setTimeout(() => {
          this.visibleMain = true;
        }, 0);
      }
    },
    visibleMain(nv) {
      if (!nv) {
        setTimeout(() => {
          this.visible = false;
        }, 300);
      }
    }
  }
};
</script>

