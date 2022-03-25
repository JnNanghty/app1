<style lang="stylus" scoped>
.user-info {
  get_font_color(font_color)
  display flex
  padding: 0.3rem
  box-sizing border-box

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
      userInfo: {
        label: '李荣浩'
      },
      expireTime: 360,
      exitInterval: null
    }
  },
  created() {
    let now1 = Date.now();
    now1 = now1 + 360 * 1000
    this.exitInterval = setInterval(() => {
      let now = Date.now();
      this.expireTime --;
      if (now >= now1) {
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
      ls.remove('userInfo')
      this.$router.replace({
        name: 'Home'
      });
    }
  }
}
</script>

