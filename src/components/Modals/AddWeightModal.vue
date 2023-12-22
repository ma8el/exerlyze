<script setup lang="ts">
  import { IonModal,
           IonDatetime,
           IonDatetimeButton,
           IonCol,
           IonLabel,
           IonIcon,
           IonList,
           IonItem,
           IonButton,
           modalController } from '@ionic/vue';
  import { bookmarkOutline, scaleOutline } from 'ionicons/icons';
  import { useWeightStore } from '@/store/bodyMetricsStore';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import BaseFullPageModal from './BaseFullPageModal.vue';
  import NumericInput from '../NumericInput.vue';
  import InputItem from '../InputItem.vue';
  import DateTimeInput from '../DateTimeInput.vue';
  import { ref, onMounted } from 'vue';

  const weightStore = useWeightStore();
  const userSettingsStore = useUserSettingsStore();
  const locale = userSettingsStore.getLocale();
  const inputDate = ref<string>(new Date().toISOString());

  const weight = ref<number>();
  const weightValid = ref<boolean>(true);

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

  onMounted(() => {
    weight.value = weightStore.currentWeight.weight;
  });
</script>

<template>
  <BaseFullPageModal
    :disable-button="!weightValid"
  >
    <template #saveButton>
      <ion-icon :icon="bookmarkOutline" @click="saveWeight()"/>
    </template>
    <template #modalHeader>
      <p class="header-title">{{ $t('addWeight') }}</p>
    </template>
    <template #modalContent>
      <ion-list>
        <InputItem
          :icon="scaleOutline"
          icon-size="40px"
          slotSize="8"
          label-size="2"
        >
          <NumericInput
            :label="$t('enterWeight')"
            :placeholder="$t('weight')"
            :minValue="0"
            :maxValue="500"
            :inputValue="weight === undefined ? 0 : weight"
            @update:inputValue="weight = $event"
            @update:valid="weightValid = $event"
          />
          <template #label>
            <ion-button expand="block" shape="round" color="primary">
              {{ $t('weightUnitBig') }} 
            </ion-button>
          </template>
        </InputItem>

        <DateTimeInput
          :input-date="inputDate"
          @update:input-date="inputDate = $event"
          icon-size="25px"
          padding-start="8px"
          class="ion-margin"
        />
     </ion-list>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
ion-list {
  --ion-item-background: transparent;
}
ion-item {
  :is(ion-button) {
      margin: 0 0 0 16px;
  }
}
.header-title {
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
</style>