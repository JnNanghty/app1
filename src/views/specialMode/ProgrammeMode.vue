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
    console.log('节目模式参数')
    const data = this.$route.params.data
    console.log(data);
    console.log(JSON.stringify(data));
  },
  mounted() {
  },
  methods: {}
}
</script>
