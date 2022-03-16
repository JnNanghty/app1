<style scoped>

</style>
<template>
  <div>节目模式</div>
</template>

<script>
export default {
  data() {
    return {
      programmeData: null
    }
  },
  created() {
    const data = this.$route.params.data;
    this.programmeData = JSON.parse(data);
    console.log('节目模式参数')
    console.log(this.programmeData);
  },
  mounted() {
  },
  methods: {}
}
</script>
