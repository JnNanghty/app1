<style scoped>

</style>
<template>
  <IonPage>维修</IonPage>
</template>

<script setup>
import {IonPage, onIonViewWillEnter} from "@ionic/vue";
import {msg} from "@/components/message";

onIonViewWillEnter(() => {
  if (window.serialPortPlugin) {
    msg({
      message: '有插件!!!!'
    });
  } else {
    msg({
      message: '没有插件????'
    })
  }
});
</script>

