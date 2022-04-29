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
    <open-auth></open-auth>
    <div class="open-button _button" @click="goPasswordOpen">密码开门</div>
  </div>
</template>

<script>
import mitt from "@/util/mitt";
import OpenAuth from "@/views/open/components/OpenAuth";
export default {
  name: "Open",
  components: {OpenAuth},
  data() {
    return {}
  },
  created() {
    mitt.on('loginSuccess', this.loginSuccess);
  },
  mounted() {},
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

