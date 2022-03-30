<style lang="stylus" scoped>
.main
  width 100%
  height: 100%
  overflow: hidden;

  .main-window
    width 300%
    height: 100%
    transition all 1s ease;

    .main-c1,
    .main-c2,
    .main-c3
      width 50vw;
      height: 100%
      float left

    .main-c2
      display: flex;
      justify-content: center;
      align-items: center;

    .main-c1
      display: flex;
      align-items: center;
</style>
<template>
  <div class="main">
    <div class="main-window" :style="windowStyle">
      <div class="main-c1">
        <classroom-info v-show="terminalId"
                        :terminalInfo="terminalInfo"></classroom-info>
      </div>
      <div class="main-c2">
        <clock :currentCourse="currentCourse"
               :nextCourse="nextCourse"
               :inCourse="inCourse"></clock>
      </div>
      <div class="main-c3">
        <attendance :currentCourse="currentCourse" :nextCourse="nextCourse"></attendance>
      </div>
    </div>
  </div>
</template>
<script>
import timeUtil from "@/util/timeUtil";
import ls from "@/store/ls";
import service from "@/api/services";
import {msg} from "@/components/message";
import ClassroomInfo from "@/views/home/components/ClassroomInfo";
import Clock from "@/views/home/components/Clock";
import Attendance from "@/views/home/components/Attendance";
import mitt from "@/util/mitt";

export default {
  name: 'HomePage',
  components: {ClassroomInfo, Clock, Attendance},
  data() {
    return {
      terminalId: null,
      currentCourse: {},
      nextCourse: {},
      inCourse: false, // 当前时间是否在课节内
      curriculumData: [],
      endOfClassText: '空闲中',
      terminalInfo: {},
      countDownInterval: null,
      flag: false,
      windowStyle: {
        transform: 'translateX(0)'
      }
    };
  },
  created() {
    mitt.on('courseStatus', this.scrollWindow)
  },
  mounted() {
    this.terminalId = ls.get('terminalId');
    if (this.terminalId) {
      this.getDailyCurriculum();
      mitt.emit('showBgLogo', true)
      this.countDownInterval = setInterval(() => {
        this.resolveData()
        if (this.currentCourse.courseId) {
          mitt.emit('showBgLogo', false)
          this.windowStyle.transform = 'translateX(-50vw)';
        }
      }, 2e3);
      this.getTerminalInfo();
    } else {
      msg({
        message: '请先在设置中绑定班级！'
      });
    }
  },
  beforeUnmount() {
    mitt.emit('showBgLogo', false)
    mitt.off('courseStatus', this.scrollWindow)
    if (this.countDownInterval !== null) {
      clearInterval(this.countDownInterval)
      this.countDownInterval = null;
    }
  },
  methods: {
    getTerminalInfo() {
      service.post('classCard/terminalInfo', {
        id: this.terminalId
      }).then(res => {
        this.terminalInfo = res.data ? res.data : {};
        ls.set('terminalInfo', this.terminalInfo);
      })
    },
    getDailyCurriculum() {
      service.post('classCard/dailyCurriculum', {
        id: this.terminalId
      }).then(res => {
        this.curriculumData = res.data;
        this.resolveData();
        if (this.currentCourse.courseId) {
          this.windowStyle.transform = 'translateX(-50vw)';
        }
      });
    },
    resolveData() {
      const len = this.curriculumData.length;
      for (let i = 0; i < len; i++) {
        let item = this.curriculumData[i];
        // 当前课程的开始结束 小时和分钟数
        item.startTime = timeUtil.sourceToTime(item.startSource);
        item.endTime = timeUtil.sourceToTime(item.endSource);
        // 下节课的开始结束小时分钟数
        let nextItem = this.curriculumData[i + 1];
        if (nextItem) {
          nextItem.startTime = timeUtil.sourceToTime(nextItem.startSource);
          nextItem.endTime = timeUtil.sourceToTime(nextItem.endSource);
        }
        // 当前时间
        const {hour, minute, second, currentSource} = timeUtil.getNowTime();
        if (item.startSource <= currentSource && item.endSource >= currentSource) {
          // 上课中
          this.currentCourse = JSON.parse(JSON.stringify(item));
          this.nextCourse = nextItem ? JSON.parse(JSON.stringify(nextItem)) : {};
          // 减去秒数  把误差控制在1s以内
          ls.set('currentCourse', item, (item.endSource - (hour * 60 + minute)) * 60 * 1000 - second * 1000);
          this.inCourse = true;
          break;
        } else if ((item.endSource < currentSource && currentSource < nextItem.startSource) ||
            (i === 0 && currentSource < item.startTime)) {
          // 课间 或者 第一节课前
          this.currentCourse = {};
          this.nextCourse = JSON.parse(JSON.stringify(nextItem));
          this.inCourse = false;
          ls.remove('currentCourse');
          break;
        } else {
          // 一天的课上完了
          this.currentCourse = {};
          this.nextCourse = {};
          this.inCourse = false;
          ls.remove('currentCourse');
        }
      }
    },
    goPage(pageName) {
      this.$router.push({
        name: pageName
      });
    },
    scrollWindow(status) {
      if (status === 2 || status === 4) {
        if (status === 4 && this.windowStyle.transform === 'translateX(0)') {
          // 如果为课前考勤， 且考勤界面已经显示
          mitt.emit('startSignIn')
        }
        mitt.emit('showBgLogo', false)
        this.windowStyle.transform = 'translateX(-50vw)';
      } else {
        this.windowStyle.transform = 'translateX(0)';
        mitt.emit('showBgLogo', true)
      }
    }
  }
}
</script>
