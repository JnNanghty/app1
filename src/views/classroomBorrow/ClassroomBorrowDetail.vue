<style scoped>
.main {
  padding: 0 10rem;
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
</style>
<template>
  <div class="main">
    <div>
      <div @click="openPicker">
        <div>教室</div>
        <div slot="end">{{ classroom }}</div>
      </div>
      <div>
        <div>时间</div>
        <div slot="end">time</div>
      </div>
      <div>
        <div>申请理由</div>
        <input type="text">
      </div>
    </div>
    <template to="body">
      <div class="shadow" @click.self="showPicker = false" v-if="showPicker">
        <div class="popup-content">
          <van-cascader
              v-model="cascaderValue"
              title="请选择教室"
              :options="options"
              @close="showPicker = false"
              @finish="onFinish"></van-cascader>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import service from "@/api/services";
import {Cascader as VanCascader} from 'vant';

export default {
  components: {
    VanCascader
  },
  data() {
    return {
      showPicker: false,
      classroom: '',
      cascaderValue: '',
      options: []
    }
  },
  mounted() {
    this.getTerminal()
  },
  methods: {
    openPicker() {
      this.showPicker = true;
    },
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
        this.options = this.initData(res.list);
      })
    },
    // 递归初始化数据
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
    onFinish({selectedOptions}) {
      let value = '';
      selectedOptions.forEach(item => {
        value += item.text + ' / ';
      });
      this.classroom = value.slice(0, -3);
      this.showPicker = false;
    }
  }
}
</script>
