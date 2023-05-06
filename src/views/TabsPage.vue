<script setup lang="ts">
  import { IonTabBar,
           IonTabButton,
           IonTabs,
           IonLabel,
           IonIcon,
           IonPage,
           IonRouterOutlet} from '@ionic/vue';
  import { personCircleOutline, nutritionOutline, barbellOutline, homeSharp, addCircleOutline } from 'ionicons/icons';

</script>

<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon aria-hidden="true" :icon="homeSharp" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="workouts" href="/tabs/workouts">
          <ion-icon aria-hidden="true" :icon="barbellOutline" />
          <ion-label>Workouts</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="track" href="/tabs/track">
          <ion-icon aria-hidden="true" :icon="addCircleOutline" />
          <ion-label>Track</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="nutrition" href="/tabs/nutrition">
          <ion-icon aria-hidden="true" :icon="nutritionOutline" />
          <ion-label>Nutrition</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="you" href="/tabs/you">
          <ion-icon aria-hidden="true" :icon="personCircleOutline" />
          <ion-label>You</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>