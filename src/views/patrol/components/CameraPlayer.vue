<style scoped>
.video-wrap {
  position: relative;
  /*width: 20rem;*/
  /*height: 10rem;*/
  width: 100%;
  height: 100%;
}
</style>
<template>
  <div class="video-wrap">
    <video style="width: 100%; height: 100%; object-fit: fill" class="video-js" ref="videoPlayer"></video>
  </div>
</template>
<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

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
    }
  },
  data() {
    return {
      player: null,
      options: {
        autoplay: true,
        controls: false,
        sources: [
          {
            src: 'http://vjs.zencdn.net/v/oceans.mp4',
            type: "video/mp4"
          }
        ]
      }
    };
  },
  mounted() {
    // http flv 就flv       rtmp  rtsp  都
    if (this.camera.cameraHttpFlvPlayUrl) {
      this.options.sources.type = 'flv';
    } else if (this.camera.cameraRtmpPlayUrl || this.camera.cameraPlayUrl) {
      this.options.sources.type = 'video/mp4';
    }
    this.init();
  },
  methods: {
    init() {
      this.player = videojs(this.$refs.videoPlayer, this.options, function() {
        // ready
      });
    }
  },
  beforeUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>

