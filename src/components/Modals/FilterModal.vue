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
          IonRadioGroup,
          IonRadio,
          modalController } from '@ionic/vue';
import { ref } from 'vue';

const radio = ref('week');

const closeModal = () => {
  return modalController.dismiss(null, 'close');
};

const save = () => {
  return modalController.dismiss({'selected': radio.value}, 'save');
};
</script>

<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-title>Filter</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Dismiss</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-row class="ion-padding ion-justify-content-center">
          <ion-radio-group v-model="radio">
            <ion-col >
              <div class="radio-chip">
                <ion-radio 
                  label-placement="start"
                  value="week"
                >
                  Week
                </ion-radio>
              </div>
            </ion-col>
            <ion-col>
              <div class="radio-chip">
                <ion-radio 
                  label-placement="start"
                  value="month"
                >
                  Month
                </ion-radio>
              </div>
            </ion-col>
            <ion-col>
              <div class="radio-chip">
                <ion-radio 
                  label-placement="start"
                  value="year"
                >
                  Year
                </ion-radio>
              </div>
            </ion-col>
            <ion-col>
              <div class="radio-chip">
                <ion-radio 
                  label-placement="start"
                  value="all"
                >
                  All
                </ion-radio>
              </div>
            </ion-col>
          </ion-radio-group>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <ion-button class="save-button" @click="save()">Save</ion-button>
        </ion-row>
      </ion-grid>
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
}
</style>