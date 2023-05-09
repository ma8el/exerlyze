<script setup lang="ts">
  import { IonCard, IonList, IonItem, IonLabel, IonNote, IonListHeader } from '@ionic/vue';

</script>

<template>
  <ion-card>
    <ion-list>
      <ion-list-header>
        <ion-label>Nutrition Facts</ion-label>
      </ion-list-header>
      <ion-item>
        <ion-label>Carbs</ion-label>
        <ion-note slot="end">0 / 150g</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Fat</ion-label>
        <ion-note slot="end">0 / 50g</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Protein</ion-label>
        <ion-note slot="end">0 / 100g</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Vitamin A</ion-label>
        <ion-note slot="end">0 / 10mg</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Vitamin D</ion-label>
        <ion-note slot="end">0 / 50mg</ion-note>
      </ion-item>
      <ion-item>
        <ion-label>Zinc</ion-label>
        <ion-note slot="end">0 / 15mg</ion-note>
      </ion-item>

    </ion-list>
  </ion-card>

</template>