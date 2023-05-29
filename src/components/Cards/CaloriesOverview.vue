<script setup lang="ts">
  import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonText, IonLabel } from '@ionic/vue';
  import { computed, ref } from 'vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';

  const calories = ref(3000);
  const activity = ref(0);

  const intake = computed(() => {
    return useFoodDiaryStore().getCaloriesOfDate(new Date());
  })

  const result = computed(() => {
    return calories.value - intake.value + activity.value;
  })

</script>

<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Calories</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-text>
              {{ calories }}
              <ion-label>Calories</ion-label>
            </ion-text>
          </ion-col>
          <ion-col>
            <ion-text>
              -
            </ion-text>
          </ion-col>
          <ion-col>
            <ion-text>
              {{ intake }}
              <ion-label>Intake</ion-label>
            </ion-text>
          </ion-col>
          <ion-col>
            <ion-text>
              +
            </ion-text>
          </ion-col>
          <ion-col>
            <ion-text>
              {{ activity }}
              <ion-label>Activity</ion-label>
            </ion-text>
          </ion-col>
          <ion-col>
            <ion-text>
              =
            </ion-text>
          </ion-col>
          <ion-col>
            <ion-text>
              {{ result }}
              <ion-label>Left</ion-label>
            </ion-text>
          </ion-col>
        </ion-row>
     </ion-grid>
    </ion-card-content>
  </ion-card>
</template>