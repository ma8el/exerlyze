<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import Toolbar from '@/components/Toolbar.vue';
  import UserInfoCard from '@/components/Cards/UserInfoCard.vue';
</script>

<template>
  <ion-page>
    <Toolbar title="You" />
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">You</ion-title>
        </ion-toolbar>
      </ion-header>
      <UserInfoCard />
    </ion-content>
  </ion-page>
</template>
