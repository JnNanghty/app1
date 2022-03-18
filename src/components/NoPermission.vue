<style lang="stylus" scoped>
.main {
  width: 100%
  height: 100%
}
</style>
<template>
  <div class="main">
    <div><img src="../assets/noPermission.png" alt=""></div>
    <div>您当前无访问权限请先联系管理员为您开通</div>
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

