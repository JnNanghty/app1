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
    height: 18rem;
    pointer-events none
  .info
    width: 100%
    height: 15rem;
    overflow: scroll;
.line
  margin: 1rem 0;
  border 1px solid #272727
.info-title
  text-align center
  font-size .7rem;
.info-desc
  text-align center
  margin-top: .4rem;
  color #979797;
  font-size .6rem;

</style>
<template>
  <div class="main">
    <template v-if="info.type && info.type.id === 1">
      <iframe :src="info.content"></iframe>
    </template>
    <template v-else>
      <div class="info-title">{{info.title}}</div>
      <div class="info-desc">
        <span style="margin-right: 1rem;">来源：{{info.source}}</span>
        <span style="margin-right: 1rem;">作者：{{info.author}}</span>
        <span>{{time}}</span>
      </div>
      <div class="line"></div>
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
  methods: {
  }
}
</script>

