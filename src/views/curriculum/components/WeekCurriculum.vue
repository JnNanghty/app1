<style scoped>
.week-curriculum-main {
  height: 100%;
  color: #ffffff;
}

.week-curriculum-nav {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
}

.week-curriculum-content {
  display: flex;
  height: calc(100% - 2rem);
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

ion-icon:active {
  color: #3a7be0;
}

.content {
  flex: 1;
  overflow: scroll;
}

.curriculum-table {
  display: grid;
  grid-template-columns: 4fr repeat(7, 3fr);
  grid-auto-rows: 2.5rem;
  text-align: center;
}

.table-item {
  border: 1px solid #ffffff;
}
</style>
<template>
  <div class="week-curriculum-main">
    <div class="week-curriculum-nav">第{{ currentWeek }}周</div>
    <div class="week-curriculum-content">
      <div class="pagination-button">
        <i  @click="changeWeek('pre')">←</i>
      </div>
      <div class="content">
        <div class="curriculum-table">
          <div class="table-item">课节时间</div>
          <div class="table-item" v-for="item in simplifyNumberArray" :key="item">星期{{ item }}</div>
          <div class="table-item" v-for="(item, index) in curriculum"
               :key="index" @click="selectItem(item, index)"
               :style="item && item.style">
            {{ item && item.label }}
          </div>
        </div>
      </div>
      <div class="pagination-button">
        <i @click="changeWeek('next')">→</i>
      </div>
    </div>
  </div>
</template>
<script>
import ls from "@/store/ls";
import {msg} from "@/components/message";
import service from "@/api/services";
import timeUtil from "@/util/timeUtil";

const simplifyNumberArray = ['一', '二', '三', '四', '五', '六', '日'];
export default {
  data() {
    return {
      terminalId: null,
      currentWeek: 1,
      sectionTime: [],
      curriculum: []
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
  methods: {
    getFirstWeek() {
      service.post('classCard/scheduleInfo', {
        id: this.terminalId
      }).then(res => {
        this.currentWeek = this.calcCurrentWeek(res.data.firstWeek);
        this.sectionTime = res.data.sessionSourceList.map(i => {
          const sh = Math.floor(i.startSource / 60);
          const sm = i.startSource % 60;
          const eh = Math.floor(i.endSource / 60);
          const em = i.endSource % 60;
          return `${timeUtil.one2two(sh)}:${timeUtil.one2two(sm)}-${timeUtil.one2two(eh)}:${timeUtil.one2two(em)}`;
        })
        this.getCurriculum();
      })
    },
    getCurriculum  () {
      service.post('course/terminalCurriculum', {
        id: this.terminalId,
        weekNo: this.currentWeek
      }).then(res => {
        let temp = [];
        // 空格子
        const sectionLen = this.sectionTime.length;
        this.sectionTime.forEach((i, j) => {
          temp.push({
            label: i,
            style: {
              gridRowStart: j + 2,
              gridRowEnd: j + 3,
              gridColumnStart: 1,
              gridColumnEnd: 2
            }
          });
        });
        let data = [];
        res.result.forEach((item, index) => {
          let temp = [];
          for (let i = 1; i <= sectionLen; i++) {
            let hasPush = false;
            item.forEach(course => {
              if (i >= course.startSession && i <= course.endSession) {
                temp.push(course);
                i = course.endSession;
                hasPush = true;
              }
            });
            !hasPush && temp.push({
              courseName: '',
              courseNumber: '',
              dayOfWeek: index + 1,
              startSession: i,
              endSession: i
            });
          }
          data.push(temp);
        })
        data.forEach((item, index) => {
          // index 是星期
          item.forEach(course => {
            temp.push({
              label: course.courseName,
              style: {
                gridRowStart: course.startSession + 1,
                gridRowEnd: course.endSession + 2,
                gridColumnStart: index + 2,
                gridColumnEnd: index + 3
              }
            });
          });
        });
        this.curriculum = temp;
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
    changeWeek(value) {
      if (!this.terminalId) {
        msg({
          message: '请先在设置中绑定班级！'
        });
        return;
      }
      if (value === 'pre') {
        this.currentWeek--;
        if (this.currentWeek < 1) {
          this.currentWeek = 1;
        }
      } else {
        this.currentWeek++;
        if (this.currentWeek > 19) {
          this.currentWeek = 19;
        }
      }
      this.getCurriculum();
    },
    selectItem(item, index) {
      console.log(item, index);
    }
  }
}
</script>
