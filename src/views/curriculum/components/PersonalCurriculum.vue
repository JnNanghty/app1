<style scoped lang="stylus">
@import "~@/theme/mixin.styl";
.week-curriculum-main
  overflow-y: scroll;
  height: 100%;
  padding-right: 30px
  box-sizing border-box
  get_font_color(font_color)

  .change-week
    overflow-x scroll
    margin-bottom: 0.25rem;

    &::-webkit-scrollbar
      height: 0

    .scroll-wrap
      itemWidth = 100px;
      width 19 * itemWidth

      .week-item
        float left
        width: itemWidth
        height: 48px
        line-height @height
        text-align center

      .week-item-active
        position relative;
        border-bottom 1px solid #FDA45E;

        &::after {
          content: '';
          position absolute;
          top: 0
          left: 0
          width: 100%
          height: 100%
          background: linear-gradient(180deg, rgba(51, 57, 65, 0.0001) 11.53%, rgba(123, 96, 77, 0.5) 53.32%, #FDA45E 100%);
          opacity: 0.26;
        }

.table
  display flex
  text-align center

.table-col
  flex: 1;

  .table-row
    min-height: 2.5rem;
    box-sizing: border-box;
    //border-right: 1px solid #2F333A;
    display flex
    justify-content center
    align-items center
    position relative

  //overflow: hidden

  .course-item
    get_background(patrol_bottom_background)
    border-radius 4px;
    margin-left: .25rem
    margin-right: .25rem
    margin-bottom: .5rem
    border-right: none;
    position relative

    .course-detail
      position absolute
      top: 53%
      left: 50%;
      transform: translateX(-50%);
      border-radius 8px;
      width: 200px
      get_background(curriculum_course_detail_background)
      box-shadow: 0 8px 10px rgba(43, 51, 69, 0.208523);
      z-index 10
      text-align left
      padding: 5px 20px;
      font-size 12px;

      &::after
        position absolute
        top: -10px;
        left: 50%
        content ''
        display block
        width: 0
        height: 0
        border: 5px solid #000;
        border-top-color: transparent;
        border-bottom-color: #575D67;
        border-left-color: transparent;
        border-right-color: transparent;

  .table-title
    get_background(curriculum_section_background)
    padding: 8px 0;
    margin-bottom: 2px
    font-size 14px;
    min-height: auto;
    border-right: none

  &:nth-child(1) .table-title
    border-top-left-radius 8px;

  &:nth-child(8) .table-title
    border-top-right-radius 8px;

  .section-row
    padding: 3px
    get_background(curriculum_section_background)
    color #9fa2a7
    display block

    .section-label
      font-size 16px

    .section-time
      font-size 12px
      transform scale(0.8)

</style>
<template>
  <div class="week-curriculum-main">
    <div class="change-week" ref="weekWrap">
      <div class="scroll-wrap">
        <div class="week-item" :class="currentWeek === item ? 'week-item-active' : ''"
             v-for="item in 19" :ref="'week-item-' + item" @click="changeWeek(item)">
          第{{ simplifyNum[item - 1] }}周
        </div>
      </div>
    </div>
    <div class="table">
      <div class="table-col">
        <div class="table-row table-title">课节时间</div>
        <div class="table-row section-row" v-for="(item, index) in sectionTime" :key="index">
          <span class="section-label">第{{ simplifyNum[index] }}节</span>
          <div class="section-time">{{ item }}</div>
        </div>
      </div>
      <div class="table-col" v-for="(item, index) in curriculum" :key="item">
        <div class="table-row table-title">星期{{ simplifyNumberArray[index] }}</div>
        <div class="table-row" :class="!!course.courseName ? 'course-item' : ''"
             v-for="(course, courseIndex) in curriculum[index]"
             :key="courseIndex" :style="course && course.style" @click="selectItem(course)">
          {{ course && course.courseName }}
          <div class="course-detail" v-if="course.courseName && course.showDetail">
            <div style="font-size: 18px;">{{ course.courseName }}</div>
            <div>{{ course.teacherName }} <span
                style="margin-left: 1rem;">{{ calcTime(course.startSession, course.endSession) }}</span></div>
            <div style="margin-bottom: 10px;">{{ course.college }}</div>
            <div>{{ course.courseClass }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ls from "@/store/ls";
import {msg} from "@/components/message";
import service from "@/api/services";
import timeUtil from "@/util/timeUtil";

export default {
  name: 'Personal-Curriculum',
  data() {
    return {
      terminalId: null,
      currentWeek: 1,
      sectionTime: [],
      curriculum: [],
      simplifyNumberArray: ['一', '二', '三', '四', '五', '六', '日'],
      simplifyNum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九'],
      closeTimeout: null //5s后关闭课程详情
    }
  },
  mounted() {
    this.terminalId = ls.get('terminalId');
    if (this.terminalId) {
      this.getFirstWeek();
    } else {
      msg({
        message: '请先在设置中绑定班级！'
      });
    }
  },
  beforeUnmount() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout)
      this.closeTimeout = null;
    }
  },
  methods: {
    getFirstWeek() {
      service.post('classCard/scheduleInfo', {
        id: this.terminalId
      }).then(res => {
        this.currentWeek = this.calcCurrentWeek(res.data.firstWeek);
        this.scrollLeft()
        this.sectionTime = res.data.sessionSourceList.map(i => {
          return `${timeUtil.sourceToTime(i.startSource)}-${timeUtil.sourceToTime(i.endSource)}`;
        })
        this.getCurriculum();
      })
    },
    getCurriculum() {
      service.post('course/terminalCurriculum', {
        id: this.terminalId,
        weekNo: this.currentWeek
      }).then(res => {
        // 空格子
        const sectionLen = this.sectionTime.length;
        let data = [];
        res.result.forEach((item, index) => {
          let temp = [];
          for (let i = 1; i <= sectionLen; i++) {
            let hasPush = false;
            item.forEach(course => {
              if (i >= course.startSession && i <= course.endSession) {
                temp.push(Object.assign(course, {
                  style: {
                    height: (2.5 * (course.endSession - course.startSession + 1) - 0.5) + 'rem'
                  },
                  showDetail: false
                }));
                i = course.endSession;
                hasPush = true;
              }
            });
            !hasPush && temp.push({
              courseName: '',
              courseNumber: '',
              dayOfWeek: index + 1,
              startSession: i,
              endSession: i,
              style: {
                height: '2.5rem'
              },
              showDetail: false
            });
          }
          data.push(temp);
        });
        this.curriculum = data;
      });
    },
    calcCurrentWeek(firstWeek) {
      const fwt = new Date(firstWeek).getTime();
      const now = new Date().getTime();
      let weekNum = Math.floor((now - fwt) / 1000 / 60 / 60 / 24 / 7) + 1;
      if (isNaN(weekNum) || weekNum < 1) {
        weekNum = 1;
      }
      return weekNum;
    },
    changeWeek(week) {
      this.currentWeek = week;
      this.getCurriculum();
    },
    selectItem(item) {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout)
        this.closeTimeout = null;
      }
      this.closeOther()
      item.showDetail = true;
      this.closeTimeout = setTimeout(() => {
        this.closeOther();
        this.closeTimeout = null
      }, 5e3)
    },
    scrollLeft() {
      this.$refs.weekWrap.scrollBy({
        left: (this.currentWeek - 1) * 100,
        behavior: "smooth"
      })
    },
    // 根据开始节次和结束节次 计算开始时间和结束时间
    calcTime(startSession, endSession) {
      let start = this.sectionTime[startSession - 1]
      let end = this.sectionTime[endSession - 1]
      let startTime = start.split('-')[0]
      let endTime = end.split('-')[1];
      return startTime + '-' + endTime;
    },
    closeOther() {
      this.curriculum.forEach(item => {
        item.forEach(i => i.showDetail = false)
      });
    }
  }
}
</script>
