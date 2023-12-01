<script setup lang="ts">
import { supabase } from '@/supabase';
import { IonButton,
         IonContent,
         IonModal,
         IonDatetimeButton,
         IonDatetime,
         IonHeader,
         IonToolbar,
         IonTitle,
         IonIcon,
         IonButtons,
         IonGrid,
         IonRow,
         IonCol,
         IonRadioGroup,
         IonRadio,
         modalController } from '@ionic/vue';
import { lockClosedOutline } from 'ionicons/icons';
import { ref, computed } from 'vue';

const radio = ref('week');
const startDate = ref((new Date()).toISOString());
const endDate = ref((new Date()).toISOString());

const authenticated = computed(() => {
  return supabase.auth.getSession() != null;
});

const dateTimeDisabled = computed(() => {
  return radio.value !== 'custom';
});

const closeModal = () => {
  return modalController.dismiss(null, 'close');
};

const save = () => {
  const today = new Date();
  if (radio.value === 'custom') {
    const start = new Date(new Date(startDate.value).setHours(0, 0, 0, 0));
    const end = new Date(new Date(endDate.value).setHours(23, 59, 59, 999));
    if (start > end) {
      return
    }
    return modalController.dismiss({'selected': radio.value, 'startDate': start, 'endDate': end}, 'save');
  } else if (radio.value === 'month') {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(new Date(today.getFullYear(), today.getMonth() + 1, 0).setHours(23, 59, 59, 999));
    return modalController.dismiss({'selected': radio.value, 'startDate': startOfMonth, 'endDate': endOfMonth}, 'save');
  } else if (radio.value === 'year') {
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(new Date(today.getFullYear(), 11, 31).setHours(23, 59, 59, 999));
    return modalController.dismiss({'selected': radio.value, 'startDate': startOfYear, 'endDate': endOfYear}, 'save');
  } else if (radio.value === 'all') {
    const startOfAll = new Date(0);
    const endOfAll = new Date(new Date().setHours(23, 59, 59, 999));
    return modalController.dismiss({'selected': radio.value, 'startDate': startOfAll, 'endDate': endOfAll}, 'save');
  } else {
    const startOfWeek = new Date(new Date().setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))).setHours(0, 0, 0, 0);
    const endOfWeek = new Date(new Date().setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? 0 : 7))).setHours(23, 59, 59, 999);
    return modalController.dismiss({'selected': radio.value, 'startDate': new Date(startOfWeek), 'endDate': new Date(endOfWeek)}, 'save');
  };
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
                  :disabled="!authenticated"
                >
                  <ion-icon 
                    :icon="lockClosedOutline"
                    v-if="!authenticated"
                  />
                  Month
                </ion-radio>
              </div>
            </ion-col>
            <ion-col>
              <div class="radio-chip">
                <ion-radio 
                  label-placement="start"
                  value="year"
                  :disabled="!authenticated"
                >
                  <ion-icon 
                    :icon="lockClosedOutline"
                    v-if="!authenticated"
                  />
                  Year
                </ion-radio>
              </div>
            </ion-col>
            <ion-col>
              <div class="radio-chip">
                <ion-radio 
                  label-placement="start"
                  value="all"
                  :disabled="!authenticated"
                >
                  <ion-icon 
                    :icon="lockClosedOutline"
                    v-if="!authenticated"
                  />
                  All
                </ion-radio>
              </div>
            </ion-col>

            <ion-col>
              <div class="radio-chip">
                <ion-radio 
                  label-placement="start"
                  value="custom"
                  :disabled="!authenticated"
                >
                  <ion-icon 
                    :icon="lockClosedOutline"
                    v-if="!authenticated"
                  />
                  Custom
                </ion-radio>
              </div>
            </ion-col>

          </ion-radio-group>
        </ion-row>

        <ion-row class="ion-justify-content-center ion-align-items-center">
          <ion-col size="5">
            <ion-datetime-button 
              datetime="startDate"
              :disabled="dateTimeDisabled"
            />
          </ion-col>
          <ion-col size="2">
            <p class="ion-text-center">to</p>
          </ion-col>
          <ion-col size="5">
            <ion-datetime-button 
              datetime="endDate"
              :disabled="dateTimeDisabled"
            />
          </ion-col>
        </ion-row>

        <ion-row class="ion-justify-content-center">
          <ion-button class="save-button" @click="save()">Save</ion-button>
        </ion-row>
      </ion-grid>

      <ion-modal :keep-contents-mounted="true">
        <ion-datetime 
          id="startDate"
          presentation="date"
          :show-default-buttons="true"
          v-model="startDate"
        />
      </ion-modal>

      <ion-modal :keep-contents-mounted="true">
        <ion-datetime 
          id="endDate" 
          presentation="date"
          :show-default-buttons="true"
          v-model="endDate"
        />
      </ion-modal>
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