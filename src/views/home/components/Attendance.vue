<style lang="stylus" scoped>
.a-main
  get_font_color(font_color)
  padding-right: 2rem
  box-sizing border-box
.a-top
  get_background(patrol_course_info_background)
  border-radius 8px;
  display flex
  position relative
  padding: 1.5rem 1rem
  margin-bottom: 1rem
  box-sizing border-box
  justify-content space-around
  .top-item
    text-align center
    flex: 1;
    p
      opacity .6
    .number
      font-size 32px;
      font-weight 900
      margin-top: .5rem
  .line
    position relative
    &::after
      content: ''
      position absolute
      top: 0
      right: 0
      width: 1px
      height: 100%
      background: #272727;
      mix-blend-mode: normal;
      opacity: 0.47;
  .drag-button
    position absolute
    left: 0
    right: 0
    bottom: -0.5rem
    margin: 0 auto;
    width: 1.5rem
    img
      width: 100%
.a-bottom
  get_background(patrol_course_info_background)
  display flex
  justify-content space-around
  border-radius 8px;
  padding: 2rem 1rem;
  box-sizing border-box
  .auth-item
    width: 20%
    position relative
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .desc
      text-align center
    img
      width: 100%
</style>
<template>
  <div class="a-main">
    <div class="a-top">
      <div class="top-item line">
        <p>应到人数</p>
        <div class="number">{{ attendanceInfo.students.length }}</div>
      </div>
      <div class="top-item line">
        <p>实到人数</p>
        <div class="number" style="color: #F3A568;">{{ arrived.length }}</div>
      </div>
      <div class="top-item">
        <p>未到人数</p>
        <div class="number" style="color:#989898;">{{ notArrived.length }}</div>
      </div>
      <div class="drag-button"><img src="../../../assets/drag-down.png" alt=""></div>
    </div>
    <div class="a-bottom">
      <div class="auth-item">
        <img src="../../../assets/brush.png" alt="">
        <div class="desc">一卡通刷卡</div>
      </div>
      <div class="auth-item" @click="goPage('wx')">
        <img src="../../../assets/wx_code.png" alt="">
        <div class="desc">微信扫码</div>
      </div>
      <div class="auth-item" @click="goPage('face')">
        <img src="../../../assets/face.png" alt="">
        <div class="desc">人脸识别</div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/api/services";
import mitt from "@/util/mitt";

export default {
  name: "Attendance",
  props: {
    attendanceInfo: {
      type: Object,
      default: {
        students: []
      }
    }
  },
  data() {
    return {
      arrived: [],
      notArrived: [],

    }
  },
  created() {
    mitt.on('brushCard', this.brushCard);
  },
  beforeUnmount() {
    mitt.off('brushCard', this.brushCard);
  },
  methods: {
    goPage(name) {
      this.$router.push({
        name: ''
      })
    },
    brushCard(ic) {
      service.post('classCard/signIn', {
        ic,
        lessonId: this.attendanceInfo.id
      }).then(res => {

      })
    },

  }
}
</script>
