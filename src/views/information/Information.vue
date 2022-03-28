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
    <div class="first-info" @click="goDetail(infoList[0])">
      <div class="first-info-image">
        <img :src="infoList[0].coverPicture" alt="">
      </div>
      <div class="first-info-desc">
        <div class="first-info-time">{{infoList[0].ym}}/{{ infoList[0].d }}</div>
        <div class="first-info-title">{{infoList[0].title}}</div>
        <div class="first-info-summary">{{infoList[0].summary}}</div>
        <div class="first-info-more-button">了解更多</div>
      </div>
    </div>
    <div v-for="(item, index) in infoList" v-show="index !== 0" :key="item.id" class="info-item" @click="goDetail(item)">
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
          "summary": "在全校齐心合力防控疫情之际，日前，习近平同志就防疫工作发表重要讲话，中央部署从严抓好疫情防控工作，为更好落实习近平总书记重要指示和各级党组织工作部署，发挥好基层党组织战斗堡垒作用和党员先锋模范作用，确保校园安全、师生健康，现向全校基层党组织和党员同志们发出如下倡议：",
          "isIssued": false,
          "coverPicture": require('./info1.jpg'),
          "createTime": "2022-03-25T10:30:16.000Z",
          "author": "佚名",
          "id": 12164801,
          "label": null,
          "source": "组织部",
          "title": "致全校基层党组织和党员的倡议书",
          "type": {
            "id": 2,
            "label": "富文本"
          },
          "content": "<p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 0em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">各基层党组织、党员同志们：</p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal;\">在全校齐心合力防控疫情之际，日前，习近平同志就防疫工作发表重要讲话，中央部署从严抓好疫情防控工作，为更好落实习近平总书记重要指示和各级党组织工作部署，发挥好基层党组织战斗堡垒作用和党员先锋模范作用，确保校园安全、师生健康，现向全校基层党组织和党员同志们发出如下倡议：</p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">强化政治担当，组织有序担主责。基层党组织要深刻认识当前疫情防控的复杂性、艰巨性、反复性，进一步提高政治站位、担起主体责任，带领部门把思想和行动统一到校党委决策部署上来，做到守土有责、守土尽责。要不断优化防控举措，提高精准防控的针对性，对责任范围内防控工作的重点、难点、风险点做到心里有数、防范有招、组织有序。要及时总结防控好经验、展示防疫中的好人好事，汇聚防疫正能量。</p><p class=\"vsbcontent_img\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; color: #fff; line-height: 32px; font-size: 18px; text-align: center; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \"><img src=\"info1.jpg\" width=\"700\" height=\"394.0740740740741\" vsbhref=\"vurl\" vurl=\"/_vsl/7CCD39D33F89ACC62896BAF6E272CC59/DF2964DA/1C4D1\" vheight=\"394.0740740740741\" vwidth=\"700\" orisrc=\"/__local/7/CC/D3/9D33F89ACC62896BAF6E272CC59_DF2964DA_1C4D1.jpg\" class=\"img_vsb_content\" style=\"box-sizing: border-box; border: 1px none rgb(204, 204, 204); vertical-align: middle; max-width: 100%; height: auto;\"/></p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">带头落实要求，执行有效做主力。防疫是检验党员干部的试金石，也是砥砺能力的磨刀石。广大党员要率先垂范严格落实各项防疫规定，带头做好自身防护，戴口罩、不聚集、两点一线少流动等；身先士卒主动担当防控任务，做班级、团队、学院、部门中组织师生遵守防疫规定、督查防控措施落实等工作的主力。保证学校的各项防疫举措有效率、有效果地落实落细，确保校园平安和师生健康。</p><p class=\"vsbcontent_img\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; color: #fff; line-height: 32px; font-size: 18px; text-align: center; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \"><img src=\"http://news.hrbeu.edu.cn/__local/3/02/65/8D9D42CCBE480E0BF70209CF4FF_22F7E057_13E1C.jpg\" width=\"700\" height=\"525.0\" vsbhref=\"vurl\" vurl=\"/_vsl/302658D9D42CCBE480E0BF70209CF4FF/22F7E057/13E1C\" vheight=\"525.0\" vwidth=\"700\" orisrc=\"/__local/3/02/65/8D9D42CCBE480E0BF70209CF4FF_22F7E057_13E1C.jpg\" class=\"img_vsb_content\" style=\"box-sizing: border-box; border: 1px none rgb(204, 204, 204); vertical-align: middle; max-width: 100%; height: auto;\"/></p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">积极服务师生，关爱有情更主动。党员干部要主动深入师生、认真关爱师生、及时服务师生。通过线上线下等渠道多交流、常沟通，引导师生提高认识，指导掌握防疫知识、遵守防疫要求。及时了解师生需求、帮助师生排忧解难，重点关注学生身心健康、毕业流程进展、线上学习情况等，及时帮助协调、给予支持和指导，努力做好防疫政策宣传者、校园阵地守护者。</p><p class=\"vsbcontent_img\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; color: #fff; line-height: 32px; font-size: 18px; text-align: center; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \"><img src=\"http://news.hrbeu.edu.cn/__local/1/82/1A/90FFE9C061CAABFFCC811448BA4_0B4C4A7D_FA07.jpg\" width=\"700\" height=\"353.88888888888886\" vsbhref=\"vurl\" vurl=\"/_vsl/1821A90FFE9C061CAABFFCC811448BA4/0B4C4A7D/FA07\" vheight=\"353.88888888888886\" vwidth=\"700\" orisrc=\"/__local/1/82/1A/90FFE9C061CAABFFCC811448BA4_0B4C4A7D_FA07.jpg\" class=\"img_vsb_content\" style=\"box-sizing: border-box; border: 1px none rgb(204, 204, 204); vertical-align: middle; max-width: 100%; height: auto;\"/></p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">模范履行职责，统筹兼顾保主线。统筹防疫与发展、最大限度减少疫情的影响是指导我们工作的原则，要在防疫的同时牢牢把握各部门、各岗位的重点工作、重点任务，党员干部带头创造性地开展工作、模范履行好岗位职责，做到保底线、保运转、保发展，努力把教育教学安排落实到位、把师生健康保障落实到位、把校园安全举措落实到位、把疫情防控工作责任落实到位，稳步推进“十四五”开局各项工作。</p><p class=\"vsbcontent_img\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; color: #fff; line-height: 32px; font-size: 18px; text-align: center; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \"><img src=\"http://news.hrbeu.edu.cn/__local/B/AC/01/799FAE5CB7F4AFF21531A6B8704_416DB254_1DEA0.jpg\" width=\"700\" height=\"524.8205128205128\" vsbhref=\"vurl\" vurl=\"/_vsl/BAC01799FAE5CB7F4AFF21531A6B8704/416DB254/1DEA0\" vheight=\"524.8205128205128\" vwidth=\"700\" orisrc=\"/__local/B/AC/01/799FAE5CB7F4AFF21531A6B8704_416DB254_1DEA0.jpg\" class=\"img_vsb_content\" style=\"box-sizing: border-box; border: 1px none rgb(204, 204, 204); vertical-align: middle; max-width: 100%; height: auto;\"/></p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">各基层党组织和党员同志们，坚持就是胜利。让党旗在疫情防控一线高高飘扬，让我们用众志成城的努力成果迎接春天。</p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal;  text-align: right;\">哈尔滨工程大学党委组织部</p><p class=\"vsbcontent_end\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal;  text-align: right;\">2022年3月19日</p><p><br/></p>"
        },
        {
          "summary": '习近平指出，中韩是搬不走的永久近邻，也是分不开的合作伙伴。中方一贯重视中韩关系。在双方共同努力下，中韩关系全面快速发展，两国业已成为战略合作伙伴。事实证明，中韩关系发展符合两国和两国人民根本利益，促进了地区和平与发展。今年是中韩建交30周年。双方应该以此为契机，坚持相互尊重，加强政治互信，增进民间友好，推动中韩关系行稳致远。',
          "isIssued": false,
          "coverPicture": null,
          "createTime": "2022-03-25T10:03:50.000Z",
          "author": '佚名',
          "id": 12164602,
          "label": null,
          "source": '组织部',
          "title": "习书记给我们北舞“福州班”送来电视机——习近平与大学生朋友们",
          "type": {
            "id": 2,
            "label": "链接(URL)"
          },
          "content": "<p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 0em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">各基层党组织、党员同志们：</p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal;\">在全校齐心合力防控疫情之际，日前，习近平同志就防疫工作发表重要讲话，中央部署从严抓好疫情防控工作，为更好落实习近平总书记重要指示和各级党组织工作部署，发挥好基层党组织战斗堡垒作用和党员先锋模范作用，确保校园安全、师生健康，现向全校基层党组织和党员同志们发出如下倡议：</p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">强化政治担当，组织有序担主责。基层党组织要深刻认识当前疫情防控的复杂性、艰巨性、反复性，进一步提高政治站位、担起主体责任，带领部门把思想和行动统一到校党委决策部署上来，做到守土有责、守土尽责。要不断优化防控举措，提高精准防控的针对性，对责任范围内防控工作的重点、难点、风险点做到心里有数、防范有招、组织有序。要及时总结防控好经验、展示防疫中的好人好事，汇聚防疫正能量。</p><p class=\"vsbcontent_img\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; color: #fff; line-height: 32px; font-size: 18px; text-align: center; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \"><img src=\"info1.jpg\" width=\"700\" height=\"394.0740740740741\" vsbhref=\"vurl\" vurl=\"/_vsl/7CCD39D33F89ACC62896BAF6E272CC59/DF2964DA/1C4D1\" vheight=\"394.0740740740741\" vwidth=\"700\" orisrc=\"/__local/7/CC/D3/9D33F89ACC62896BAF6E272CC59_DF2964DA_1C4D1.jpg\" class=\"img_vsb_content\" style=\"box-sizing: border-box; border: 1px none rgb(204, 204, 204); vertical-align: middle; max-width: 100%; height: auto;\"/></p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">带头落实要求，执行有效做主力。防疫是检验党员干部的试金石，也是砥砺能力的磨刀石。广大党员要率先垂范严格落实各项防疫规定，带头做好自身防护，戴口罩、不聚集、两点一线少流动等；身先士卒主动担当防控任务，做班级、团队、学院、部门中组织师生遵守防疫规定、督查防控措施落实等工作的主力。保证学校的各项防疫举措有效率、有效果地落实落细，确保校园平安和师生健康。</p><p class=\"vsbcontent_img\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; color: #fff; line-height: 32px; font-size: 18px; text-align: center; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \"><img src=\"http://news.hrbeu.edu.cn/__local/3/02/65/8D9D42CCBE480E0BF70209CF4FF_22F7E057_13E1C.jpg\" width=\"700\" height=\"525.0\" vsbhref=\"vurl\" vurl=\"/_vsl/302658D9D42CCBE480E0BF70209CF4FF/22F7E057/13E1C\" vheight=\"525.0\" vwidth=\"700\" orisrc=\"/__local/3/02/65/8D9D42CCBE480E0BF70209CF4FF_22F7E057_13E1C.jpg\" class=\"img_vsb_content\" style=\"box-sizing: border-box; border: 1px none rgb(204, 204, 204); vertical-align: middle; max-width: 100%; height: auto;\"/></p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">积极服务师生，关爱有情更主动。党员干部要主动深入师生、认真关爱师生、及时服务师生。通过线上线下等渠道多交流、常沟通，引导师生提高认识，指导掌握防疫知识、遵守防疫要求。及时了解师生需求、帮助师生排忧解难，重点关注学生身心健康、毕业流程进展、线上学习情况等，及时帮助协调、给予支持和指导，努力做好防疫政策宣传者、校园阵地守护者。</p><p class=\"vsbcontent_img\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; color: #fff; line-height: 32px; font-size: 18px; text-align: center; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \"><img src=\"http://news.hrbeu.edu.cn/__local/1/82/1A/90FFE9C061CAABFFCC811448BA4_0B4C4A7D_FA07.jpg\" width=\"700\" height=\"353.88888888888886\" vsbhref=\"vurl\" vurl=\"/_vsl/1821A90FFE9C061CAABFFCC811448BA4/0B4C4A7D/FA07\" vheight=\"353.88888888888886\" vwidth=\"700\" orisrc=\"/__local/1/82/1A/90FFE9C061CAABFFCC811448BA4_0B4C4A7D_FA07.jpg\" class=\"img_vsb_content\" style=\"box-sizing: border-box; border: 1px none rgb(204, 204, 204); vertical-align: middle; max-width: 100%; height: auto;\"/></p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">模范履行职责，统筹兼顾保主线。统筹防疫与发展、最大限度减少疫情的影响是指导我们工作的原则，要在防疫的同时牢牢把握各部门、各岗位的重点工作、重点任务，党员干部带头创造性地开展工作、模范履行好岗位职责，做到保底线、保运转、保发展，努力把教育教学安排落实到位、把师生健康保障落实到位、把校园安全举措落实到位、把疫情防控工作责任落实到位，稳步推进“十四五”开局各项工作。</p><p class=\"vsbcontent_img\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; color: #fff; line-height: 32px; font-size: 18px; text-align: center; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \"><img src=\"http://news.hrbeu.edu.cn/__local/B/AC/01/799FAE5CB7F4AFF21531A6B8704_416DB254_1DEA0.jpg\" width=\"700\" height=\"524.8205128205128\" vsbhref=\"vurl\" vurl=\"/_vsl/BAC01799FAE5CB7F4AFF21531A6B8704/416DB254/1DEA0\" vheight=\"524.8205128205128\" vwidth=\"700\" orisrc=\"/__local/B/AC/01/799FAE5CB7F4AFF21531A6B8704_416DB254_1DEA0.jpg\" class=\"img_vsb_content\" style=\"box-sizing: border-box; border: 1px none rgb(204, 204, 204); vertical-align: middle; max-width: 100%; height: auto;\"/></p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">各基层党组织和党员同志们，坚持就是胜利。让党旗在疫情防控一线高高飘扬，让我们用众志成城的努力成果迎接春天。</p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal;  text-align: right;\">哈尔滨工程大学党委组织部</p><p class=\"vsbcontent_end\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal;  text-align: right;\">2022年3月19日</p><p><br/></p>"
        },
        {
          "summary": "3月22日，学校召开2022年学生工作部署会，校党委副书记夏桂华出席会议，学工部（处）、武装部、校团委负责人及各学院学生工作负责人线下参会，其他学工干部线上参会。",
          "isIssued": false,
          "coverPicture": null,
          "createTime": "2022-03-25T09:56:59.000Z",
          "author": "金棱",
          "id": 12164601,
          "label": null,
          "source": "学工部",
          "title": "学校召开2022年学生工作部署会",
          "type": {
            "id": 2,
            "label": "链接(URL)"
          },
          "content": "<p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 0em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">各基层党组织、党员同志们：</p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal;\">在全校齐心合力防控疫情之际，日前，习近平同志就防疫工作发表重要讲话，中央部署从严抓好疫情防控工作，为更好落实习近平总书记重要指示和各级党组织工作部署，发挥好基层党组织战斗堡垒作用和党员先锋模范作用，确保校园安全、师生健康，现向全校基层党组织和党员同志们发出如下倡议：</p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">强化政治担当，组织有序担主责。基层党组织要深刻认识当前疫情防控的复杂性、艰巨性、反复性，进一步提高政治站位、担起主体责任，带领部门把思想和行动统一到校党委决策部署上来，做到守土有责、守土尽责。要不断优化防控举措，提高精准防控的针对性，对责任范围内防控工作的重点、难点、风险点做到心里有数、防范有招、组织有序。要及时总结防控好经验、展示防疫中的好人好事，汇聚防疫正能量。</p><p class=\"vsbcontent_img\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; color: #fff; line-height: 32px; font-size: 18px; text-align: center; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \"><img src=\"info1.jpg\" width=\"700\" height=\"394.0740740740741\" vsbhref=\"vurl\" vurl=\"/_vsl/7CCD39D33F89ACC62896BAF6E272CC59/DF2964DA/1C4D1\" vheight=\"394.0740740740741\" vwidth=\"700\" orisrc=\"/__local/7/CC/D3/9D33F89ACC62896BAF6E272CC59_DF2964DA_1C4D1.jpg\" class=\"img_vsb_content\" style=\"box-sizing: border-box; border: 1px none rgb(204, 204, 204); vertical-align: middle; max-width: 100%; height: auto;\"/></p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">带头落实要求，执行有效做主力。防疫是检验党员干部的试金石，也是砥砺能力的磨刀石。广大党员要率先垂范严格落实各项防疫规定，带头做好自身防护，戴口罩、不聚集、两点一线少流动等；身先士卒主动担当防控任务，做班级、团队、学院、部门中组织师生遵守防疫规定、督查防控措施落实等工作的主力。保证学校的各项防疫举措有效率、有效果地落实落细，确保校园平安和师生健康。</p><p class=\"vsbcontent_img\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; color: #fff; line-height: 32px; font-size: 18px; text-align: center; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \"><img src=\"http://news.hrbeu.edu.cn/__local/3/02/65/8D9D42CCBE480E0BF70209CF4FF_22F7E057_13E1C.jpg\" width=\"700\" height=\"525.0\" vsbhref=\"vurl\" vurl=\"/_vsl/302658D9D42CCBE480E0BF70209CF4FF/22F7E057/13E1C\" vheight=\"525.0\" vwidth=\"700\" orisrc=\"/__local/3/02/65/8D9D42CCBE480E0BF70209CF4FF_22F7E057_13E1C.jpg\" class=\"img_vsb_content\" style=\"box-sizing: border-box; border: 1px none rgb(204, 204, 204); vertical-align: middle; max-width: 100%; height: auto;\"/></p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">积极服务师生，关爱有情更主动。党员干部要主动深入师生、认真关爱师生、及时服务师生。通过线上线下等渠道多交流、常沟通，引导师生提高认识，指导掌握防疫知识、遵守防疫要求。及时了解师生需求、帮助师生排忧解难，重点关注学生身心健康、毕业流程进展、线上学习情况等，及时帮助协调、给予支持和指导，努力做好防疫政策宣传者、校园阵地守护者。</p><p class=\"vsbcontent_img\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; color: #fff; line-height: 32px; font-size: 18px; text-align: center; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \"><img src=\"http://news.hrbeu.edu.cn/__local/1/82/1A/90FFE9C061CAABFFCC811448BA4_0B4C4A7D_FA07.jpg\" width=\"700\" height=\"353.88888888888886\" vsbhref=\"vurl\" vurl=\"/_vsl/1821A90FFE9C061CAABFFCC811448BA4/0B4C4A7D/FA07\" vheight=\"353.88888888888886\" vwidth=\"700\" orisrc=\"/__local/1/82/1A/90FFE9C061CAABFFCC811448BA4_0B4C4A7D_FA07.jpg\" class=\"img_vsb_content\" style=\"box-sizing: border-box; border: 1px none rgb(204, 204, 204); vertical-align: middle; max-width: 100%; height: auto;\"/></p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">模范履行职责，统筹兼顾保主线。统筹防疫与发展、最大限度减少疫情的影响是指导我们工作的原则，要在防疫的同时牢牢把握各部门、各岗位的重点工作、重点任务，党员干部带头创造性地开展工作、模范履行好岗位职责，做到保底线、保运转、保发展，努力把教育教学安排落实到位、把师生健康保障落实到位、把校园安全举措落实到位、把疫情防控工作责任落实到位，稳步推进“十四五”开局各项工作。</p><p class=\"vsbcontent_img\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; color: #fff; line-height: 32px; font-size: 18px; text-align: center; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \"><img src=\"http://news.hrbeu.edu.cn/__local/B/AC/01/799FAE5CB7F4AFF21531A6B8704_416DB254_1DEA0.jpg\" width=\"700\" height=\"524.8205128205128\" vsbhref=\"vurl\" vurl=\"/_vsl/BAC01799FAE5CB7F4AFF21531A6B8704/416DB254/1DEA0\" vheight=\"524.8205128205128\" vwidth=\"700\" orisrc=\"/__local/B/AC/01/799FAE5CB7F4AFF21531A6B8704_416DB254_1DEA0.jpg\" class=\"img_vsb_content\" style=\"box-sizing: border-box; border: 1px none rgb(204, 204, 204); vertical-align: middle; max-width: 100%; height: auto;\"/></p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal; \">各基层党组织和党员同志们，坚持就是胜利。让党旗在疫情防控一线高高飘扬，让我们用众志成城的努力成果迎接春天。</p><p style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal;  text-align: right;\">哈尔滨工程大学党委组织部</p><p class=\"vsbcontent_end\" style=\"box-sizing: border-box; margin-top: 25px; margin-bottom: 25px; text-indent: 2em; color: #fff; line-height: 32px; font-size: 18px; font-family: &quot;Microsoft YaHei&quot;; white-space: normal;  text-align: right;\">2022年3月19日</p><p><br/></p>"
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

