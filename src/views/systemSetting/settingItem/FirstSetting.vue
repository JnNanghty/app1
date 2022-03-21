<style lang="stylus" scoped>
.main
  get_font_color(font_color)
  width: 100%
  height: 100%
  display flex
  padding: 0.65rem;
  box-sizing border-box
  .main-left,
  .main-right
    flex: 1;
    get_background(setting_panel_bancground)
    padding-top: .7rem
    padding-left: 1.25rem
    position relative
    border-radius 8px;

    .form-input
      max-width: 19.5rem;
      height: 2rem

  .main-left
    margin-right: 0.75rem
.form-item
  margin-bottom: 0.85rem
.form-label
  margin-bottom: 0.35rem
  font-size 0.7rem;

.form-title
  margin-bottom: 1.15rem

.submit-button
  text-align center;
  border-radius 0.4rem;
  width: 15.5rem
  height: 2rem
  line-height @height;
  margin-top: 2rem
</style>
<template>
  <div class="main">
    <div class="main-left">
      <h3 class="form-title">融合平台地址信息</h3>
      <form class="form-content">
        <div class="form-item">
          <div class="form-label">迈杰云平台</div>
          <input class="form-input _input" v-model="serviceUrl" style="width: 19.5rem">
        </div>
        <div class="submit-button _button" @click="checkIp">保存</div>
      </form>
    </div>
    <div class="main-right">
      <auth v-if="ipChecked"></auth>
    </div>
  </div>
</template>

<script>
import ls from "@/store/ls";
import service from "@/api/services";
import {msg} from "@/components/message";
import {initMqtt} from "@/util/mqttUtil";
import Auth from "@/components/authPage/Auth";
import mitt from "@/util/mitt";

export default {
  name: "FirstSetting",
  components: {Auth},
  data() {
    return {
      serviceUrl: '',
      ipChecked: false
    }
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  beforeUnmount() {
  },
  methods: {
    checkIp() {
      ls.set('serviceUrl', this.serviceUrl);
      service.post('classCard/testLink').then(res => {
        if (res.message === 'success') {
          msg({
            message: '连接成功!',
            type: 'success'
          });
          initMqtt();
          this.getConfig();
        } else {
          ls.remove('serviceUrl');
          msg({
            message: '连接服务器失败!',
            type: 'wrong'
          });
        }
      })
    },
    getConfig() {
      service.post('classCard/getConfig').then((res) => {
        if (res.message === 'success') {
          ls.set('deviceConfig', res.data);
          this.ipChecked = true;
        } else {
          msg({
            message: '获取班牌信息失败！',
            type: 'wrong'
          });
        }
      });
    }
  }
}
</script>

