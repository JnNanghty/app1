<style lang="stylus" scoped>

</style>
<template>
  <div>
    <template>
      <iframe src=""></iframe>
    </template>
    <template></template>
  </div>
</template>

<script>
export default {
  name: "Information",
  data() {
    return {
      info: {}
    }
  },
  created() {
    let data = this.$route.params.data
    this.info = JSON.parse(data);
  },
  methods: {

  }
}
</script>

