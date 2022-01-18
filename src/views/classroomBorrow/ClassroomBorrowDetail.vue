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
ion-item{
  color: #ffffff;
}
</style>
<template>
  <IonPage class="main">
    <IonList>
      <IonItem @click="openPicker">
        <IonLabel>教室</IonLabel>
        <IonLabel slot="end">{{ classroom }}</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>时间</IonLabel>
        <IonLabel slot="end">time</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>申请理由</IonLabel>
<!--        <IonInput type="textarea" slot="end"></IonInput>-->
        <IonTextarea slot="end"></IonTextarea>
      </IonItem>
    </IonList>
    <teleport to="body">
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
    </teleport>
  </IonPage>
</template>

<script setup>
import {
  IonPage,
  IonList,
  IonLabel,
  IonTextarea,
  IonItem,
  onIonViewWillEnter
} from "@ionic/vue";
import {useRoute} from 'vue-router'
import {Cascader as VanCascader} from 'vant';
import service from "@/api/services";
import {ref} from "vue";


const showPicker = ref(false);
const openPicker = () => {
  showPicker.value = true;
}
// 教室 显示的值
const classroom = ref('');
// 级联选择值
const cascaderValue = ref('');
// 教室
const options = ref([]);
const onFinish = async ({selectedOptions}) => {
  let value = '';
  selectedOptions.forEach(item => {
    value += item.text + ' / ';
  });
  classroom.value = value.slice(0, -3);
  showPicker.value = false;
}

// 递归初始化数据
const initData = (list) => {
  if (list) {
    return list.map(item => {
      return {
        text: item.label,
        value: item.id,
        children: initData(item.children)
      }
    });
  } else return undefined
}
// 获取教室tree
const getTerminal = () => {
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
    options.value = initData(res.list);
  })
};



const route = useRoute();
onIonViewWillEnter(() => {
  console.log(route.params.id);
  getTerminal()
})
</script>

