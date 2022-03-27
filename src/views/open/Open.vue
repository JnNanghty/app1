<style lang="stylus" scoped>
.main
  get_font_color(font_color)
  position relative
  .open-button
    position absolute
    bottom: 0
    left: 0
    right: 0
    width: 30%
    get_background(patrol_course_info_background)
</style>
<style lang="stylus">
.ss
  margin-left: 10rem
  margin-top: 17rem
  width: 5rem
  height: 2rem
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
  components: { Auth},
  data() {
    return {
    }
  },
  created() {

  },
  mounted() {
    // this.$refs.auth.$data.title = '请通过一下任一种方式进行开门'
    mitt.emit('hideBackButton')
  },
  methods: {
    goPasswordOpen() {
      this.$router.push({
        name: 'PasswordOpen'
      })
    }
  }
}
</script>

