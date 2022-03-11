<style lang="stylus" scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;

}

.main-left {
  margin-right: 1rem;
  flex: 1;
}

.main-left-bottom {
  width: fit-content;
  margin-top: 1rem;
  border-radius: 1rem;
  padding: .25rem 1rem;
  background: rgb(146 148 171 / 70%);
}

.location-logo {
  font-size: 2rem;
  color: #ffd400;
}

.main-right {
  flex: 1;
}
</style>
<template>
  <div class="main">
    <div class="main-left">
      <component :is="leftComponentName" :terminalInfo="terminalInfo"></component>
    </div>
    <div class="main-right">
      <component :is="rightComponentName" :currentCourse="currentCourse" :nextCourse="nextCourse"
                 :inCourse="inCourse" ></component>
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

export default {
  name: 'HomePage',
  components: {
    ClassroomInfo,
    Clock
  },
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
      leftComponentName: 'ClassroomInfo',
      rightComponentName: 'Clock',
      flag: false
    };
  },
  created() {
  },
  mounted() {
    this.terminalId = ls.get('terminalId');
    if (this.terminalId) {
      this.getDailyCurriculum();
      this.countDownInterval = setInterval(() => {
        this.resolveData()
      }, 6e4);
      this.terminalInfo = ls.get('terminalInfo');
    } else {
      msg({
        message: '请先在设置中绑定班级！'
      });
    }
  },
  beforeUnmount() {
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
          this.currentCourse = item;
          this.nextCourse = nextItem;
          // 减去秒数  把误差控制在1s以内
          ls.set('currentCourse', item, (item.endSource - (hour * 60 + minute)) * 60 * 1000 - second * 1000);
          this.inCourse = true;
        } else if ((item.endSource < currentSource && currentSource < nextItem.startSource) ||
            (i === 0 && currentSource < item.startTime)) {
          // 课间 或者 第一节课前
          this.currentCourse = {};
          this.nextCourse = nextItem;
          this.inCourse = false;
          ls.remove('currentCourse');
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
    }
  }
}
</script>
