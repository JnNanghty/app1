<style lang="stylus" scoped>
.user-info {
  get_font_color(font_color)
  display flex

  .user-info-top {
    font-size .8rem;
    flex: 1;

    .exit-text {
      font-size: .6rem;
      color: #FDA45E;
      transform: scale(.85);
      transform-origin: left;
    }
  }

  .exit-button {
    margin-left: 2rem
    padding: .4rem 1.5rem;
    text-align center
    border-radius 8px;
    get_background(input_background)
    font-size .7rem;
    height fit-content
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
    this.userInfo = ls.get('userInfo') || {};
    let expires = +ls.get('userInfo__expires__') || 0;
    // this.exitInterval = setInterval(() => {
    //   let now = Date.now();
    //   this.expireTime = Math.floor((expires - now) / 1000);
    //   if (now >= this.expireTime) {
    //     clearInterval(this.exitInterval);
    //     this.$router.replace({
    //       name: 'Home'
    //     });
    //   }
    // }, 1e3);
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

