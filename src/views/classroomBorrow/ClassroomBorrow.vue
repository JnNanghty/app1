<style scoped>
.main {
  padding: 0 5rem;
}

.list-item {
  color: #ffffff;
  height: 2rem;
  line-height: 2rem;
  border: 2px solid #ffffff;
  border-radius: 20px;
  margin: 0 10px 20px;
  padding-left: 10px;
}
</style>
<template>
  <IonPage class="main">
    <IonContent>
      <div class="list-item" v-for="(item, index) in borrowList" :key="item.id" @click="goPage(item.id)">
        {{ item.creator && item.creator.label }} {{ item.room && item.room.label }}
        {{ item.status && item.status.label }} {{ item.reason }} {{ index }}
      </div>
      <ion-infinite-scroll
          @ionInfinite="loadData($event)"
          threshold="100px">
        <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="加载中...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </IonContent>
  </IonPage>
</template>

<script setup>
import {
  IonPage,
  IonContent,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  onIonViewWillEnter
} from "@ionic/vue";
import {ref} from "vue";
import {msg} from "@/components/message";
import service from "@/api/services";
import router from "@/router";

const borrowList = ref([]);
const count = ref(10);
const totalCount = ref(0);
const getBorrowList = async () => {
  await service.post('model/getEntities', {
    target: 'terminalBorrow',
    start: 0,
    count: count.value,
    orderBy: ['id DESC'],
    extraFilter: {
      field: 'creator',
      match: 'EQ',
      value: 6669282
    },
    retFields: ['creator', 'room', 'start', 'end', 'time', 'status', 'reason']
  }).then(res => {
    borrowList.value = res.list;
    totalCount.value = res.totalCount;
  });
}
const loadData = async (ev) => {
  count.value += 5;
  await getBorrowList()
  await ev.target.complete();
  if (count.value >= totalCount.value) {
    ev.target.disabled = true;
  }
}
const goPage = (id) => {
  router.push({
    name: 'ClassroomBorrowDetail',
    params: {
      id: id
    }
  })
}
onIonViewWillEnter(() => {
  getBorrowList();
  msg({
    message: '请先登录!'
  });
})
</script>

