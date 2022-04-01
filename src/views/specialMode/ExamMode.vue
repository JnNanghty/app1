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
      get_background(exam_background)
      flex 1
      padding: 1rem
      border-radius .4rem;
    .left-item
      margin-bottom: .5rem;
  .right
    border-radius .4rem;
    get_background(exam_background)
    overflow hidden
    .table-item
      text-align center
      display flex;
      font-size .7rem;
      .row-item
        flex: 1;
        padding: .5rem 1rem;
      .row-item2
        flex: 3;
      &:nth-child(odd)
        get_background(curriculum_section_course_item_odd_background)
      &:nth-child(even)
        get_background(curriculum_section_course_item_even_background)
    .table-title
      .row-item
        get_background(exam_background)
.scroll-wrap
  overflow-y scroll;
  height: 15.7rem
  box-sizing border-box;
.icon
  width: 1rem
  height: @width;
  margin-right: .5rem
  vertical-align middle
.border-item
  border-right 2px solid #000000;
  get_border_color(background)
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
        <div class="left-item">考 场 号：{{examData.examRoomNo}}</div>
        <div class="left-item">考试科目：<span style="font-size: 1rem;">{{examData.examSubject}}</span></div>
        <div class="left-item">考试时间：{{examData.examStartDate}}</div>
      </div>
    </div>
    <div class="right">
      <div class="table-item table-title">
        <div class="row-item border-item">考生姓名</div>
        <div class="row-item row-item2 border-item">准考证号</div>
        <div class="row-item">座位</div>
      </div>
      <div class="scroll-wrap">
        <div class="table-item" v-for="item in students" >
          <div class="row-item border-item">{{ item.label }}</div>
          <div class="row-item row-item2 border-item">{{ item.card }}</div>
          <div class="row-item">{{ item.seat }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import timeUtil from "@/util/timeUtil";
import ls from "@/store/ls";
import mitt from "@/util/mitt";

export default {
  name: 'Exam-Mode',
  components: {
  },
  data() {
    return {
      examData: {
        examRoomNo: '注册会计师考试',
        examStartDate: null,
        examEndDate: null,
        examSubject: '注册会计师考试'
      },
      terminalInfo: {},
      seat: '',
      remark: '',
      students: []
    }
  },
  created() {
    const data = this.$route.params.data;
    this.examData = JSON.parse(data);
    this.terminalInfo = ls.get('terminalInfo')
    this.changeTheme();
    mitt.on('changeTheme', this.changeTheme)
  },
  computed: {
    examDate() {
      let start = timeUtil.formatTime(this.examData.examStartDate || Date.now());
      let end = timeUtil.formatTime(this.examData.examEndDate)
      return start + ' - ' + end;
    },
  },
  mounted() {},
  beforeUnmount() {
    mitt.off('changeTheme', this.changeTheme)
  },
  methods: {
    show() {},
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
    },
  }
}
</script>
