<style lang="stylus" scoped>
.main
  padding: 0 1rem;
  get_font_color(font_color)

  .top
    height: 80%
    margin-bottom: .5rem
    margin-top: .5rem
    display flex

    .top-left
      flex: 1
      margin-right: 10px
      display flex
      .device-list
        width 30%
        margin-left:1rem;
        height: 100%
        overflow-y scroll
        .device-item
          height: 5rem
          margin-bottom: 1rem
    .top-right
      width: 24%

      .course-info
        min-height 60%
        max-height: 13rem;
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
    //display none
    padding: .5rem;
    border-radius 8px
    get_background(patrol_bottom_background)
    display flex

    .form-select
      margin-right: 1rem
      min-width: 8rem;
      width: fit-content;
      padding-right: 1rem;
</style>
<template>
  <div class="main">
    <div class="top">
      <div class="top-left">
        <div style="flex: 1;">
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
      this.campus = [
        {
          "parent": null,
          "children": [
            {
              "parent": {
                "id": 6669935,
                "label": "杭州校区"
              },
              "children": [
                {
                  "parent": {
                    "id": 6669941,
                    "label": "行政楼"
                  },
                  "children": [
                    {
                      "parent": {
                        "id": 6669944,
                        "label": "1L"
                      },
                      "id": 6669946,
                      "label": "101-金智（会议室1800壁挂机）",
                      "$type": "terminal"
                    },
                    {
                      "parent": {
                        "id": 6669944,
                        "label": "1L"
                      },
                      "id": 6669949,
                      "label": "103-云智（样板间后墙飞机头）",
                      "$type": "terminal"
                    },
                    {
                      "parent": {
                        "id": 6669944,
                        "label": "1L"
                      },
                      "id": 6669954,
                      "label": "102-睿智（样板间前墙飞机头）",
                      "$type": "terminal"
                    },
                    {
                      "parent": {
                        "id": 6669944,
                        "label": "1L"
                      },
                      "id": 10123262,
                      "label": "测试",
                      "$type": "terminal"
                    }
                  ],
                  "$more": false,
                  "id": 6669944,
                  "label": "1L",
                  "$type": "terminalCategory"
                }
              ],
              "$more": false,
              "id": 6669941,
              "label": "行政楼",
              "$type": "terminalCategory"
            },
            {
              "parent": {
                "id": 6669935,
                "label": "杭州校区"
              },
              "children": [
                {
                  "parent": {
                    "id": 6669983,
                    "label": "4号楼"
                  },
                  "children": [
                    {
                      "parent": {
                        "id": 6669991,
                        "label": "1L"
                      },
                      "id": 6669999,
                      "label": "101-报告厅拼接屏",
                      "$type": "terminal"
                    },
                    {
                      "parent": {
                        "id": 6669991,
                        "label": "1L"
                      },
                      "id": 6670003,
                      "label": "102-大风实验室",
                      "$type": "terminal"
                    },
                    {
                      "parent": {
                        "id": 6669991,
                        "label": "1L"
                      },
                      "id": 10220449,
                      "label": "103-阶梯教室展示区",
                      "$type": "terminal"
                    },
                    {
                      "parent": {
                        "id": 6669991,
                        "label": "1L"
                      },
                      "id": 10220451,
                      "label": "104-功能教室展示区（融合屏）",
                      "$type": "terminal"
                    }
                  ],
                  "$more": false,
                  "id": 6669991,
                  "label": "1L",
                  "$type": "terminalCategory"
                }
              ],
              "$more": false,
              "id": 6669983,
              "label": "4号楼",
              "$type": "terminalCategory"
            }
          ],
          "$more": false,
          "id": 6669935,
          "label": "杭州校区",
          "$type": "terminalCategory",
          "$hasChildren": true
        }
      ]
    },
    getDeviceList() {
      this.devices = [
        {
          "cameraHasAudio": null,
          "cameraAccount": null,
          "ip": null,
          "label": null,
          "type": {
            "id": 2,
            "label": "电脑"
          },
          "cameraPassword": null,
          "cameraHttpFlvPlayUrl": null,
          "hardwareId": "14b31f1b6f62",
          "port": null,
          "cameraRtmpPlayUrl": null,
          "id": 8263008,
          "cameraPlayUrl": null,
          "workstatus": {
            "id": 2,
            "label": "工作正常"
          }
        },
        {
          "cameraHasAudio": false,
          "cameraAccount": null,
          "ip": null,
          "label": "学生全景",
          "type": {
            "id": 5,
            "label": "摄像头"
          },
          "cameraPassword": null,
          "cameraHttpFlvPlayUrl": "https://192.168.5.203:9501/live?port=1985&app=live&stream=hik-com6669210-dev9958203",
          "hardwareId": null,
          "port": null,
          "cameraRtmpPlayUrl": "rtmp://192.168.5.203:1985/live/hik-com6669210-dev9958203",
          "id": 9958203,
          "cameraPlayUrl": "rtsp://192.168.5.204:554/live/ch4_1",
          "workstatus": {
            "id": 2,
            "label": "工作正常"
          }
        }
      ];
      this.setItemActive(this.devices[0]);
    },
    setItemActive(item) {
      this.activeDevice = item;
    },
    selectTerminal() {
      if (this.schoolInfo.terminal !== -1) {
        this.terminalId = this.schoolInfo.terminal
        // this.getDailyCurriculum()
        // this.getDeviceList()
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
                this.schoolInfo.campus = cam.id;
                this.schoolInfo.category = cat.id;
                this.schoolInfo.floor = flo.id;
                this.schoolInfo.terminal = ter.id;
              }
            })
          })
        })
      })
    }
  }
}
</script>

