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

export default {
  name: 'CameraPlayer',
  data() {
    return {
      player: null,
      options: {
        autoplay: true,
        controls: false,
        sources: [
          {
            src: "http://vjs.zencdn.net/v/oceans.mp4",
            type: "video/mp4"
          }
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.player = videojs(this.$refs.videoPlayer, this.options, function() {
        // ready
        console.log(this)
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

