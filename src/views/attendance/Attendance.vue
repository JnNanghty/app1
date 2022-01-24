<style scoped>
.main {
  position: relative;
}

.grid-content {
  width: 90%;
  height: 90%;
  padding-top: 3%;
  margin: 0 auto;
  color: #ffffff;
}

.row1 {
  height: 35%;
}

.course-info-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 1rem;
}

.course-info {
  font-size: 30px;
}

.course-info > ion-icon {
  color: #ffa700;
  margin-right: .5rem;
  position: relative;
  top: .25rem;
}

.time-info-content {
  display: flex;
}

.time-info {
  flex: 2;
  margin: .5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.qiandao-info {
  flex: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attendance-time {
  font-size: 1.5rem;
  color: #ffa700;
}

.qiandao {
  font-size: 1.25rem;
  text-align: center;
  margin-right: 1.5rem;
  margin-top: 1rem;
  position: relative;
}

.xiegang::after {
  content: '/';
  position: absolute;
  font-size: 1.5rem;
  right: -1rem;
  top: .75rem;
}

.row2 {
  height: 65%;
}

.row1, .row2 {
  display: flex;
}

.video, .qrcode {
  width: 80%;
  height: 60%;
  margin: 10% auto;
  background: #d72828;
}

.course-info-content,
.time-info-content,
.people-name-content,
.sign-in-content {
  background: #0024fd;
  margin: .5rem;
  border-radius: 10px;
}

.course-info-content,
.people-name-content {
  flex: 4
}

.time-info-content,
.sign-in-content {
  flex: 7
}

.people-name-content {
  display: flex;
  flex-direction: column;
  padding: .75rem;
}

.sign-in-content {
  display: flex;
  justify-content: space-around;
}

.qrcode-content, .ai-face {
  flex: 1;
  text-align: center;
}

.people-name {
  flex: 1;
}

.back-button {
  position: absolute;
  right: 3%;
  bottom: 15%;
  text-align: center;
  color: #ffa700;
}

</style>
<template>
  <div class="main" :style="{background: deviceConfig.background}">
    <div class="grid-content">
      <div class="row1">
        <div class="course-info-content">
          <div class="course-info">
            <i>课程名称</i>
            <span>{{ currentCourse.courseName }}</span>
          </div>
          <div class="course-info">
            <i>教师名称</i>
            <span>{{ currentCourse.teacherName }}</span>
          </div>
        </div>
        <div class="time-info-content">
          <div class="time-info">
            <div>考勤倒计时</div>
            <div class="attendance-time">不在考勤时间</div>
            <div>（考勤时间：{{ formatTime(attendanceInfo.lesson && attendanceInfo.lesson.start) || '-' }} -
              {{ formatTime(attendanceInfo.lesson && attendanceInfo.lesson.end) || '-' }}）
            </div>
          </div>
          <div class="qiandao-info">
            <div class="qiandao xiegang">应到<br>{{ attendanceInfo.students.length }}</div>
            <div class="qiandao xiegang">实到<br>{{ arrived.length }}</div>
            <div class="qiandao">未到<br>
              <span style="color: #ffa700">{{ notArrived.length }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="row2">
        <div class="people-name-content">
          <div class="people-name">
            已到：{{ arrivedStudents }}
          </div>
          <div class="people-name">
            未到：{{ notArrivedStudents }}
          </div>
        </div>
        <div class="sign-in-content">
          <div class="qrcode-content">
            <p>微信扫码签到</p>
            <div class="qrcode">
              二维码框框
            </div>
          </div>
          <div class="ai-face">
            <p>人脸识别签到</p>
            <div class="video">
              摄像头框框
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="back-button" @click="goBack">
      <i>HOME</i>
      <br>
      <span>回首页</span>
    </div>
  </div>
</template>

<script>
import ls from "@/store/ls";
import service from "@/api/services";
import {msg} from "@/components/message";
import timeUtil from '@/util/timeUtil';
import mitt from "@/util/mitt";

export default {
  data() {
    return {
      terminalId: null,
      currentCourse: {},
      deviceConfig: {
        background: 'url(' + require('../../assets/default_background.jpg') + ') 0/cover no-repeat'
      },
      attendanceInfo: {
        students: []
      },
      notArrived: [],
      arrived: []
    }
  },
  created() {
    this.currentCourse = ls.get('currentCourse');
  },
  mounted() {
    const config = ls.get('deviceConfig');
    const serviceUrl = ls.get('serviceUrl') || '';
    if (config.background) {
      this.deviceConfig.background = 'url(' + serviceUrl + config.background + ') 0/cover no-repeat';
    }
    if (this.terminalId && (this.currentCourse && this.currentCourse.courseId)) {
      this.startSign();
    }

    mitt.on('brushCard', this.brushCard);
  },
  computed: {
    arrivedStudents() {
      return this.mergeText(this.arrived)
    },
    notArrivedStudents() {
      return this.mergeText(this.notArrived);
    }
  },
  methods: {
    brushCard(ic) {
      service.post('classCard/signIn', {
        ic,
        lessonId: this.attendanceInfo.id
      }).then(res => {
        msg({
          message: res.data.label + ',' + res.data.message + '!'
        }); // xxx 签到成功  重复签到  迟到   签到未开始
        if (res.data.message !== '重复签到' || res.data.message !== '签到未开始') {
          this.notArrived = this.notArrived.filter(item => {
            if (item.label === res.data.label) {
              this.arrived.push(item);
              return false;
            } else {
              return true;
            }
          });
        }
      })
    },
    startSign() {
      service.post('classCard/startSignIn', {
        courseId: this.currentCourse.courseId,
        terminalId: this.terminalId,
        startSource: this.currentCourse.startSource,
        endSource: this.currentCourse.endSource
      }).then(res => {
        this.attendanceInfo = res.data;
        res.data.students.forEach(s => {
          if (s.signInTime) {
            this.arrived.push(s);
          } else {
            this.notArrived.push(s)
          }
        })
        msg({
          message: '开始签到！'
        })
      })
    },
    mergeText(array = []) {
      let text = '';
      array.forEach(i => {
        text += i.label + '、';
      });
      return text.slice(0, -1);
    },
    goBack() {
      this.$router.push({
        name: 'Home'
      })
    },
    formatTime(time) {
      return timeUtil.formatTime(time);
    }
  }
}
</script>
