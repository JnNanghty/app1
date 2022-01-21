<style scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-left {
  margin-right: 2.5rem;
  color: #ffffff;
  min-width: 35%;
}

.main-left-top {

}

.classroom-location {
  font-size: 1.6rem;
  font-weight: 600;
}

.main-left-middle {
  margin-top: 1rem;
  padding-left: 1rem;
  position: relative;
  font-size: 1.5rem;
  margin-left: .5rem;
}

.main-left-middle::before {
  content: '';
  display: block;
  width: .5rem;
  height: 100%;
  background: #ff006a;
  position: absolute;
  left: 0;
  top: 0;
}

.main-left-bottom {
  width: fit-content;
  margin-top: 1rem;
  border-radius: 1rem;
  padding: .25rem 1rem;
  background: rgb(146 148 171 / 70%);
}

ion-content {
  background: none;
}

.location-logo {
  font-size: 2rem;
  color: #ffd400;
}

.main-right {
  color: #ffffff;
}
</style>
<template>
  <div class="main">
    <div class="main-left">
      <div class="main-left-top">
        <van-icon class="location-logo" name="location" />
        <span class="classroom-location">{{ terminalInfo && terminalInfo.label }}</span>
      </div>
      <div class="main-left-middle">
        <template v-if="currentCourse.courseId || currentCourse.courseNumber">
          <div>{{ currentCourse.startTime }} - {{ currentCourse.endTime }} <span v-show="showComing">(即将开始)</span></div>
          <div>{{ currentCourse.courseName }} | {{ currentCourse.teacherName }}</div>
        </template>
        <template v-else>
          <div>
            空闲
          </div>
        </template>
      </div>
      <div class="main-left-bottom">
        <template v-if="nextCourse.courseId || nextCourse.courseNumber">
          NEXT -> {{ nextCourse.startTime }}-{{ nextCourse.endTime }} -> {{ nextCourse.courseName }} ->
          {{ nextCourse.teacherName }}
        </template>
        <template v-else>
          NEXT -> 空闲
        </template>
      </div>
    </div>
    <div class="main-right">
      <div @click="goPage('ExamMode')"></div>
      <div>
        {{ endOfClassText }}
      </div>
    </div>
  </div>
</template>
<script>
import timeUtil from "@/util/timeUtil";
import ls from "@/store/ls";
import service from "@/api/services";
// import mitt from "@/util/mitt";
import {msg} from "@/components/message";

export default {
  name: 'HomePage',
  data() {
    return {
      terminalId: null,
      currentCourse: {},
      nextCourse: {},
      showComing: false,
      curriculumData: [],
      endOfClassText: '空闲中',
      terminalInfo: {},
      countDownInterval: null,
    };
  },
  mounted() {
    // mitt.on('refresh', this.refresh);

    this.terminalId = ls.get('terminalId');
    if (this.terminalId) {
      this.getDailyCurriculum();
      this.countDownInterval = setInterval(() => {
        this.endOfClassTime();
      }, 1e3);
      this.terminalInfo = ls.get('terminalInfo');
    } else {
      msg({
        message: '请先在设置中绑定班级！'
      });
    }
  },
  beforeDestroy() {
    if (this.countDownInterval !== null) {
      clearInterval(this.countDownInterval)
      this.countDownInterval = null;
    }
  },
  methods: {
    getDailyCurriculum() {
      service.post('classCard/dailyCurriculum', {
        id: this.terminalId
      }).then(res => {
        this.curriculumData = res.data;
        this.resolveData();
      });
    },
    endOfClassTime() {
      let text = '空闲中';
      let endTime = new Date();
      const now = Date.now();
      if ((this.currentCourse.courseId || this.currentCourse.courseNumber) && this.currentCourse !== this.nextCourse) {
        // 有当前课程  且不在下课期间
        endTime.setHours(Math.floor(this.currentCourse.endSource / 60));
        endTime.setMinutes(this.currentCourse.endSource % 60);
        endTime.setSeconds(0);
        const time = Math.floor((endTime.getTime() - now) / 1000); // 秒
        const second = time % 60;
        let minute = Math.floor(time / 60) % 60;
        let hour = Math.floor(time / 60 / 60);
        text = `距离下课${timeUtil.one2two(hour)}:${timeUtil.one2two(minute)}:${timeUtil.one2two(second)}`;
      } else {
        // 没有当前课程  那么就要计算并修改当前课程
        this.resolveData()
      }
      this.endOfClassText = text;
    },
    resolveData() {
      const len = this.curriculumData.length;
      for (let i = 0; i < len; i++) {
        let item = this.curriculumData[i];

        const sh = Math.floor(item.startSource / 60);
        const sm = item.startSource % 60;
        item.startTime = timeUtil.one2two(sh) + ':' + timeUtil.one2two(sm);
        const eh = Math.floor(item.endSource / 60);
        const em = item.endSource % 60;
        item.endTime = timeUtil.one2two(eh) + ':' + timeUtil.one2two(em);


        let nextItem = this.curriculumData[i + 1];
        const nsh = (nextItem && Math.floor(nextItem.startSource / 60)) || 0;
        const nsm = (nextItem && (nextItem.startSource % 60)) || 0;
        nextItem && (nextItem.startTime = timeUtil.one2two(nsh) + ':' + timeUtil.one2two(nsm));
        const neh = (nextItem && Math.floor(nextItem.endSource / 60)) || 0;
        const nem = (nextItem && (nextItem.endSource % 60)) || 0;
        nextItem && (nextItem.endTime = timeUtil.one2two(neh) + ':' + timeUtil.one2two(nem));


        const {hour, minute, second} = timeUtil.getNowTime();
        if ((
            (sh !== eh) && (
                (hour === sh && minute >= sm) ||
                (hour > sh && hour < eh) ||
                (hour === eh && minute <= em)
            )) || (
            (sh === eh) && (
                (hour === sh && minute >= sm && minute <= em)
            ))) {
          this.currentCourse = item;
          this.nextCourse = nextItem;
          ls.set('currentCourse', item, (item.endSource - (hour * 60 + minute)) * 60 * 1000 - second * 1000);
          this.showComing = false;
          break;
        } else if ((
                (eh === nsh) &&
                (hour === eh && minute > em && minute < nsm)
            ) ||
            (eh !== nsh) && (
                (hour === eh && minute > em) ||
                (hour > eh && hour < nsh) ||
                (hour === nsh && minute < nsm)
            )) {
          // 课间
          this.currentCourse = nextItem;
          this.nextCourse = nextItem;
          this.showComing = true;
          ls.set('currentCourse', nextItem, (nextItem.endSource - (hour * 60 + minute)) * 60 * 1000 - second * 1000);
          break;
        }
      }
    },
    goPage(pageName) {
      this.$router.push({
        name: pageName
      });
    },
    refresh() {
      this.terminalId = ls.get('terminalId');
      if (this.terminalId) {
        this.getDailyCurriculum();

        if (this.countDownInterval !== null) {
          clearInterval(this.countDownInterval)
          this.countDownInterval = null;
        }
        this.countDownInterval = setInterval(() => {
          this.endOfClassTime();
        }, 1e3);

        this.terminalInfo = ls.get('terminalInfo');
      }
    }
  }
}
</script>
