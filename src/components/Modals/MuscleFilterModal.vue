<script setup lang="ts">
import { IonButton,
         IonContent,
         IonHeader,
         IonToolbar,
         IonTitle,
         IonButtons,
         IonGrid,
         IonRow,
         IonCol,
         IonRadio,
         IonRadioGroup,
         modalController } from '@ionic/vue';
import { useMuscleStore } from '@/store/workoutStore';
import { ref } from 'vue';

const radio = ref('all');
const muscleStore = useMuscleStore()

const closeModal = () => {
  return modalController.dismiss(null, 'close');
};

const save = () => {
  const today = new Date();
  return modalController.dismiss({'selected': radio.value}, 'save');
};
</script>

<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-title>Filter</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">{{ $t('dismiss') }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-radio-group v-model="radio">
          <ion-col>
            <div class="radio-chip">
              <ion-radio 
                label-placement="start"
                value="all"
              >
                {{ $t('all') }}
              </ion-radio>
            </div>
          </ion-col>
          <ion-col
            v-for="muscle in muscleStore.getMuscles"
            :key="muscle.id"
          >
            <div class="radio-chip">
              <ion-radio 
                label-placement="start"
                :value="muscle.id"
              >
               {{ muscle.name_de }}
              </ion-radio>
            </div>
          </ion-col>
        </ion-radio-group>
      </ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-button class="save-button" @click="save()">{{ $t('save') }}</ion-button>
      </ion-row>

   </ion-content>
  </ion-content>
</template>

<style scoped>
.radio-chip {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 8px;
  margin: 4px;
  border-radius: 16px;
  cursor: pointer;
}

.save-button {
    display: flex;
    justify-content: center;
    width: 50%;
    margin-top: 1rem;
}

ion-datetime-button {
  --background: #000;
  --color: var(--ion-color-primary);
  --border-color: var(--ion-color-primary);
  --border-radius: 0;
  --border-width: 0;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-bottom: 0;
}

ion-datetime {
  --background: var(--ion-card-background);
}
</style>