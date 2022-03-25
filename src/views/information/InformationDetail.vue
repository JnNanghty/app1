<style lang="stylus" scoped>
.main
  padding: 1rem 2rem
  get_font_color(font_color)
  position relative
  box-sizing border-box
  width: 100%
  height: 100%
  iframe
    width: 100%
    height: 100%
  .info
    width: 100%
    height: 100%
.line
  margin: 1rem 0;
</style>
<template>
  <div class="main">
    <template v-if="info.type && info.type.id === 1">
      <iframe :src="info.content"></iframe>
    </template>
    <template v-else>
      <div>{{info.title}}</div>
      <div>
        <span>来源：{{info.laiyuan}}</span>
        <span>作者：{{info.author}}</span>
        <span>{{time}}</span>
      </div>
      <hr class="line">
      <div class="info" v-html="info.content"></div>
    </template>
  </div>
</template>

<script>
import mitt from "@/util/mitt";
import timeUtil from "@/util/timeUtil";

export default {
  name: "InformationDetail",
  components: {},
  data() {
    return {
      info: {}
    }
  },
  computed: {
    time() {
      return timeUtil.formatDate(this.info.createTime, '-')
    }
  },
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

