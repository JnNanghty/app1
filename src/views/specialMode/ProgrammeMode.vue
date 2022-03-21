<style lang="stylus" scoped>
.main
  padding: 1rem 2rem;
  width: 100%
  height: 100%
  overflow scroll
  get_font_color(font_color)
</style>
<template>
  <div class="main">
    <template v-if="programmeData.type === 1">
      <video :src="serviceUrl"></video>
    </template>
    <template v-else>
      <div v-html="programmeData.content"></div>
    </template>
  </div>
</template>

<script>
import ls from "@/store/ls";

export default {
  data() {
    return {
      programmeData: {},
      serviceUrl: ''
    }
  },
  created() {
    const data = this.$route.params.data;
    this.programmeData = JSON.parse(data);
    console.log('节目模式参数')
    console.log(this.programmeData);
    this.serviceUrl = ls.get('serviceUrl');
  },
  mounted() {
  },
  methods: {}
}
</script>
