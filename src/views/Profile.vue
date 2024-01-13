<script setup lang="ts">
  import {
    IonContent,
    IonItem,
    IonLabel,
    IonRow,
    IonCol,
    IonCard,
    IonToggle,
    IonIcon,
    IonSelect,
    IonSelectOption,
  } from '@ionic/vue';
  import AppLayout from '@/layouts/AppLayout.vue';
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import { 
    languageOutline,
    personOutline,
    barChartOutline,
    notificationsOutline,
    mailOutline,
    checkboxOutline,
    barbellOutline,
    restaurantOutline,
    listOutline,
  } from 'ionicons/icons';
  import { useUserStore, useWeightStore } from '@/store/bodyMetricsStore';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import { useI18n } from 'vue-i18n';

  const router = useRouter();
  const userStore = useUserStore();
  const userWeightStore = useWeightStore();
  const userSettingsStore = useUserSettingsStore();

  const i18n = useI18n();

  const userName = ref(userStore.getUserName());
  const userAge = ref(userStore.getAge());
  const userHeight = ref(userStore.getHeight());
  const userWeight = ref(userWeightStore.currentWeight);

  const selectedLang = ref(userSettingsStore.getLocale())

  const changeLocale = (lang: string) => {
    userSettingsStore.setLocale(lang)
    i18n.locale.value = lang;
  };

  const openProfileSettings = () => {
    router.push('/profile-settings');
  };

  const openFitnessLevelSettings = () => {
    router.push('/fitness-level-settings');
  };

  const openDietGoalSettings = () => {
    router.push('/complete-diet-profile');
  };

  const openActivityHistory = () => {
    router.push('/activity-history');
  };

  const openInsights = () => {
    router.push('/insights');
  };

  userWeightStore.$subscribe(() => {
    userWeight.value = userWeightStore.currentWeight;
  });

  userStore.$subscribe(() => {
    userName.value = userStore.getUserName();
    userAge.value = userStore.getAge();
    userHeight.value = userStore.getHeight();
  });
</script>

<template>
  <AppLayout :title="$t('profile.title')">
    <template #avatar>
      <Transition name="fade" class="avatar-wrapper">
        <div class="avatar-wrapper">
          <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </div>
      </Transition>
    </template>

    <div class="sticky-header">
      <div class="name">
        <ion-label class="name_lbl">{{ userName }}</ion-label>
      </div>
      <ion-row class="ion-margin">
        <ion-col size="4">
          <ion-card class="data">
            <ion-label class="frst_lbl">{{ userHeight }} cm</ion-label>
            <ion-label class="scnd_lbl">{{ $t('profile.height') }}</ion-label>
          </ion-card>
        </ion-col>

        <ion-col size="4">
          <ion-card class="data">
            <ion-label class="frst_lbl">{{ userWeight.weight }} kg</ion-label>
            <ion-label class="scnd_lbl">{{ $t('profile.weight') }}</ion-label>
          </ion-card>
        </ion-col>

        <ion-col size="4">
          <ion-card class="data">
            <ion-label class="frst_lbl">{{ userAge }}</ion-label>
            <ion-label class="scnd_lbl">{{ $t('profile.age') }}</ion-label>
          </ion-card>
        </ion-col>
      </ion-row>
    </div>

    <div class="account">
      <ion-label class="head_lbl">{{ $t('profile.account') }}</ion-label>
      <div class="info">
        <ion-item lines="none" :button="true" @click="openProfileSettings()">
          <ion-icon :icon="personOutline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>{{ $t('profile.personalData') }}</ion-label>
        </ion-item>
        <ion-item lines="none" :button="true" @click="openFitnessLevelSettings()">
          <ion-icon :icon="barbellOutline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>{{ $t('settings.fitnessLevel') }}</ion-label>
        </ion-item>
        <ion-item lines="none" :button="true" @click="openDietGoalSettings()">
          <ion-icon :icon="restaurantOutline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>{{ $t('settings.dietGoals') }}</ion-label>
        </ion-item>
        <ion-item lines="none" :button="true" @click="openActivityHistory()">
          <ion-icon :icon="listOutline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>{{ $t('activityHistory') }}</ion-label>
        </ion-item>
        <ion-item lines="none" :button="true" @click="openInsights()">
          <ion-icon :icon="barChartOutline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>{{ $t('insights') }}</ion-label>
        </ion-item>
      </div>
    </div>

    <div class="notification">
      <ion-label class="head_lbl">{{ $t('profile.notification') }}</ion-label>
      <ion-item lines="none">
        <ion-icon :icon="notificationsOutline" color="primary" style="margin-right: 10px;"></ion-icon>
        <ion-label>Pop-out Notificatioon</ion-label>
        <ion-toggle mode="ios" color="primary" checked></ion-toggle>
      </ion-item>
    </div>

    <div class="other">
      <ion-label class="head_lbl">{{ $t('profile.other') }}</ion-label>
      <ion-item lines="none">
        <ion-icon :icon="languageOutline" color="primary" style="margin-right: 10px"></ion-icon>
        <ion-select 
          :label="$t('language')"
          :placeholder="$t('language')"
          v-model="selectedLang"
          @ionChange="changeLocale($event.detail.value)"
        >
          <ion-select-option value="en">🇬🇧 English</ion-select-option>
          <ion-select-option value="de">🇩🇪 Deutsch</ion-select-option>
          <ion-select-option value="fr">🇫🇷 Français</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item lines="none">
        <ion-icon :icon="mailOutline" color="primary" style="margin-right: 10px;"></ion-icon>
        <ion-label>{{ $t('profile.contactUs') }}</ion-label>
      </ion-item>
      <ion-item lines="none">
        <ion-icon :icon="checkboxOutline" color="primary" style="margin-right: 10px;"></ion-icon>
        <ion-label>{{ $t('profile.privacyPolicy') }}</ion-label>
      </ion-item>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
