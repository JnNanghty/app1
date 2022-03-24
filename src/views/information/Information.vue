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
      font-size .8rem
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
        <div style="font-size: 2.4rem">{{item.d}}</div>
        <div style="font-size: .6rem">{{item.ym}}</div>
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
  },
  methods: {
    getInfo() {
      let data = [
        {
          "isIssued": true,
          "coverPicture": null,
          "createTime": "2022-03-01T07:51:37.000Z",
          "author": {
            "id": 6669282,
            "label": "系统管理员"
          },
          "id": 11736456,
          "label": null,
          "title": "学校召开亚运场馆运行及赛事筹办工作第十次推进会",
          "type": {
            "id": 2,
            "label": "富文本"
          },
          "content": "<h2 style=\"white-space: normal;\">推荐全屏</h2>近日，我校邱猛生教授应邀担任国际知名学术期刊Journal of Neuroscience副主编（Associate Editor）。Journal of Neuroscience创刊于...</h2>"
        },
        {
          "isIssued": true,
          "coverPicture": null,
          "createTime": "2022-02-28T08:45:24.000Z",
          "author": {
            "id": 6669282,
            "label": "系统管理员"
          },
          "id": 11715706,
          "label": null,
          "title": "“强美富”！感受习近平的深情瞩望",
          "type": {
            "id": 2,
            "label": "富文本"
          },
          "content": "<h2>近日，我校邱猛生教授应邀担任国际知名学术期刊Journal of Neuroscience副主编（Associate Editor）。Journal of Neuroscience创刊于...</h2>"
        },
        {
          "isIssued": true,
          "coverPicture": null,
          "createTime": "2022-02-28T08:24:10.000Z",
          "author": {
            "id": 6669282,
            "label": "系统管理员"
          },
          "id": 11715705,
          "label": null,
          "title": "国家药监局已批准19个新冠病毒抗原检测试剂",
          "type": {
            "id": 1,
            "label": "链接(URL)"
          },
          "content": "https://haokan.baidu.com/v?vid=2318062559438008450&pd=bjh&fr=bjhauthor&type=video"
        },
        {
          "isIssued": true,
          "coverPicture": null,
          "createTime": "2022-02-28T06:59:24.000Z",
          "author": {
            "id": 6669282,
            "label": "系统管理员"
          },
          "id": 11715704,
          "label": null,
          "title": "航拍俄乌交战中的马里乌波尔：满目疮痍不见人迹",
          "type": {
            "id": 1,
            "label": "链接(URL)"
          },
          "content": "https://www.bing.com/"
        }
      ]
      this.infoList = data.map(item => {
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

