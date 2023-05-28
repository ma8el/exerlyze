<script setup lang="ts">
  import { IonRow, IonCol, IonLabel } from '@ionic/vue';

  const props = defineProps(['calories', 'carbs', 'protein', 'fat'])
</script>

<template>
  <ion-row>
    <ion-col size="3">
      <ion-label>
        <h3>{{ calories }} kcal</h3>
        <p>Calories</p>
      </ion-label>
    </ion-col>
    <ion-col size="3">
      <ion-label>
        <h3>{{ carbs }} g</h3>
        <p>Carbs</p>
      </ion-label>
    </ion-col>
    <ion-col size="3">
      <ion-label>
        <h3>{{ protein }} g</h3>
        <p>Protein</p>
      </ion-label>
    </ion-col>
    <ion-col size="3">
      <ion-label>
        <h3>{{ fat }} g</h3>
        <p>Fat</p>
      </ion-label>
    </ion-col>
    <ion-col>
    </ion-col>
  </ion-row>
</template>