<style scoped>
.main {
  padding: 0 20px;
}

.main-content {
  display: flex;
  height: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
}

.main-video {
  flex: 2;
  margin-right: 1rem;
  position: relative;
}

.main-video-label {
  position: absolute;
  top: 0;
  left: 0;
  color: #ffffff;
  font-size: 1rem;
  z-index: 10;
}

.right-content {
  flex: 1;
  overflow-y: scroll;
}

.course-info {
  margin-bottom: 10px;
}

.course-info-item {
  display: flex;
  text-align: center;
}

.course-info-item-label {
  margin-right: 5px;
  padding: 5px 10px;
}

.course-info-item-value {
  flex: 1;
}

.video-list {
}

.video-item {
  height: 7.5rem;
  border: 1px solid #000000;
  margin: 0.5rem auto;
  position: relative;
}

.video-item-label {
  position: absolute;
  top: 0;
  left: 0;
  color: #ffffff;
  font-size: .8rem;
  z-index: 10;
}
</style>
<template>
  <div class="main">
    <div class="main-content">
      <div class="main-video">
        <div class="main-video-label">{{ activeDevice.label }}</div>
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
      <div class="right-content">
        <div class="course-info">
          <div class="course-info-item">
            <div class="course-info-item-label">课程名称</div>
            <div class="course-info-item-value">{{ course.courseName || '-' }}</div>
          </div>
          <div class="course-info-item">
            <div class="course-info-item-label">上课时间</div>
            <div class="course-info-item-value">{{ course.startTime }} - {{ course.endTime }}</div>
          </div>
          <div class="course-info-item">
            <div class="course-info-item-label">教师名称</div>
            <div class="course-info-item-value">{{ course.teacherName || '-' }}</div>
          </div>
          <div class="course-info-item">
            <div class="course-info-item-label">学院名称</div>
            <div class="course-info-item-value">{{course.college || '-'}}</div>
          </div>
          <div class="course-info-item">
            <div class="course-info-item-label">班级名称</div>
            <div class="course-info-item-value">{{course.courseClass || '-'}}</div>
          </div>
        </div>
        <div class="video-list">
          <div class="video-item" v-for="item in filterDevices" :key="item.id" @click="setItemActive(item)">
            <div class="video-item-label">{{ item.label }}</div>
            <template v-if="item.type.id === 5">
              <camera-player :camera="item"></camera-player>
            </template>
            <template v-else-if="item.type.id === 2">
              <computer-player :computer="item" :power="true"></computer-player>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CameraPlayer from "./components/CameraPlayer";
import ComputerPlayer from "@/views/patrol/components/ComputerPlayer";
import ls from "@/store/ls";
import service from "@/api/services";
import {setToken} from "@/util/auth";

export default {
  data() {
    return {
      course: {},
      devices: [],
      activeDevice: {
        id: null,
        type: {
          id: null
        }
      }
    }
  },
  components: {
    CameraPlayer,
    ComputerPlayer
  },
  computed: {
    filterDevices() {
      return this.devices.filter(i => i.id !== this.activeDevice.id)
    }
  },
  created() {
    this.getDeviceList();
  },
  mounted() {
    this.course = ls.get('currentCourse');
  },
  methods: {
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
    }
  }
}
</script>
