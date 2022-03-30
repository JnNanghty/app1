<style lang="stylus" scoped>
.main
  padding: 0 1rem;
  get_font_color(font_color)

  .top
    height: 80%
    margin-bottom: .5rem
    display flex

    .top-left
      flex: 1
      margin-right: 0.75rem
      display flex
      .device-list
        width 30%
        margin-left: 0.25rem;
        height: 100%
        overflow-y scroll
        .device-item
          height: 5rem
          margin-bottom: 0.4rem
          border-radius .8rem;
          overflow: hidden;
    .top-right
      width: 24%
      display flex
      justify-content space-between
      flex-direction column

      .course-info
        flex: 1;
        box-sizing border-box
        overflow-y scroll
        margin-top: 1rem
        padding: .5rem;
        border-radius 8px
        get_background(patrol_course_info_background)

        .course-info-course-name
          font-size 1rem
          margin-bottom: 1rem

        .course-info-item
          font-size .8rem;
          margin-bottom: .5rem;

  .bottom
    padding: .5rem;
    border-radius 8px
    get_background(patrol_bottom_background)
    display flex

    .form-select
      margin-right: 1rem
      min-width: 7rem;
      width: fit-content;
      padding-right: 1rem;
      box-sizing border-box
</style>
<template>
  <div class="main">
    <div class="top">
      <div class="top-left">
        <div style="flex: 1;border-radius: .8rem;overflow: hidden;height: 15.84rem;">
          <template v-if="activeDevice.type.id === 5">
            <camera-player :camera="activeDevice"></camera-player>
          </template>
          <template v-else-if="activeDevice.type.id === 2">
            <computer-player :computer="activeDevice" :power="true"></computer-player>
          </template>
          <template v-else>
            <div></div>
          </template>
        </div>
        <div class="device-list" v-show="filterDevices.length > 0">
          <div class="device-item" v-for="item in filterDevices" :key="item.id" @click="setItemActive(item)">
            <template v-if="item.type.id === 5">
              <camera-player :camera="item"></camera-player>
            </template>
            <template v-else-if="item.type.id === 2">
              <computer-player :computer="item" :power="true"></computer-player>
            </template>
          </div>
        </div>
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
      <my-select class="form-select _select" :len="campus.length + 1" :value="schoolInfo.campus.label">
        <my-option @select="campusSelected({label: '请选择校区', value: -1})" value="-1" label="请选择校区"></my-option>
        <my-option @select="campusSelected" v-for="item in campus" :value="item.id" :label="item.label"></my-option>
      </my-select>
      <my-select class="form-select _select" :len="category.length + 1" :value="schoolInfo.category.label">
        <my-option @select="categorySelected({label: '请选择教学楼', value: -1})" value="-1" label="请选择教学楼"></my-option>
        <my-option @select="categorySelected" v-for="item in category" :value="item.id" :label="item.label"></my-option>
      </my-select>
      <my-select class="form-select _select" :len="floor.length + 1" :value="schoolInfo.floor.label">
        <my-option @select="floorSelected({label: '请选择楼层', value: -1})" value="-1" label="请选择楼层"></my-option>
        <my-option @select="floorSelected" v-for="item in floor" :value="item.id" :label="item.label"></my-option>
      </my-select>
      <my-select class="form-select _select" :len="terminal.length + 1" :value="schoolInfo.terminal.label" >
        <my-option @select="terminalSelected({label: '请选择教室', value: -1})" value="-1" label="请选择教室"></my-option>
        <my-option @select="terminalSelected" v-for="item in terminal" :value="item.id" :label="item.label"></my-option>
      </my-select>
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
        campus: {
          label: '请选择校区',
          value: -1
        }, // 校区
        category: {
          label: '请选择教学楼',
          value: -1
        }, // 教学楼
        floor: {
          label: '请选择楼层',
          value: -1
        }, // 楼层
        terminal: {
          label: '请选择教室',
          value: -1
        } // 教室
      },
      terminalId: null
    }
  },
  created() {
    this.currentCourse = ls.get('currentCourse') || {};
    this.terminalId = ls.get('terminalId')

    this.getTerminal();
    this.getDeviceList();
  },
  computed: {
    filterDevices() {
      return this.devices.filter(i => i.id !== this.activeDevice.id)
    },
    category() {
      let r = []
      this.campus.some(i => i.id === this.schoolInfo.campus.value && (r = i.children))
      return r
    },
    floor() {
      let r = []
      this.category.some(i => i.id === this.schoolInfo.category.value && (r = i.children))
      return r
    },
    terminal() {
      let r = []
      this.floor.some(i => i.id === this.schoolInfo.floor.value && (r = i.children))
      return r
    }
  },
  mounted() {
  },
  methods: {
    campusSelected(item) {
      this.schoolInfo.campus = item;
      this.schoolInfo.category = {label: '请选择教学楼', value: -1};
      this.schoolInfo.floor = {label: '请选择楼层', value: -1};
      this.schoolInfo.terminal = {label: '请选择教室', value: -1};
    },
    categorySelected(item) {
      this.schoolInfo.category = item
      this.schoolInfo.floor = {label: '请选择楼层', value: -1};
      this.schoolInfo.terminal = {label: '请选择教室', value: -1};
    },
    floorSelected(item) {
      this.schoolInfo.floor = item
      this.schoolInfo.terminal = {label: '请选择教室', value: -1};
    },
    terminalSelected(item) {
      this.schoolInfo.terminal = item
      this.selectTerminal()
    },
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
          this.setCurrentTerminal();
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
      service.post('model/getEntities', {
        target: 'device',
        filter: {
          relation: 'AND',
          children: [{
            field: 'terminal.id',
            match: 'EQ',
            value: this.terminalId
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
        this.terminalId = this.schoolInfo.terminal
        this.getDailyCurriculum()
        this.getDeviceList()
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
    },
    setCurrentTerminal() {
      // 根据当前的terminalId 找出对应的楼层教学楼校区等.
      this.campus.forEach(cam => {
        cam.children.forEach(cat => {
          cat.children.forEach(flo => {
            flo.children.forEach(ter => {
              if(ter.id === this.terminalId) {
                this.schoolInfo.campus = {
                  label: cam.label,
                  value: cam.id
                };
                this.schoolInfo.category = {
                  label: cat.label,
                  value: cat.id
                };
                this.schoolInfo.floor = {
                  label: flo.label,
                  value: flo.id
                };
                this.schoolInfo.terminal = {
                  label: ter.label,
                  value: ter.id
                };
              }
            })
          })
        })
      })
    }
  }
}
</script>

