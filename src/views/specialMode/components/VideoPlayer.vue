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
  font-size: .9rem;
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
      <div style="width: 100%; height: 100%">
        <video :id="elementId" v-if="isFlvPlayer" class="video-js"
               style="width: 100%; height: 100%; object-fit: fill" autoplay></video>
        <video :id="elementId" v-if="isVideoPlayer" style="width:100%;height:100%; object-fit:fill;"
               class="video-js"></video>
      </div>
    </div>
  </div>
</template>
<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-flash';
import flvjs from 'flv.js'

const VIDEO_TYPE_REGEX = {
  'application/x-mpegURL': /\.(m3u8|ts)/,
  'video/mp4': /\.mp4/,
  'video/webm': /\.webm/,
  'video/ogg': /\.ogv/,
  'rtmp/flv': /rtmp/
};
export default {
  name: 'VideoPlayer',
  props: {
    camera: {
      type: Object,
      required: true
    },
    controls: {
      type: Boolean,
      required: false,
      default: true
    },
    video: {
      type: String,
      required: true
    }
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
    // video id
    elementId: function () {
      return `video_${this.camera.id}_${this.timestamp}`;
    },
    isFlvPlayer: function () {
      return !!(this.camera && this.camera.cameraHttpFlvPlayUrl);
    },
    isVideoPlayer: function () {
      return !!(!this.isFlvPlayer && (this.camera.cameraPlayUrl));
    },
  },
  methods: {
    init() {
      this.$nextTick(() => {
        if (this.camera.cameraHttpFlvPlayUrl) {
          console.log('this.camera.cameraHttpFlvPlayUrl')
          console.log(this.camera.cameraHttpFlvPlayUrl)
          this.initFlvPlayer();
        } else if (this.camera.cameraPlayUrl) {
          console.log('this.camera.cameraPlayUrl')
          console.log(this.camera.cameraPlayUrl)
          this.initVideoPlay();
        }
      });
    },
    initFlvPlayer() {
      let options = {
        type: 'flv',
        hasVideo: true,
        hasAudio: true,
        url: this.camera.cameraHttpFlvPlayUrl,
        enableWorker: false,
        lazyLoadMaxDuration: 3 * 60,
        seekType: 'range',
        autoplay: true,
      };

      let player = flvjs.createPlayer(options, {
        enableWorker: false,
        lazyLoadMaxDuration: 3 * 60,
        seekType: 'range'
      });
      try {
        player.videoEle = document.getElementById(this.elementId);
        player.videoEle.controls = true;

        player.attachMediaElement(player.videoEle);
        player.load();
        // 属性静音 或者本身静音 都是静音状态
        player.muted = false;
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
        muted: false,
        preload: 'auto'
      };
      let self = this;
      this.player = videojs(this.elementId, video_options, function onPlayerReady() {
        let src = {
          src: self.camera.cameraPlayUrl
        };
        let keys = Object.keys(VIDEO_TYPE_REGEX);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          if (VIDEO_TYPE_REGEX[key].exec(this.video)) {
            src.type = key;
            break;
          }
        }
        this.src(src);
        this.play();
      });
    },
    destroyPlayer() {
      if (!this.player) {
        return;
      }
      if (this.player instanceof flvjs.FlvPlayer) {
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
    this.destroyPlayer()
  }
};
</script>

