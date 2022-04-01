<style lang="stylus" scoped>
.main
  get_font_color(font_color)
  position relative
  .open-button
    position absolute
    bottom: 1rem
    left: 0
    right: 0
    width: 30%
    get_background(patrol_course_info_background)
</style>
<template>
  <div class="main">
    <auth ref="auth"></auth>
    <div class="open-button _button" @click="goPasswordOpen">输入账号密码开门</div>
  </div>
</template>

<script>
import Auth from "@/components/authPage/Auth";
import mitt from "@/util/mitt";
export default {
  name: "Open",
  components: {Auth},
  data() {
    return {}
  },
  created() {
    mitt.on('loginSuccess', this.loginSuccess);
  },
  mounted() {
    // this.$refs.auth.$data.title = '请通过一下任一种方式进行开门'
    mitt.emit('hideBackButton')
  },
  beforeUnmount() {
    mitt.off('loginSuccess', this.loginSuccess);
  },
  methods: {
    goPasswordOpen() {
      this.$router.push({
        name: 'PasswordOpen'
      })
    },
    loginSuccess() {
      this.senCmd();
    },
    senCmd() {
      if(window.serialPortPlugin) {
        let cmd = new Uint8Array([0xAA, 0x02, 0x00, 0x00, 0x55]);
        window.serialPortPlugin.send(cmd, 3);
      }
    }
  }
}
</script>

