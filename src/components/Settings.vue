<script setup lang="ts">
  import { IonButton, IonList, IonItem, IonToggle, IonSelect, IonSelectOption, modalController } from '@ionic/vue';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import BaseFullPageModal from './Modals/BaseFullPageModal.vue';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  
  const setting1 = ref(false);
  const setting2 = ref(false);
  const i18n = useI18n();

  const userSettingsStore = useUserSettingsStore()
  const selectedLang = userSettingsStore.getLocale()

  const changeLocale = (lang: string) => {
    userSettingsStore.setLocale(lang)
    i18n.locale.value = lang;
  };

  const save = () => {
      return modalController.dismiss({ setting1: setting1.value, setting2: setting2.value }, 'save');
  };
</script>

<template>
  <BaseFullPageModal title="Settings">
    <template #saveButton>
          <ion-button @click="save">{{ $t('save') }}</ion-button>
    </template>
    <template #modalContent>
      <ion-list>
        <ion-item>
          <ion-select 
            :label="$t('language')"
            :placeholder="$t('language')"
            v-model="selectedLang"
            @ionChange="changeLocale($event.detail.value)"
          >
            <ion-select-option value="en">English</ion-select-option>
            <ion-select-option value="de">Deutsch</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="setting1">Setting 1</ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="setting2">Setting 2</ion-toggle>
        </ion-item>
      </ion-list>
    </template>
  </BaseFullPageModal>
</template>