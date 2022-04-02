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
    bottom: 3rem;
    height: 10rem
    z-index 100
    opacity 0.2

    img
      height 100%
</style>
<template>
  <div class="main">
    <template v-if="programmeData.type.id === 1">
      <video-player v-if="showVideo" :camera="camera" :video="programmeData.resource.downloadUrl"></video-player>
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
import fileService from "@/util/fileService";
import VideoPlayer from "@/views/specialMode/components/VideoPlayer";

export default {
  components: {VideoPlayer},
  data() {
    return {
      programmeData: {
        content: '',
        id: -1,
        label: '节目',
        resource: {
          downloadUrl: 'a.flv',
          id: -2,
          label: ''
        },
        type: {
          id: 1,
          label: ''
        }
      },
      camera: {
        controls: false,
        muted: true,
        cameraPlayUrl: null,
        cameraHttpFlvPlayUrl: 'https://hzmaijie-personspace.oss-cn-hangzhou.aliyuncs.com/aliyun/resource/6669282/%E4%B8%AA%E4%BA%BA%E6%96%87%E4%BB%B6%E5%A4%B9/1/test.flv?OSSAccessKeyId=STS.NSp6jHtEihPY5YvwQdzGUHU4M&Expires=1648809574&Signature=yDsxf4nOCmwGvYYI%2FnRGWG6YTQ4%3D&security-token=CAIS%2FQF1q6Ft5B2yfSjIr5DFfdD8mZpI35KyN3%2FHk1Exdsh5p5Cfrzz2IH5LdHhqA%2B4Wtfown2BW6foflqB4T5ZeXkfNd8coCgfzPJXmMeT7oMWQweEuqv%2FMQBq%2BaXPS2MvVfJ%2BKLrf0ceusbFbpjzJ6xaCAGxypQ12iN%2B%2Fi6%2FclFKN1ODO1dj1bHtxbCxJ%2FocsBTxvrOO2qLwThjxi7biMqmHIl2TIgtP7hkpzHtUOP1gej8IJP%2BdSteKrDRtJ3IZJyX%2B2y2OFLbafb2EZSkUMUq%2Fcn1vYaqWyZ4YrNXQYNvg%2F7NPHP6tB1Nwh%2FfbAzEKNfsOPmkvl1qjFmMS85GtEmGoABI39fQhPfDhS%2BbvSb2J%2BHEFTlGCsXKWdwjmyxkfVY1N53T0DNV%2FKdoggm%2FGLl%2F%2F3fM%2FZLftlMDzl8u5edQHveMprKkuWiu8ARxMF4vMZdTEXlWNxhhXBnHA0HPBnBxfcK1BpEAAqVyAzjpTtUlUx1dmeox00pAPwTa1V5GkjDajY%3D',
        cameraHasAudio: false,
        id: 1
      }
    }
  },
  created() {
    // const data = this.$route.params.data;
    // this.programmeData = JSON.parse(data);
    // if (this.programmeData.type.id === 1) {
    //   this.getPlayUrl();
    // }
  },
  computed: {
    showVideo() {
      return this.camera.cameraHttpFlvPlayUrl || this.camera.cameraPlayUrl
    }
  },
  mounted() {
  },
  watch: {},
  methods: {
    getPlayUrl() {
      fileService.getFile(this.programmeData.resource.downloadUrl, '', 'hzmaijie-personspace').then(url => {
        console.log(url)
        if (this.getFileType(this.programmeData.resource.downloadUrl) === 'flv') {
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
