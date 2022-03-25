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
</style>
<template>
  <div class="main">
    <div v-for="item in infoList" :key="item.id" class="info-item" @click="goDetail(item)">
      <div class="info-time">
        <div style="font-size: 2.4rem">{{item.d}}</div>
        <div style="font-size: .6rem">{{item.ym}}</div>
      </div>
      <div class="info-content">
        <div class="info-title">{{item.title}}</div>
        <div class="info-desc">{{item.summary}}</div>
      </div>
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
          "coverPicture": "/public/6669210data/public/6669210/classcard/DL3uxRlCGV12577tgq00.png",
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
          "content": "<p style=\"text-align: center;\"><span data-metadata=\"&lt;!--(figmeta)eyJmaWxlS2V5IjoielV6QmxyOHd1b1had2VwMkxEczRaZiIsInBhc3RlSUQiOjc5MjU2MjIxMiwiZGF0YVR5cGUiOiJzY2VuZSJ9Cg==(/figmeta)--&gt;\"></span><span style=\"font-size: 36px;\"><strong><span style=\"white-space: pre-wrap;\">学校召开亚运场馆运行及赛事筹办工作第十次推进会</span></strong></span></p><p style=\"text-align: center;\">&nbsp; 来源 : 党委宣传部&nbsp; &nbsp; &nbsp;作者 : 基础医学院&nbsp; &nbsp; &nbsp;2022-03-04&nbsp;</p><p style=\"margin-top: 5px; text-align: center;\">&nbsp; &nbsp; <span style=\"font-size: 20px;\">近日，我校邱猛生教授应邀担任国际知名学术期刊Journal of Neuroscience副主编（Associate Editor）。Journal of Neuroscience创刊于1981年，是美国神经科学学会（SfN）旗舰期刊，神经科学领域的TOP期刊之一，属于中科院JCR期刊分区一区。</span></p><p style=\"text-align: center;\"><img src=\"http://192.168.1.48/public/6669210/classcard/XujMdyHBQq46196x8vpy.png\" title=\"无标题.png\" alt=\"无标题.png\"/></p><p style=\"text-align: center;\"><span style=\"font-size: 20px;\">&nbsp; &nbsp; 近日，我校邱猛生教授应邀担任国际知名学术期刊Journal of Neuroscience副主编（Associate Editor）。Journal of Neuroscience创刊于1981年，是美国神经科学学会（SfN）旗舰期刊，神经科学领域的TOP期刊之一，属于中科院JCR期刊分区一区。</span></p><p><span data-metadata=\"&lt;!--(figmeta)eyJmaWxlS2V5IjoielV6QmxyOHd1b1had2VwMkxEczRaZiIsInBhc3RlSUQiOjE0NDI3MjExNjksImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;\"></span></p><p><br/></p>"
        },
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

