<script setup lang="ts">
  import { IonInput,
           IonModal,
           IonDatetime,
           IonDatetimeButton,
           IonCol,
           IonLabel,
           IonIcon,
           IonList,
           IonItem,
           modalController } from '@ionic/vue';
  import { bookmarkOutline } from 'ionicons/icons';
  import { useWeightStore } from '@/store/bodyMetricsStore';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import { ref, onMounted, watch } from 'vue';

  const weightStore = useWeightStore();
  const userSettingsStore = useUserSettingsStore();
  const locale = userSettingsStore.getLocale();
  const inputDate = ref<string>(new Date().toISOString());

  const weight = ref<number>();

  const closeModal = () => {
      return modalController.dismiss(null, 'close');
  };

  const saveWeight = async () => {
    if (!weight.value) {
      return
    }
    weightStore.addWeight({
      'id': weightStore.getNewId(),
      'weight': weight.value,
      'created_at': new Date(inputDate.value),
      'updated_at': new Date(inputDate.value),
      'unit': 'kg',
    });
    closeModal();
    weight.value = undefined;
  };

  watch(inputDate, (newValue, oldValue) => {
    console.log(inputDate.value)
  });

  onMounted(() => {
    weight.value = weightStore.getCurrentWeight.weight;
  });
</script>

<template>
  <BaseFullPageModal>
    <template #saveButton>
      <ion-icon :icon="bookmarkOutline" @click="saveWeight()"/>
    </template>
    <template #modalHeader>
      <p class="header-title">{{ $t('addWeight') }}</p>
    </template>
    <template #modalContent>
      <ion-list>
        <ion-item lines="none">
            <ion-col size="7">
              <ion-label>{{ $t('weight') }}</ion-label>
            </ion-col>
          <ion-col size="5">
          <ion-input
            class="ion-padding"
            :placeholder="$t('enterWeight')"
            v-model="weight"
            type="number"
            input-mode="numeric"
          />
          <span class="unit">{{ $t('weightUnitBig') }}</span>
          </ion-col>
        </ion-item>
        <ion-item lines="none">
          <ion-col size="4">
            <ion-label>{{ $t('date') }}</ion-label>
          </ion-col>
          <ion-col size="8">
            <ion-datetime-button 
              datetime="datetime"
            />
            <ion-modal :keep-contents-mounted="true">
              <ion-datetime
                id="datetime"
                v-model="inputDate"
                :locale="locale"
              />
            </ion-modal>
          </ion-col>
        </ion-item>
      </ion-list>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
.unit {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
}
ion-list {
  margin-top: 1rem;
  --ion-item-background: transparent;
}
ion-item {
  --padding-start: 2rem;
}
ion-chip {
  --background: var(--ion-color-primary);
}
.header-title {
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
</style>