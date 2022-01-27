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
  /*display: grid;*/
  /*grid-template-columns: 4fr repeat(7, 3fr);*/
  /*grid-auto-rows: 2.5rem;*/
  display: flex;
  text-align: center;
}

.table-item {
  border: 1px solid #ffffff;
}
.table-col{
  flex: 1;
}
.table-row{
  border: 1px solid #ffffff;
  min-height: 2.5rem;
  box-sizing: border-box;
}
</style>
<template>
  <div class="week-curriculum-main">
    <div class="week-curriculum-nav">第{{ currentWeek }}周</div>
    <div class="week-curriculum-content">
      <div class="pagination-button">
        <van-icon @click="changeWeek('pre')" name="arrow-left"/>
      </div>
      <div class="content">
        <div class="curriculum-table">
<!--          <div class="table-item">课节时间</div>-->
<!--          <div class="table-item" v-for="item in simplifyNumberArray" :key="item">星期{{ item }}</div>-->
<!--          <div class="table-item" v-for="(item, index) in curriculum"-->
<!--               :key="index" @click="selectItem(item, index)"-->
<!--               :style="item && item.style">-->
<!--            {{ item && item.label }}-->
<!--          </div>-->
          <div class="table-col">
            <div class="table-row">课节时间</div>
            <div class="table-row" v-for="(item, index) in sectionTime" :key="index">
              {{ item }}
            </div>
          </div>
          <div class="table-col" v-for="(item, index) in curriculum" :key="item">
            <div class="table-row">星期{{ simplifyNumberArray[index] }}</div>
            <div class="table-row" v-for="(course, courseIndex) in curriculum[index]"
                 :key="courseIndex" :style="course && course.style" @click="selectItem(course, courseIndex)">
              {{course && course.courseName}}
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-button">
        <van-icon @click="changeWeek('next')" name="arrow"/>
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
  data() {
    return {
      terminalId: null,
      currentWeek: 1,
      sectionTime: [],
      curriculum: [],
      simplifyNumberArray: ['一', '二', '三', '四', '五', '六', '日']
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
    getCurriculum() {
      // android webview 57 / chrome 57版本才实现 display:grid 所以以下代码需要改
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
                    height: (2.5 * (course.endSession - course.startSession + 1)) + 'rem'
                  }
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
              }
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
