<style scoped>
.main {
  padding: 0 20px;
}

.main-content {
  display: flex;
  height: 100%;
  padding: 1.5rem;
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
  width: 15rem;
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
        <div class="main-video-label">
          教师画面
        </div>
        <camera-player></camera-player>
      </div>
      <div class="right-content">
        <div class="course-info">
          <div class="course-info-item">
            <div class="course-info-item-label">课程名称</div>
            <div class="course-info-item-value">-</div>
          </div>
          <div class="course-info-item">
            <div class="course-info-item-label">上课节次</div>
            <div class="course-info-item-value">-</div>
          </div>
          <div class="course-info-item">
            <div class="course-info-item-label">教师名称</div>
            <div class="course-info-item-value">-</div>
          </div>
          <div class="course-info-item">
            <div class="course-info-item-label">教师编号</div>
            <div class="course-info-item-value">-</div>
          </div>
          <div class="course-info-item">
            <div class="course-info-item-label">学院名称</div>
            <div class="course-info-item-value">-</div>
          </div>
          <div class="course-info-item">
            <div class="course-info-item-label">班级名称</div>
            <div class="course-info-item-value">-</div>
          </div>
        </div>
        <div class="video-list">
          <div class="video-item">
            <div class="video-item-label">电脑画面</div>
            <camera-player></camera-player>
          </div>
          <div class="video-item"></div>
          <div class="video-item">
            <camera-player></camera-player>
          </div>
          <div class="video-item"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CameraPlayer from "./components/CameraPlayer";

export default {
  data() {
    return {}
  },
  components: {
    CameraPlayer
  },
  mounted() {
  },
  methods: {}
}
</script>
