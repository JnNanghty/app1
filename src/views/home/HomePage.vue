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
        <attendance :nextCourse="nextCourse"></attendance>
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
      terminalId: 6669946,
      currentCourse: {},
      nextCourse: {},
      inCourse: false, // 当前时间是否在课节内
      curriculumData: [],
      endOfClassText: '空闲中',
      terminalInfo: {
        address: null,
        alarmStatus: 1,
        builtin: null,
        canBorrow: true,
        companyId_: 6669210,
        config: null,
        createTime: "2021-08-12T00:09:26.000Z",
        creator: 6669930,
        deshiId: null,
        deshiIp: null,
        enableCoursePower: false,
        enableSelfInspect: true,
        favorite: null,
        group: null,
        id: 6669946,
        label: "101-金智",
        lastOnlineTime: "2022-03-24T03:57:31.000Z",
        lastUpdate_: 16480944677820000,
        parent: 6669944,
        remark: '管理员：王学军 188 0000 0000',
        repair: 6669284,
        scene: null,
        scenePhoto: "",
        seatCount: 120,
        showInControl: true,
        showInTour: true,
        sn: null,
        status: 3,
        things: null,
        thirdPartyType: null,
        threshold: null,
        type: 1,
      },
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
    // this.terminalId = ls.get('terminalId');
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
    getDailyCurriculum() {
      this.curriculumData = [
        {
          "teacherName": "俞嘉陈",
          "courseId": 10775141,
          "college": "工程造价学院",
          "courseClass": "造价19-6",
          "courseName": "BIM图形算量实务",
          "courseNumber": "(2020-2021-2)-22533020-000103-1",
          "startSource": 480,
          "endSource": 520
        },
        {
          "teacherName": "俞嘉陈",
          "courseId": 10775141,
          "college": "工程造价学院",
          "courseClass": "造价19-6",
          "courseName": "BIM图形算量实务",
          "courseNumber": "(2020-2021-2)-22533020-000103-1",
          "startSource": 530,
          "endSource": 570
        },
        {
          "teacherName": null,
          "courseId": null,
          "college": null,
          "courseClass": null,
          "courseName": null,
          "courseNumber": null,
          "startSource": 580,
          "endSource": 620
        },
        {
          "teacherName": "李修强(经管)",
          "courseId": 10775124,
          "college": "工程造价学院",
          "courseClass": "造价20-7",
          "courseName": "BIM基础与实务",
          "courseNumber": "(2020-2021-2)-22005020-000116-1",
          "startSource": 630,
          "endSource": 665
        },
        {
          "teacherName": "李修强(经管)",
          "courseId": 10775124,
          "college": "工程造价学院",
          "courseClass": "造价20-7",
          "courseName": "BIM基础与实务",
          "courseNumber": "(2020-2021-2)-22005020-000116-1",
          "startSource": 670,
          "endSource": 770
        },
        {
          "teacherName": "应佐萍",
          "courseId": 10775117,
          "college": "工程造价学院",
          "courseClass": "房地产19-1",
          "courseName": "房地产经营管理",
          "courseNumber": "(2020-2021-2)-22026040-160125-1",
          "startSource": 780,
          "endSource": 820
        },
        {
          "teacherName": "应佐萍",
          "courseId": 10775117,
          "college": "工程造价学院",
          "courseClass": "房地产19-1",
          "courseName": "房地产经营管理",
          "courseNumber": "(2020-2021-2)-22026040-160125-1",
          "startSource": 830,
          "endSource": 870
        },
        {
          "teacherName": null,
          "courseId": null,
          "college": null,
          "courseClass": null,
          "courseName": null,
          "courseNumber": null,
          "startSource": 880,
          "endSource": 960
        },
        {
          "teacherName": null,
          "courseId": null,
          "college": null,
          "courseClass": null,
          "courseName": null,
          "courseNumber": null,
          "startSource": 970,
          "endSource": 1010
        },
        {
          "teacherName": null,
          "courseId": null,
          "college": null,
          "courseClass": null,
          "courseName": null,
          "courseNumber": null,
          "startSource": 1020,
          "endSource": 1070
        },
        {
          "teacherName": null,
          "courseId": null,
          "college": null,
          "courseClass": null,
          "courseName": null,
          "courseNumber": null,
          "startSource": 1080,
          "endSource": 1120
        },
        {
          "teacherName": null,
          "courseId": null,
          "college": null,
          "courseClass": null,
          "courseName": null,
          "courseNumber": null,
          "startSource": 1120,
          "endSource": 1190
        },
        {
          "teacherName": null,
          "courseId": null,
          "college": null,
          "courseClass": null,
          "courseName": null,
          "courseNumber": null,
          "startSource": 1205,
          "endSource": 1245
        },
      ]
      this.resolveData();
      if (this.currentCourse.courseId) {
        this.windowStyle.transform = 'translateX(-50vw)';
      }
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
          // 如果为课前考勤， 且考勤界面还没显示
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
