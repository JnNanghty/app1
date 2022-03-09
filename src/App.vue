<template>
  <div id="app">
    <router-view v-slot="{Component}" @click="changeTheme">
      <transition name="up">
        <component :is="Component"></component>
      </transition>
    </router-view>
    <div class="notice" v-show="showNotice">
      <div ref="scrollText" class="notice-text">{{ noticeText }}</div>
    </div>
  </div>
</template>
<script>
import mitt from "@/util/mitt";
import ls from "@/store/ls";

export default {
  data() {
    return {
      showNotice: false,
      noticeText: ''
    }
  },
  created() {
    window.document.documentElement.setAttribute('data-theme', 'dark');
  },
  mounted() {

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
      console.log(data);
    })

    mitt.on('mqttRealTimeBroadcast', this.broadcast);

    mitt.on('mqttConfig', (data) => {
      const serviceUrl = ls.get('serviceUrl') || '';
      if (data.background) {
        // this.background = 'url(' + serviceUrl + data.background + ') 0/cover no-repeat';
      }
    });

  },
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
      // this.showNotice = !this.showNotice
      // if (!this.showNotice) {
      //   window.document.documentElement.setAttribute('data-theme', 'dark');
      // } else {
      //   window.document.documentElement.setAttribute('data-theme', 'bright');
      // }
      // mitt.emit('changeTheme')
    }
  }
}
</script>
<style lang="stylus">
@import "~@/theme/mixin.styl";

#app {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;

  get_background(background)
}

.up-enter-active {
  /*transition: transform .5s, opacity .5s;*/
}

.up-leave-active {
  transition: transform .5s ease, opacity .5s ease;
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
</style>
