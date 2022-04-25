<template>
  <div id="app-main">
    <router-view v-slot="{Component}">
      <transition name="up">
        <component :is="Component"></component>
      </transition>
    </router-view>
    <div class="notice" v-show="showNotice">
      <div ref="scrollText" class="notice-text">{{ noticeText }}</div>
    </div>
    <div class="app-back-button" v-show="showBackButton" @click="$router.back">
      <img src="./assets/back_button.png" alt="">
    </div>
  </div>
</template>
<script>
import mitt from "@/util/mitt";
import ls from "@/store/ls";
import {initMqtt} from "@/util/mqttUtil";

export default {
  data() {
    return {
      showNotice: false,
      noticeText: '',
      showBackButton: false
    }
  },
  created() {
    window.document.documentElement.setAttribute('data-theme', 'dark');

    mitt.on('mqttExam', (data) => {
      this.$router.push({
        name: 'ExamMode',
        params: {
          data: JSON.stringify(data)
        }
      });
    });

    mitt.on('mqttProgramme', (data) => {
      this.$router.push({
        name: 'ProgrammeMode',
        params: {
          data: JSON.stringify(data)
        }
      });
    })

    mitt.on('mqttInfo', (data) => {
      this.$router.push({
        name: 'Information',
        params: {
          data: JSON.stringify(data)
        }
      })
    })

    mitt.on('mqttRealTimeBroadcast', this.broadcast);

    mitt.on('mqttConfig', (data) => {
      if (data.theme === 'dark' || data.theme === 'bright') {
        window.document.documentElement.setAttribute('data-theme', data.theme);
      }
    });

    mitt.on('showBackButton', () => {
      this.showBackButton = true;
    })

    mitt.on('hideBackButton', () => {
      this.showBackButton = false;
    })

    mitt.on('mqttStatus', (data) => {
      if (+data === 1) {
        this.$router.replace({
          name: "Home"
        });
      }
    })
  },
  mounted() {},
  methods: {
    broadcast(data) {
      this.showNotice = true;
      this.noticeText = data.content;
      this.scroll();
    },
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
        this.noticeText = '';
      }
    },
    changeTheme() {
      this.showNotice = !this.showNotice
      if (!this.showNotice) {
        window.document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        window.document.documentElement.setAttribute('data-theme', 'bright');
      }
      mitt.emit('changeTheme')
    }
  }
}
</script>
<style lang="stylus">

#app-main {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  get_background(background)
  background-image: url('./assets/bg-mark.png');
  background-repeat: no-repeat;
  background-size: 40%;
  background-position: 0 100%;
}

.up-enter-active {
  /*transition: transform .5s, opacity .5s;*/
}

.up-leave-active {
  transition: transform .4s ease, opacity .4s ease;
}

.up-leave-to {
  transform: translateY(-50%);
}

.up-leave-to, .up-enter-from {
  opacity: 0;
}


.notice {
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: 10;
  background: #a9ccf5;
  height: 1.5rem;
  opacity 0;
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

.app-back-button {
  position absolute
  left: 0
  bottom: 1rem;
  height: 10rem
  z-index 100

  img {
    height 100%
  }
}


</style>
