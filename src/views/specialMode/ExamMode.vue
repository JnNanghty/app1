<style lang="stylus" scoped>
.main
  get_font_color(font_color)
  display flex
  padding: 1rem
  box-sizing border-box
  height: 100%
  .left, .right
    flex: 1;
    font-size .8rem;
  .left
    display flex
    flex-direction column
    margin-right: 1rem
    .left-top
      margin-bottom: 1rem
    .left-top, .left-bottom
      get_background(patrol_course_info_background)
      flex 1
      padding: 1rem
      border-radius 8px
    .left-item
      margin-bottom: .5rem;
  .right
    border-radius 8px
    get_background(patrol_course_info_background)
.icon
  width: 1rem
  height: @width;
  margin-right: .5rem
  vertical-align middle
</style>
<template>
  <div class="main">
    <div class="left">
      <div class="left-top">
        <div class="left-item" style="font-size: 1.6rem;">{{terminalInfo.label}}</div>
        <div class="left-item"><img class="icon" :src="seat" alt="">{{terminalInfo.seatCount}}座</div>
        <div class="left-item"><img class="icon" :src="remark" alt="">{{terminalInfo.remark || '-'}}</div>
      </div>
      <div class="left-bottom">
        <div class="left-item">考试科目：<span style="font-size: 1rem;">{{examData.examSubject}}</span></div>
        <div class="left-item">考试时间：{{examData.examStartDate}}</div>
<!--        <div class="left-item">监考人员：{{examData.examRoomNo}}</div>-->
      </div>
    </div>
<!--    <div class="right"></div>-->
  </div>
</template>

<script>
import timeUtil from "@/util/timeUtil";
import ls from "@/store/ls";

export default {
  name: 'Exam-Mode',
  components: {
  },
  data() {
    return {
      examData: {
        examRoomNo: '注册会计师考试',
        examStartDate: '12：00-13：30',
        examSubject: '注册会计师考试'
      },
      terminalInfo: {},
      seat: '',
      remark: ''
    }
  },
  created() {
    // const data = this.$route.params.data;
    // this.examData = JSON.parse(data);
    this.terminalInfo = ls.get('terminalInfo')
    this.changeTheme();
  },
  mounted() {},
  methods: {
    show() {
    },
    changeTheme() {
      let theme = window.document.documentElement.dataset.theme

      let suffix = 'dark'
      let suffix2 = ''
      if (theme === 'bright') {
        suffix = 'bright'
        suffix2 = '_bright'
      }

      this.seat = require(`@/assets/icon${suffix2}/seat_${suffix}.png`)
      this.remark = require(`@/assets/icon${suffix2}/remark_${suffix}.png`)
    }
  }
}
</script>
