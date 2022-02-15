<style scoped>
.main {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 0 15%;
  box-sizing: border-box;
}

.shadow {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #00000054;
  overflow-y: scroll;
}

.popup-content {
  position: absolute;
  width: 50%;
  left: 0;
  right: 0;
  margin: 5% auto 0;
  overflow-y: scroll;
  background: #ffffff;
  border-radius: .5rem;
}

.submit-button {
  text-align: center;
  padding-top: 10px;
}
</style>
<template>
  <div class="main">
    <van-cell-group>
      <van-field readonly clickable name="area" v-model="form.terminal" label="教室" placeholder="点击选择教室"
                 @click="openPicker"/>
      <van-field v-model="form.device" label="设备类型" placeholder=""/>
      <van-field readonly clickable v-model="form.type" label="故障类型" placeholder="" @click="openTypePicker"/>
      <van-field readonly clickable v-model="form.severity" label="严重程度" placeholder="" @click="openSeverityPicker"/>
      <van-field v-model="form.description" label="故障描述" placeholder=""/>
      <van-field readonly clickable v-model="form.start" label="开始时间" placeholder="" @click="openDateTimePicker"/>
      <van-field v-model="form.timeout" label="超时期限(天)" placeholder=""/>
    </van-cell-group>
    <div class="submit-button">
      <van-button type="primary">提交</van-button>
    </div>

    <!-- 教室选择 -->
    <teleport to="body">
      <div class="shadow" @click.self="showPicker = false" v-if="showPicker">
        <div class="popup-content">
          <van-cascader
              title="请选择教室"
              :options="options"
              @close="showPicker = false"
              @finish="onFinish"></van-cascader>
        </div>
      </div>
    </teleport>
    <!--  时间日期 -->
    <teleport to="body">
      <div class="shadow" @click.self="showDateTimePicker = false" v-if="showDateTimePicker">
        <div class="popup-content">
          <van-datetime-picker
              type="datetime"
              v-model="currentDate"
              :max-date="maxDate"
              @confirm="confirmDate"
          />
        </div>
      </div>
    </teleport>
    <!--  故障类型  -->
    <teleport to="body">
      <div class="shadow" @click.self="showTypePicker = false" v-if="showTypePicker">
        <div class="popup-content">
          <van-cascader
              title="请选择故障类型"
              :options="alarmTypes"
              @close="showTypePicker = false"
              @finish="onTypeFinish"></van-cascader>
        </div>
      </div>
    </teleport>
<!--  严重程度  -->
    <teleport to="body">
      <div class="shadow" @click.self="showSeverityPicker = false" v-if="showSeverityPicker">
        <div class="popup-content">
          <van-cascader
              title="请选择严重程度"
              :options="severities"
              @close="showSeverityPicker = false"
              @finish="onSeverityFinish"></van-cascader>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import cameraPlayer from "@/views/patrol/components/CameraPlayer";
import service from "@/api/services";
import ls from "@/store/ls";

export default {
  components: {cameraPlayer},
  data() {
    return {
      info: '没有info',
      form: {
        terminal: '',
        device: '',
        type: '',
        severity: '',
        description: '',
        start: '',
        end: '',
        timeout: 7,
        relationTeacher: '',
        processorSys: '',
        processorMobile: ''
      },
      options: [],
      showPicker: false,
      showDateTimePicker: false,
      showSeverityPicker: false,
      showTypePicker: false,
      currentDate: new Date(),
      maxDate: new Date(),
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
    }
  },
  mounted() {
  },
  methods: {
    getTerminal() {
      return new Promise((resolve, reject) => {
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
          this.options = this.initData(res.list);
          resolve();
        }, () => {
          reject();
        });
      })
    },
    initData(list) {
      if (list) {
        return list.map(item => {
          return {
            text: item.label,
            value: item.id,
            children: this.initData(item.children)
          }
        });
      } else return undefined
    },
    openPicker() {
      this.showPicker = true;
    },
    openDateTimePicker() {
      this.showDateTimePicker = true;
    },
    openSeverityPicker() {
      this.showSeverityPicker = true;
    },
    openTypePicker() {
      this.showTypePicker = true;
    },
    onFinish({selectedOptions}) {
      let value = '';
      selectedOptions.forEach(item => {
        value += item.text + ' / ';
      });
      this.classroom = value.slice(0, -3);
      this.showPicker = false;

      // 如果已经绑定了，  那么就用切换绑定接口
      const terminalId = ls.get('terminalId');
      if (terminalId) {
        this.changeBind(this.cascaderValue);
      } else {
        this.bindClass(this.cascaderValue);
      }
    },
    onSeverityFinish({selectedOptions}) {
      console.log(selectedOptions);
      this.form.severity = selectedOptions[0].text;
      this.showSeverityPicker = false;
    },
    onTypeFinish({selectedOptions}) {
      console.log(selectedOptions);

      this.form.type = selectedOptions[0].text;
      this.showTypePicker = false;
    },
    confirmDate(v) {
      console.log(v)
      this.form.start = v;
      this.showDateTimePicker = false;
    }
  }
}
</script>
