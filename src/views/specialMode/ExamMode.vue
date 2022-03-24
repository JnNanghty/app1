<style lang="stylus" scoped>
.main
  get_font_color(font_color)
</style>
<template>
  <div class="main">
    <div class="left">
      <div class="left-top">
        <div>{{terminalInfo.label}}</div>
        <div>{{}}</div>
        <div></div>
      </div>
      <div class="left-bottom">
        <div class="exam-item">考试科目：{{examData.examSubject}}</div>
        <div class="exam-item">考试时间：{{examData.examStartDate}}</div>
        <div class="exam-item">监考人员：{{examData.examRoomNo}}</div>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
import timeUtil from "@/util/timeUtil";

export default {
  name: 'Exam-Mode',
  components: {
  },
  data() {
    return {
      examData: {
        examRoomNo: '考场号',
        examStartDate: '开始时间',
        examSubject: '考试科目'
      },
      terminalInfo: {}
    }
  },
  created() {
    const data = this.$route.params.data;
    this.examData = JSON.parse(data);
  },
  mounted() {},
  methods: {
    show() {
    }
  }
}
</script>
