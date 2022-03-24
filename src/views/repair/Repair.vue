<style scoped lang="stylus">
.main
  width: 100%;
  height: 100%;
  padding: 0 2rem;
  box-sizing: border-box;
  get_font_color(font_color)

  .top
    padding: 1rem
    border-radius 8px
    get_background(setting_panel_bancground)
    margin-bottom: .5rem
    display flex
    justify-content space-between
    .terminal
      display flex
      .change-terminal
        get_background(borrow_change_button_background)
        width 5rem;
        margin-left: 2.5rem
  .bottom
    display flex

    .left, .right
      flex: 1;
      get_background(setting_panel_bancground)

      border-radius 8px
      box-sizing border-box

    .left
      padding: 1.5rem
      margin-right: .5rem
    .qr-code
      width: 7rem
      height @width
      border-radius 4px;
      margin: 2rem 0 3rem

.form-item
  margin-bottom: 1rem
  font-size .8rem;

.form-select
  width 70%

.submit-button
  margin-top: 2rem
</style>
<template>
  <div class="main">
    <div class="top">
      <div class="terminal">
        <div style="flex: 1;font-size: 1.6rem;">{{terminalInfo.label}}</div>
        <div class="change-terminal _button" @click="showChangeTerminal = true">切换教室</div>
      </div>
      <user-info></user-info>
    </div>
    <div class="bottom">
      <div class="left" @click="showChangeTerminal = false">
        <div class="form-item">
          <label for="device-type">
            故障设备：
            <select class="form-select _select" id="device-type" v-model="form.device">
              <option :value="-1" label="请选择"></option>
              <option v-for="item in devices" :key="item.id" :label="item.type.label" :value="item.id"></option>
            </select>
          </label>
        </div>
        <div class="form-item">
          <label for="alarm-type">
            故障类型：
            <select class="form-select _select" id="alarm-type" v-model="form.type">
              <option :value="-1" label="请选择"></option>
              <option v-for="item in alarmTypes" :key="item.id" :value="item.id" :label="item.text"></option>
            </select>
          </label>
        </div>
        <div class="form-item">
          <label for="severity">
            严重程度：
            <select class="form-select _select" id="severity" v-model="form.severity">
              <option :value="-1" label="请选择"></option>
              <option v-for="item in severities" :key="item.id" :value="item.id" :label="item.text"></option>
            </select>
          </label>
        </div>
        <div class="submit-button _button" @click.stop="submit">立即上报</div>
      </div>
      <div class="right">
        <template v-if="showChangeTerminal">
          <classroom-select></classroom-select>
        </template>
        <template v-else>
          <div style="text-align: center">
            <img class="qr-code" :src="code" alt="">
            <div style="font-size: .6rem;">微信扫描左侧二维码进行语音报修</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/api/services";
import ls from "@/store/ls";
import ClassroomSelect from "@/views/classroomBorrow/components/ClassroomSelect";
import mitt from "@/util/mitt";
import {myConfirm} from "@/components/confirm";
import {msg} from "@/components/message";
import QRCode from 'qrcode'
export default {
  components: {ClassroomSelect},
  data() {
    return {
      form: {
        terminal: {},
        device: -1,
        type: -1,
        severity: -1,
        description: '',
        start: Date.now(),
        step: 'waiting',
        timeout: 7,
        relationTeacher: {}
      },
      alarmTypes: [
        {id: 1, value: 'control', text: '中控系统故障'},
        {id: 2, value: 'projector', text: '教学软件故障'},
        {id: 3, value: 'teaching', text: '电脑硬件故障'},
        {id: 4, value: 'net', text: '网络信号故障'},
        {id: 5, value: 'teaching', text: '显示信号故障'},
        {id: 6, value: 'audio', text: '音频信号故障'},
        {id: 7, value: 'operationIssue', text: '教师操作失误'},
        {id: 8, value: 'hardware', text: '硬件设施故障'},
        {id: 9, value: 'etc', text: '其他'},
        {id: 10, value: 'lowPower', text: '门锁低电量'}
      ],
      severities: [
        {id: 1, value: 'block', text: '紧急'},
        {id: 2, value: 'critical', text: '严重'},
        {id: 3, value: 'major', text: '主要'},
        {id: 4, value: 'minor', text: '次要'},
        {id: 5, value: 'trivial', text: '提示'}
      ],
      devices: [],
      terminalInfo: {},
      showChangeTerminal: false,
      code: null
    }
  },
  created() {
    let userInfo = ls.get('userInfo') || {};
    this.form.relationTeacher = {
      id: userInfo.id
    };

    let terminalId = ls.get('terminalId')
    this.form.terminal = {
      id: terminalId
    }
    this.terminalInfo = ls.get('terminalInfo')
    mitt.on('updateSelect', this.selectTerminal)

    this.getTerminal();
    this.getDevices();
    this.generateCode()
  },
  mounted() {
  },
  beforeUnmount() {
    mitt.off('updateSelect', this.selectTerminal)
  },
  methods: {
    getTerminal() {
      service.post('model/getEntityTree', {
        nodes: [{
          subnodes: [{
            type: 'terminal',
            filter: {
              field: 'parent',
              match: 'EQ',
              value: null
            }
          }, {
            type: 'terminalCategory',
            filter: {
              field: 'parent',
              match: 'EQ',
              value: null
            }
          }]
        }, {
          type: 'terminal'
        }, {
          type: 'terminalCategory',
          subnodes: [{
            type: 'terminal',
            filter: {
              field: 'parent',
              match: 'EQ',
              value: '$parentId'
            }
          }, {
            type: 'terminalCategory',
            filter: {
              field: 'parent',
              match: 'EQ',
              value: '$parentId'
            }
          }]
        }]
      }).then(res => {
      });
    },
    getDevices() {
      service.post('model/getEntities', {
        target: 'device',
        filter: {
          relation: 'AND',
          children: [{
            field: 'terminal.id',
            match: 'EQ',
            value: +this.form.terminal.id
          }, {
            field: 'type',
            match: 'NE',
            value: null
          }]
        },
        pageSize: -1,
        retFields: ['type', 'assetName']
      }).then(res => {
        this.devices = res.list;
      })
    },
    submit() {
      let self = this
      myConfirm({
        message: '是否确认上报？',
        ok() {
          service.post('deviceAlarm/report', {
            entity: self.form
          }).then(() => {
            msg({
              message: '上报成功',
              type: 'success'
            })
          })
        }
      })
    },
    selectTerminal(terminal) {
      this.terminalInfo = terminal;
      this.generateCode();
    },
    generateCode() {
      QRCode.toDataURL(JSON.stringify({
        terminalId: this.terminalInfo.id
      })).then(url => {
        this.code = url;
      })
    }
  }
}
</script>
