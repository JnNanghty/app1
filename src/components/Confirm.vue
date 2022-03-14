<style lang="stylus" scoped>
._confirm-shadow
  position absolute
  top: 0
  left: 0
  bottom: 0
  right: 0
  width: 100%
  height: 100%
  get_background(message_box_background)

._confirm-box
  get_font_color(font_color)
  get_background(confirm_box_background)
  position absolute
  top: 50%
  transform translateY(-50%)
  left: 0
  right: 0
  margin: 0 auto
  border-radius 8px
  overflow: hidden;
._confirm-content
  text-align center
  padding: 15px 10px;
._confirm-close
  position absolute
  top: 10px
  right: 10px
  width: 10px
  height: 10px
  img
    width: 100%
    height: 100%
._confirm-button-box
  display flex
  border-top: 1px solid #1C1D1E;

  ._confirm-button
    flex 1;
    padding: 10px 0;
    text-align center
  ._confirm-ok
    border-right: 1px solid #1C1D1E;
</style>
<template>
  <teleport to="body">
    <div class="_confirm-shadow">
      <div class="_confirm-box">
        <div class="_confirm-close"><img src="../assets/close.png" alt=""></div>
        <div class="_confirm-content">{{ content }}</div>
        <div class="_confirm-button-box">
          <div class="_confirm-button _confirm-ok">确认</div>
          <div class="_confirm-button _confirm-cancel">取消</div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: "Confirm",
  props: ['content'],
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

