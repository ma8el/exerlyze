<script setup lang="ts">
import { IonContent, IonGrid, IonRow, IonCol, IonSpinner } from '@ionic/vue';
</script>

<template>
  <ion-content class="loading-content">
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size-md="5" size-lg="4" size-xs="10">
          <div class="logo-container">
            <img src="../../../assets/logo_transparent_white.png" alt="Logo" />
          </div>
        </ion-col>
      </ion-row>
      <ion-row class="ion-justify-content-center ion-align-items-center">
       <ion-col size="6">
          <div class="header-title">
            <h2>Syncing...</h2>
          </div>
        </ion-col>

      </ion-row>
      <ion-row class="ion-justify-content-center ion-align-items-center">
        <ion-col size="2">
          <ion-spinner name="crescent" />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<style scoped>
.loading-content {
  --background: black;
}
.logo-container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 50px;
}

.header-title {
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
}
</style>