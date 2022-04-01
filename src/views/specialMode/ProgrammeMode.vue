<style lang="stylus" scoped>
.main
  width: 100%
  height: 100vh
  box-sizing border-box
  get_font_color(font_color)
  position relative

  .full
    width: 100%
    height: 100vh;

  .text-content
    overflow scroll
    font-weight 1rem;
    display flex
    justify-content center
    align-items center

  .back-button
    position absolute
    left: 0
    bottom: 1rem;
    height: 10rem
    z-index 100

    img
      height 100%
</style>
<template>
  <div class="main">
    <template v-if="programmeData.type.id === 1">
      <!--      <video class="full" :src="playUrl"></video>-->
      <camera-player :camera="camera"></camera-player>
    </template>
    <template v-else>
      <div class="full text-content" v-html="programmeData.content"></div>
    </template>
    <div class="back-button" @click="$router.back">
      <img src="../../assets/back_button.png" alt="">
    </div>
  </div>
</template>

<script>
import ls from "@/store/ls";
import fileService from "@/util/fileService";
import CameraPlayer from "@/views/patrol/components/CameraPlayer";

export default {
  components: {CameraPlayer},
  data() {
    return {
      programmeData: {
        content: '',
        id: -1,
        label: '节目',
        resource: {
          downloadUrl: '',
          id: -2,
          label: ''
        },
        type: {
          id: 1,
          label: ''
        }
      },
      camera: {
        type: {id: 5},
        workstatus: {id: 2},
        controls: false,
        muted: true,
        cameraPlayUrl: '',
        cameraRtmpPlayUrl: '',
        cameraHttpFlvPlayUrl: '',
        cameraHasAudio: false
      }
    }
  },
  created() {
    const data = this.$route.params.data;
    this.programmeData = JSON.parse(data);
    if (this.programmeData.type.id === 1) {
      this.getPlayUrl();
    }
  },
  mounted() {
  },
  methods: {
    getPlayUrl() {
      fileService.getFile(this.programmeData.resource.downloadUrl, '', 'hzmaijie-personspace').then(url => {
        console.log(url);
        if (this.getFileType() === 'flv') {
          this.camera.cameraHttpFlvPlayUrl = url;
        } else {
          this.camera.cameraPlayUrl = url;
        }
      })
    },
    getFileType(url) {
      let index = url.lastIndexOf('.');
      return url.slice(index + 1);
    },
  }
}
</script>
