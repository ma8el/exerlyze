<script setup lang="ts">
  import { IonRow, IonCol, IonLabel } from '@ionic/vue';

  const props = defineProps(['calories', 'carbs', 'protein', 'fat'])
</script>

<template>
  <ion-row>
    <ion-col class="bordered-col centered-col" size="3">
      <ion-label>
        <h3>{{ $t('nutrition.calories') }}</h3>
        <p>{{ calories }} kcal</p>
      </ion-label>
    </ion-col>
    <ion-col class="bordered-col centered-col" size="3">
      <ion-label>
        <h3>{{ $t('nutrition.carbs') }}</h3>
        <p>{{ carbs }} g</p>
      </ion-label>
    </ion-col>
    <ion-col class="bordered-col centered-col" size="3">
      <ion-label>
        <h3>{{ $t('nutrition.protein') }}</h3>
        <p>{{ protein }} g</p>
      </ion-label>
    </ion-col>
    <ion-col class="centered-col" size="3">
      <ion-label>
        <h3>{{ $t('nutrition.fat') }}</h3>
        <p>{{ fat }} g</p>
      </ion-label>
    </ion-col>
    <ion-col>
    </ion-col>
  </ion-row>
</template>

<style scoped lang="scss">
  .bordered-col {
    border-right: 1px solid var(--ion-color-medium);
  }

  .centered-col {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ion-row {
      padding: 10px 10px 0 10px;
      border: 1px solid var(--ion-color-medium); 
      border-radius: 5px;
  }
</style>