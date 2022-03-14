<style lang="stylus" scoped>
.main
  padding: 0 1rem;
  get_font_color(font_color)

  .top
    height: 80%
    margin-bottom: 10px
    display flex

    .top-left
      flex: 1
      margin-right: 10px

    .top-right
      width: 30%

      .course-info
        min-height 60%
        margin-top: 1rem
        padding: 10px
        border-radius 8px
        get_background(patrol_course_info_background)

        .course-info-course-name
          font-size 16px;
          margin-bottom: 2rem

        .course-info-item
          font-size 12px;
          margin-bottom: 10px

  .bottom
    //display none
    padding: 10px
    border-radius 8px
    get_background(patrol_bottom_background)
    display flex

    .form-select
      width: 8rem
      margin-right: 1rem
</style>
<template>
  <div class="main">
    <div class="top">
      <div class="top-left">
        <template v-if="activeDevice.type.id === 5">
          <camera-player :camera="activeDevice"></camera-player>
        </template>
        <template v-else-if="activeDevice.type.id === 2">
          <computer-player :computer="activeDevice" :power="true"></computer-player>
        </template>
        <template v-else>
          <div>没有设备！</div>
        </template>
      </div>
      <div class="top-right">
        <user-info></user-info>
        <div class="course-info">
          <div class="course-info-course-name">{{ currentCourse.courseName }}</div>
          <div class="course-info-item">上课时间：{{ currentCourse.startTime }}-{{ currentCourse.endTime }}</div>
          <div class="course-info-item">任课老师：{{ currentCourse.teacherName }}</div>
          <div class="course-info-item">上课班级：{{ currentCourse.courseClass }}</div>
          <div class="course-info-item">开课学院：{{ currentCourse.college }}</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <select class="form-select _select" v-model="schoolInfo.campus">
        <option value="-1" label="请选择校区"></option>
        <option v-for="item in campus" :value="item.id" :label="item.label"></option>
      </select>
      <select class="form-select _select" v-model="schoolInfo.category">
        <option value="-1" label="请选择教学楼"></option>
        <option v-for="item in category" :value="item.id" :label="item.label"></option>
      </select>
      <select class="form-select _select" v-model="schoolInfo.floor">
        <option value="-1" label="请选择楼层"></option>
        <option v-for="item in floor" :value="item.id" :label="item.label"></option>
      </select>
      <select class="form-select _select" v-model="schoolInfo.terminal" @change="selectTerminal">
        <option value="-1" label="请选择教室"></option>
        <option v-for="item in terminal" :value="item.id" :label="item.label"></option>
      </select>
    </div>
  </div>
</template>

<script>
import ls from "@/store/ls";
import CameraPlayer from "./components/CameraPlayer";
import ComputerPlayer from "@/views/patrol/components/ComputerPlayer";
import {removeToken, setToken} from "@/util/auth";
import service from "@/api/services";
import {msg} from "@/components/message";
import timeUtil from "@/util/timeUtil";

export default {
  name: "Patrol",
  components: {CameraPlayer, ComputerPlayer},
  data() {
    return {
      currentCourse: {},
      devices: [],
      activeDevice: {
        id: null,
        type: {
          id: null
        }
      },
      campus: [],
      schoolInfo: {
        campus: -1, // 校区
        category: -1, // 教学楼
        floor: -1, // 楼层
        terminal: -1 // 教室
      },
    }
  },
  created() {
    this.currentCourse = ls.get('currentCourse') || {};
    this.getTerminal();
  },
  computed: {
    filterDevices() {
      return this.devices.filter(i => i.id !== this.activeDevice.id)
    },
    category() {
      let r = []
      this.campus.some(i => i.id === this.schoolInfo.campus && (r = i.children))
      return r
    },
    floor() {
      let r = []
      this.category.some(i => i.id === this.schoolInfo.category && (r = i.children))
      return r
    },
    terminal() {
      let r = []
      this.floor.some(i => i.id === this.schoolInfo.floor && (r = i.children))
      return r
    }
  },
  mounted() {
  },
  methods: {
    getTerminal() {
      return new Promise((resolve, reject) => {
        service.post('model/getEntityTree', {
          nodes: [{
            subnodes: [{
              type: 'terminal',
              filter: {
                field: 'parent',
                match: 'EQ',
                value: null
              }
            }, {
              type: 'terminalCategory',
              filter: {
                field: 'parent',
                match: 'EQ',
                value: null
              }
            }]
          }, {
            type: 'terminal'
          }, {
            type: 'terminalCategory',
            subnodes: [{
              type: 'terminal',
              filter: {
                field: 'parent',
                match: 'EQ',
                value: '$parentId'
              }
            }, {
              type: 'terminalCategory',
              filter: {
                field: 'parent',
                match: 'EQ',
                value: '$parentId'
              }
            }]
          }]
        }).then(res => {
          this.campus = res.list;
          resolve();
        }, () => {
          msg({
            message: '没有权限！请重新登录！'
          });
          removeToken()
          ls.remove('userInfo');
          reject();
        });
      })
    },
    getDeviceList() {
      setToken('6669282:61646D696E36363639323130:1647679075040:24AC842388F6952412B49B8BB74E47BD');
      service.post('model/getEntities', {
        target: 'device',
        filter: {
          relation: 'AND',
          children: [{
            field: 'terminal.id',
            match: 'EQ',
            value: ls.get('terminalId')
          }, {
            field: 'type',
            match: 'IN',
            value: [2, 5]
          }]
        },
        retFields: ["type", "ip", "hardwareId", "cameraAccount", "cameraPassword", "port",
          "cameraPlayUrl", "cameraRtmpPlayUrl", "cameraHttpFlvPlayUrl", "cameraHasAudio", "workstatus"]
      }).then(res => {
        this.devices = res.list;
        if (res.totalCount > 0) {
          this.setItemActive(this.devices[0]);
        }
      });
    },
    setItemActive(item) {
      this.activeDevice = item;
    },
    selectTerminal() {
      if (this.schoolInfo.terminal !== -1) {
        this.getDailyCurriculum()
      }
    },
    getDailyCurriculum() {
      service.post('course/terminalDailyCurriculum', {
        id: this.schoolInfo.terminal
      }).then(res => {
        // 计算正在上的课
        let now = Date.now();
        this.currentCourse = {}
        res.result.some(i => {
          let start = new Date(i.start)
          let end = new Date(i.end)
          if (now >= start && now <= end) {
            i.startTime = timeUtil.formatTime(i.start)
            i.endTime = timeUtil.formatTime(i.start)
            this.currentCourse = i;
          }
        })
      })
    }
  }
}
</script>