.sticky-header {
  position: sticky;
  top: 0;
  background-color: var(--ion-background-color);
  z-index: 100;
}

.avatar-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  top: 30px;
  left: 50%; /* Center the avatar */
  transform: translateX(-50%); /* Adjust for exact centering */
  border: 3px solid white;
  z-index: 10;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  :is(img) {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.name {
  display: flex;
  font-size: 1.5rem;
  flex-direction: column;
  align-items: center;
  .name_lbl {
    margin: 50px 0 0 0;
  }
}
ion-content {
  --background: none;
  :is(ion-row) {
    :is(ion-col) {
      border-radius: 10px;
      .data {
        margin: 0rem;
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 100%;
        .frst_lbl {
          margin: 5px 0 0 0;
          color: var(--ion-color-primary);
        }
        .scnd_lbl {
          margin: 5px 0 5px 0;
          font-size: 14px;
        }
      }
    }
  }
  .account {
    padding: 10px;
    margin-top: 1rem;
    border-radius: 10px;
    :is(ion-item) {
      margin-top: 10px;
      border-radius: 10px;
    }
    .head_lbl {
      font-size: 18px;
    }
    .info {
      :is(ion-icon) {
        font-size: 20px;
      }
      :is(ion-label) {
        font-size: 14px;
      }
    }
  }
  .notification {
    padding: 10px;
    margin-top: 1rem;
    border-radius: 10px;
    :is(ion-item) {
      margin-top: 10px;
      border-radius: 10px;
    }
    .head_lbl {
      font-size: 18px;
    }
    :is(ion-item) {
      :is(ion-icon) {
        font-size: 20px;
      }
      :is(ion-label) {
        font-size: 14px;
      }
    }
  }
  .other {
    padding: 10px;
    margin-top: 1rem;
    margin-bottom: 150px;
    :is(ion-item) {
      margin-top: 10px;
      border-radius: 10px;
    }
    .head_lbl {
      font-size: 18px;
    }
    :is(ion-item) {
      :is(ion-icon) {
        font-size: 20px;
      }
     :is(ion-label) {
        font-size: 14px;
      }
    }
    :is(ion-select) {
      font-size: 14px;
    }
  }
}
</style>