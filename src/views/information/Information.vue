<style lang="stylus" scoped>
.main
  get_font_color(font_color)
  padding: 1rem 2rem;
  box-sizing border-box
  overflow-y: scroll;
  .info-item
    display flex
    padding: 1rem
    margin-bottom: 1rem
    .info-time
      margin-right: 2rem
    .info-content
      font-size 16px;
      flex 1;
      padding: 1rem
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
</style>
<template>
  <div class="main">
    <div v-for="item in infoList" :key="item.id" class="info-item" @click="goDetail(item)">
      <div class="info-time">
        <div style="font-size: 48px">{{item.d}}</div>
        <div style="font-size: 12px">{{item.ym}}</div>
      </div>
      <div class="info-content">{{item.title}}</div>
    </div>
  </div>
</template>

<script>
import service from "@/api/services";

export default {
  name: "Information",
  data() {
    return {
      infoList: []
    }
  },
  computed: {},
  created() {
      this.getInfo()
    // let data = this.$route.params.data
    // if (data) {
    //   this.infoList.push(JSON.parse(data));
    // } else {
    // }
  },
  methods: {
    getInfo() {
      service.post('classCard/info/list', {
        pageNo: 0,
        pageSize: 10
      }).then(res => {
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

