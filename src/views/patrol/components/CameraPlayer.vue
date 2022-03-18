<style scoped>
.wrapped-camera-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.camera-player-container {
  width: 100%;
  height: 100%;
}

.no-video {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #333;
  font-size: 18px;
  background-color: #999;
}

.no-video img {
  width: 72px;
  height: 72px;
}
</style>
<template>
  <div class="wrapped-camera-container">
    <div class="camera-player-container">
      <div v-if="(isFlvPlayer || isVideoPlayer) && !errorCamera" style="width: 100%; height: 100%">
        <video :id="elementId" v-if="isFlvPlayer" class="video-js"
               style="width: 100%; height: 100%; object-fit: fill" autoplay></video>
        <video :id="elementId" v-if="isVideoPlayer" style="width:100%;height:100%; object-fit:fill;"
               class="video-js"></video>
      </div>
      <p class="no-video" v-if="noCamera">
        <img alt="" src="../../../assets/icon_camera_off.png"/>
        <span>无摄像头设备</span>
      </p>
      <p class="no-video" v-if="errorCamera">
        <img alt="" src="../../../assets/icon_camera_off.png"/>
        <span>摄像头故障或无摄像头</span>
      </p>
    </div>
  </div>
</template>
<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-flash';
import service from "@/api/services";
import flvjs from 'flv.js'

const VIDEO_TYPE_REGEX = {
  'application/x-mpegURL': /\.(m3u8|ts)/,
  'video/mp4': /\.mp4/,
  'video/webm': /\.webm/,
  'video/ogg': /\.ogv/,
  'rtmp/flv': /rtmp/
};
export default {
  name: 'CameraPlayer',
  props: {
    camera: {
      type: Object,
      required: true
    },
    muted: {
      type: Boolean,
      required: false,
      default: true
    },
    controls: {
      type: Boolean,
      required: false,
      default: true
    },
  },
  data() {
    return {
      player: null,
      timestamp: Date.now()
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    noCamera: function() {
      return !this.camera.id;
    },
    /** 故障摄像头 */
    errorCamera: function() {
      return this.camera.cameraError || (this.camera.workstatus && this.camera.workstatus.id === 1);
    },
    // video id
    elementId: function() {
      return `video_${this.camera.id}_${this.timestamp}`;
    },
    isFlvPlayer: function() {
      return !!(this.camera && this.camera.cameraHttpFlvPlayUrl);
    },
    isVideoPlayer: function() {
      return !!(!this.isFlvPlayer && (this.camera.cameraRtmpPlayUrl || this.camera.cameraPlayUrl));
    },
  },
  methods: {
    init() {
      if (this.noCamera || this.errorCamera) {
        return;
      }
      this.$nextTick(() => {
        if (this.camera.cameraHttpFlvPlayUrl) {
          this.initFlvPlayer();
        } else if (this.camera.cameraRtmpPlayUrl || this.camera.cameraPlayUrl) {
          this.initVideoPlay();
        }
      });
    },
    initFlvPlayer() {
      let options = {
        type: 'flv',
        hasVideo: true,
        hasAudio: this.camera.cameraHasAudio || false,
        url: this.camera.cameraHttpFlvPlayUrl,
        enableWorker: false,
        lazyLoadMaxDuration: 3 * 60,
        seekType: 'range'
      };

      let player = flvjs.createPlayer(options, {
        enableWorker: false,
        lazyLoadMaxDuration: 3 * 60,
        seekType: 'range'
      });
      try {
        player.videoEle = document.getElementById(this.elementId);
        player.videoEle.controls = this.controls;
        player.canPlay = false;
        player.videoEle.addEventListener('canplay', () => {
          this.canPlayListener(player);
        });

        player.attachMediaElement(player.videoEle);
        player.load();
        // 属性静音 或者本身静音 都是静音状态
        player.muted = this.muted || !this.camera.cameraHasAudio;
        player.timeoutChecker = setTimeout(() => {
          if (player && !player.canPlay) {
            // 10s尚未第一次可播放 出现问题
            console.log('player source error');
            // 重置播放流
            service.post('device/camera/resetStream', {
              deviceId: this.camera.id
            });
            setTimeout(() => {
              this.resetCamera();
            }, 2000);
          } else if (player && player.canPlay) {
            console.log('player source working');
          }
        }, 10 * 1000);
        this.player = player;
      } catch (error) {
        // 防止初始化进行到一半的时候 组件被销毁
        console.log('组件已销毁');
      }
    },
    initVideoPlay() {
      let video_options = {
        controls: this.controls,
        autoplay: true,
        loop: false,
        muted: !this.camera.hasAudio || this.muted,
        preload: 'auto'
      };
      let self = this;
      this.player = videojs(this.elementId, video_options, function onPlayerReady() {
        let src = {
          src: self.camera.cameraRtmpPlayUrl || self.camera.cameraPlayUrl
        };
        let keys = Object.keys(VIDEO_TYPE_REGEX);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          if (VIDEO_TYPE_REGEX[key].exec(src.src)) {
            src.type = key;
            break;
          }
        }
        this.src(src);
        this.play();
      });
    },
    canPlayListener(player) {
      if (player) {
        player.canPlay = true;
        player.videoEle.removeEventListener('canplay', this.canPlayListener);
      }
    },
    resetCamera() {
      this.destroyPlayer();
      this.$nextTick(() => {
        this.init();
      });
    },
    destroyPlayer() {
      if (!this.player) {
        return;
      }
      if (this.player instanceof window.flvjs.FlvPlayer) {
        clearTimeout(this.player.timeoutChecker);
        this.player.unload();
        this.player.detachMediaElement();
        this.player.destroy();
      } else {
        this.player.dispose();
      }
      this.player = null;
    }
  },
  beforeUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>

