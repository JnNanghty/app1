<style lang="stylus" scoped>
.main
  get_font_color(font_color)
  padding: 1rem 2rem;
  box-sizing border-box
  overflow-y: scroll;

  .info-item
    display flex
    padding: 1rem
    overflow: hidden;
    box-sizing border-box
    width: 100%

    .info-time
      margin-right: 2rem

    .info-content
      font-size .8rem
      flex 1;
      padding: .6rem
      width: 100%

      .info-title
        font-size: .7rem;
        margin-bottom: .5rem;

      .info-desc
        font-size: .6rem
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        width: 80%

.first-info
  display flex
  border-bottom 2px solid #272727
  padding-bottom: 1rem

  .first-info-image
    margin-right: 1rem

    img
      border-radius .4rem;
      width: 9.15rem
      height: 6.1rem

  .first-info-desc
    font-size .7rem;

    .first-info-time
      color #FDA45E
      margin-bottom: .65rem

    .first-info-title
      font-weight 700
      margin-bottom: .4rem

    .first-info-summary
      font-size .6rem
      opacity 0.6
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: .35rem

    .first-info-more-button
      background: #FDA45E;
      border-radius .2rem;
      height: 1rem
      line-height @height;
      text-align center
      float right;
      padding: 0 1rem;
      font-size .5rem;

</style>
<template>
  <div class="main">
    <div v-infinite-scroll="scroll">
      <div class="first-info" v-if="infoList.length > 0" @click="goDetail(infoList[0])">
        <div class="first-info-image">
          <img :src="serviceUrl + infoList[0].coverPicture" alt="">
        </div>
        <div class="first-info-desc">
          <div class="first-info-time">{{ infoList[0].ym }}/{{ infoList[0].d }}</div>
          <div class="first-info-title">{{ infoList[0].title }}</div>
          <div class="first-info-summary">{{ infoList[0].summary }}</div>
          <div class="first-info-more-button">了解更多</div>
        </div>
        </div>
      <div v-for="(item, index) in infoList" v-show="index !== 0" :key="item.id" class="info-item"
           @click="goDetail(item)">
        <div class="info-time">
          <div style="font-size: 2.4rem">{{ item.d }}</div>
          <div style="font-size: .6rem">{{ item.ym }}</div>
        </div>
        <div class="info-content">
          <div class="info-title">{{ item.title }}</div>
          <div class="info-desc">{{ item.summary }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/api/services";
import ls from "@/store/ls";
import InfiniteScroll from "@/util/InfiniteScroll";

export default {
  name: "Information",
  data() {
    return {
      infoList: [],
      pageSize: 10,
      totalCount: 0,
      canScroll: true,
      serviceUrl: ''
    }
  },
  directives: {InfiniteScroll},
  computed: {},
  created() {
    this.serviceUrl = ls.get('serviceUrl')
    // this.getInfo()
  },
  mounted() {

  },
  methods: {
    scroll() {
      if (this.canScroll){
        this.canScroll = false;
        this.pageSize += 5;
        this.getInfo()
      }
    },
    getInfo() {
      service.post('classCard/info/list', {
        pageNo: 0,
        pageSize: this.pageSize
      }).then(res => {
        this.totalCount = res.data.total;
        this.canScroll = this.pageSize <= this.totalCount;
        this.infoList = res.data.list.map(item => {
          const time = new Date(item.createTime)
          const y = time.getFullYear();
          let m = time.getMonth() + 1
          let d = time.getDate();
          if (m < 10) m = '0' + m
          if (d < 10) d = '0' + d;
          item.ym = y + '/' + m
          item.d = d;
          return item;
        })
      })
    },
    goDetail(item) {
      this.$router.push({
        name: 'InformationDetail',
        params: {
          data: JSON.stringify(item)
        }
      })
    }
  }
}
</script>

