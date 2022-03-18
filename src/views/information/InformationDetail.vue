<style lang="stylus" scoped>
.main
  padding: 1rem 2rem
  get_font_color(font_color)

</style>
<template>
  <div class="main">
    <template v-if="info.type && info.type.id === 1">
      <iframe :src="info.content"></iframe>
    </template>
    <template v-else>
      <div v-html="info.content"></div>
    </template>
  </div>
</template>

<script>
import mitt from "@/util/mitt";

export default {
  name: "InformationDetail",
  components: {},
  data() {
    return {
      info: {}
    }
  },
  computed: {},
  created() {
    let data = this.$route.params.data
    this.info = JSON.parse(data)
    mitt.emit('showBackButton')
  },
  mounted() {
  },
  beforeUnmount() {
    mitt.emit('hideBackButton')
  },
  methods: {}
}
</script>

