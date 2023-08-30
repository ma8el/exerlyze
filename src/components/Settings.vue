<script setup lang="ts">
  import { IonButton, IonList, IonListHeader, IonItem, IonToggle, IonSelect, IonSelectOption, modalController } from '@ionic/vue';
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
  <BaseFullPageModal :title="$t('settings.title')">
    <template #saveButton>
          <ion-button @click="save">{{ $t('save') }}</ion-button>
    </template>
    <template #modalContent>
      <ion-list>
        <ion-list-header>{{ $t('settings.general') }}</ion-list-header>
        <ion-item>
          <ion-select 
            :label="$t('language')"
            :placeholder="$t('language')"
            v-model="selectedLang"
            @ionChange="changeLocale($event.detail.value)"
          >
            <ion-select-option value="en">🇬🇧 English</ion-select-option>
            <ion-select-option value="de">🇩🇪 Deutsch</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="setting1">Darkmode</ion-toggle>
        </ion-item>
        <ion-list-header>{{ $t('settings.workout') }}</ion-list-header>
        <ion-item>
          <ion-toggle v-model="setting1">Cycle Length</ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="setting2">Pause time</ion-toggle>
        </ion-item>
        <ion-list-header>{{ $t('settings.progression') }}</ion-list-header>
        <ion-item>
          <ion-toggle v-model="setting2">Set progression</ion-toggle>
        </ion-item>
        <ion-item>
          <ion-toggle v-model="setting2">Weight progression</ion-toggle>
        </ion-item>
      </ion-list>
    </template>
  </BaseFullPageModal>
</template>