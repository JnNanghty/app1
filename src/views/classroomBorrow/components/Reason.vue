<style lang="stylus" scoped>
.r-main
  get_background(borrow_wrap_background)
  border-radius 8px
  height: 100%
  padding: 1.5rem 1rem
  box-sizing border-box
  .reason-content
    get_background(borrow_reason_content_background)
    border-radius 8px
    margin-top: .5rem
    height: 90%
    width: 100%
    padding: 1rem 1.5rem;
    box-sizing border-box
    overflow-y: scroll;
</style>
<template>
  <div class="r-main">
    <div style="margin-left: 1rem;">申请理由:</div>
    <div class="reason-content">
      <span>{{reasonText}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Reason",
  inject: ['reasonText'],
  data() {
    return {}
  },
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

