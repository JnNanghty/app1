<style scoped>

</style>
<template>
  <div>节目模式</div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {
    const data = this.$route.params.data
    console.log('节目模式参数')
    console.log(data);
  },
  mounted() {
  },
  methods: {}
}
</script>
