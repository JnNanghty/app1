<style lang="stylus" scoped>
.user-info {
  min-width: 10rem
  get_font_color(font_color)
  display flex
  padding: 0.3rem
  box-sizing border-box

  .user-info-top {
    font-size .8rem;
    flex: 1;
    white-space nowrap
    overflow: hidden;
    text-overflow ellipsis

    .exit-text {
      font-size: .4rem;
      color: #FDA45E;
    }
  }

  .exit-button {
    padding: .4rem 1.5rem;
    text-align center
    border-radius .4rem;
    get_background(input_background)
    font-size .7rem;
    height fit-content
    white-space nowrap
    &:active {
      background #FDA45E !important
    }
  }
}
</style>
<template>
  <div class="user-info">
    <div class="user-info-top">
      <div>{{ userInfo.extraInformation ? userInfo.extraInformation.label : '-' }}</div>
      <div class="exit-text">{{ expireTime }}s后退出</div>
    </div>
    <div class="exit-button" @click="exitUser">退出</div>
  </div>
</template>

<script>
import ls from "@/store/ls";
import {removeToken} from "@/util/auth";

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
    this.exitInterval = setInterval(() => {
      let now = Date.now();
      this.expireTime = Math.floor((expires - now) / 1000);
      if (now >= expires) {
        clearInterval(this.exitInterval);
        this.$router.replace({
          name: 'Home'
        });
      }
    }, 1e3);
  },
  mounted() {
  },
  unmounted() {
    clearInterval(this.exitInterval)
  },
  methods: {
    exitUser() {
      ls.remove('userInfo');
      removeToken();
      ls.remove('permission');
      this.$router.replace({
        name: 'Home'
      });
    }
  }
}
</script>

