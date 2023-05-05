<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon aria-hidden="true" :icon="triangle" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="workouts" href="/tabs/workouts">
          <ion-icon aria-hidden="true" :icon="ellipse" />
          <ion-label>Workouts</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="nutrition" href="/tabs/nutrition">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>Nutrition</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="you" href="/tabs/you">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>You</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { ellipse, square, triangle } from 'ionicons/icons';
</script>
