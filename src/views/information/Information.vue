<style lang="stylus" scoped>

</style>
<template>
  <div>
    <template v-if="contentType === 1">
      <iframe :src="info.content"></iframe>
    </template>
    <template v-else>
      <div></div>
    </template>
  </div>
</template>

<script>
export default {
  name: "Information",
  data() {
    return {
      info: {
        type: {}
      }
    }
  },
  computed: {
    contentType() {
      // 1 超链接
      // 2 富文本
      if (this.info.type && this.type.id === 1) {
        return 1
      } else {
        return 2
      }
    }
  },
  created() {
    let data = this.$route.params.data
    this.info = JSON.parse(data);
  },
  methods: {}
}
</script>

