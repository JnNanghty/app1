<style lang="stylus" scoped>
.main {
  width: 100%
  height: 100%
  text-align center
  get_font_color(font_color)
  font-size .8rem
}
</style>
<template>
  <div class="main">
    <div style="margin-top: 6rem;"><img src="../assets/noPermission.png" alt=""></div>
    <div style="margin-top: 2rem;">您当前无访问权限请先联系管理员为您开通</div>
  </div>
</template>

<script>
import mitt from "@/util/mitt";

export default {
  name: "NoPermission",
  components: {},
  data() {
    return {}
  },
  computed: {},
  created() {
    // mitt.emit('showBackButton')
  },
  mounted() {
  },
  beforeUnmount() {
    // mitt.emit('hideBackButton')
  },
  methods: {}
}
</script>

