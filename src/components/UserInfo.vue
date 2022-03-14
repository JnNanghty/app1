<style lang="stylus" scoped>
.user-info {
  get_font_color(font_color)
  display flex

  .user-info-top {
    flex: 1;

    .exit-text {
      font-size: 12px;
      color: #FDA45E;
      transform: scale(.85);
      transform-origin: left;
    }
  }

  .exit-button {
    padding: 8px 30px;
    text-align center
    border-radius 8px;
    get_background(input_background)
  }
}
</style>
<template>
  <div class="user-info">
    <div class="user-info-top">
      <div>{{ userInfo.label || '-' }}</div>
      <div class="exit-text">{{ expireTime }}s后退出</div>
    </div>
    <div class="exit-button" @click="exitUser">退出</div>
  </div>
</template>

<script>
import ls from "@/store/ls";

export default {
  name: "UserInfo",
  data() {
    return {
      userInfo: {},
      expireTime: 0,
      exitInterval: null
    }
  },
  created() {
    this.userInfo = ls.get('userInfo');
    let expires = +ls.get('userInfo__expires__');
    this.exitInterval = setInterval(() => {
      let now = Date.now();
      if (now >= this.expireTime) {
        clearInterval(this.exitInterval);
        this.$router.replace({
          name: 'Home'
        });
      }
      this.expireTime = Math.floor((expires - now) / 1000);
    }, 1e3);
  },
  mounted() {
  },
  unmounted() {
    clearInterval(this.exitInterval)
  },
  methods: {
    exitUser() {
      ls.remove('userInfo')
      this.$router.replace({
        name: 'Home'
      });
    }
  }
}
</script>

