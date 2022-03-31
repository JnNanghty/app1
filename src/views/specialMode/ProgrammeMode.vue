<style lang="stylus" scoped>
.main
  width: 100%
  height: 100vh
  box-sizing border-box
  get_font_color(font_color)
  .full
    width: 100%
    height: 100vh;
  .text-content
    overflow scroll
    font-weight 1rem;
    display flex
    justify-content center
    align-items center
</style>
<template>
  <div class="main">
    <template v-if="programmeData.type.id === 1">
      <video class="full" :src="serviceUrl"></video>
    </template>
    <template v-else>
      <div class="full text-content" v-html="programmeData.content"></div>
    </template>
  </div>
</template>

<script>
import ls from "@/store/ls";

export default {
  data() {
    return {
      programmeData: {
        content: '',
        id: -1,
        label: '节目',
        resource: {
          downloadUrl: '',
          id: -2,
          label: ''
        },
        type: {
          id: 1,
          label: ''
        }
      },
      serviceUrl: ''
    }
  },
  created() {
    const data = this.$route.params.data;
    this.programmeData = JSON.parse(data);
    this.serviceUrl = ls.get('serviceUrl');
  },
  mounted() {
  },
  methods: {}
}
</script>
