<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import ExploreContainer from '@/components/ExploreContainer.vue';
  import Toolbar from '@/components/Toolbar.vue';
  import Calendar from '@/components/Calendar.vue';
  import StartWorkoutButton from '@/components/StartWorkoutButton.vue';
  import { useDark } from '@vueuse/core'

  const isDark = useDark()
</script>

<template>
  <ion-page>
    <Toolbar title="Home" />
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <Calendar />
      <StartWorkoutButton/>
    </ion-content>
  </ion-page>
</template>