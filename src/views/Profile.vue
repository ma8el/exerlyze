<script setup lang="ts">
  import {
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
  import { 
    languageOutline,
    personOutline,
    documentTextOutline,
    barChartOutline,
    notificationsOutline,
    mailOutline,
    checkboxOutline,
    listOutline,
  } from 'ionicons/icons';
  import { useUserStore, useWeightStore } from '@/store/bodyMetricsStore';
  import { useUserSettingsStore } from '@/store/userSettingsStore';
  import { useI18n } from 'vue-i18n';
  import { onMounted } from 'vue';

  const router = useRouter();
  const userStore = useUserStore();
  const userWeightStore = useWeightStore();
  const userSettingsStore = useUserSettingsStore();

  const i18n = useI18n();

  const userName = userStore.getUserName();
  const userAge = userStore.getAge();
  const userHeight = userStore.getHeight();
  const userWeight = userWeightStore.getCurrentWeight;

  const selectedLang = userSettingsStore.getLocale()

  const changeLocale = (lang: string) => {
    userSettingsStore.setLocale(lang)
    i18n.locale.value = lang;
  };

  const openProfileSettings = () => {
    router.push('/profile-settings');
  };

  const openWorkoutSettings = () => {
    router.push('/workout-settings');
  };

  const openActivityHistory = () => {
    router.push('/activity-history');
  };

  const openInsights = () => {
    router.push('/insights');
  };
</script>

<template>
  <AppLayout :title="$t('profile.title')">
    <template #avatar>
      <div class="avatar-wrapper">
        <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
      </div>
      <div class="name">
        <ion-label class="name_lbl">{{ userName }}</ion-label>
      </div>
    </template>
 
    <ion-row>
      <ion-col size="4">
        <ion-card class="data">
          <ion-label class="frst_lbl">{{ userHeight }} cm</ion-label>
          <ion-label class="scnd_lbl">Height</ion-label>
        </ion-card>
      </ion-col>
  
      <ion-col size="4">
        <ion-card class="data">
          <ion-label class="frst_lbl">{{ userWeight.weight }} kg</ion-label>
          <ion-label class="scnd_lbl">Weight</ion-label>
        </ion-card>
      </ion-col>
  
      <ion-col size="4">
        <ion-card class="data">
          <ion-label class="frst_lbl">{{ userAge }}</ion-label>
          <ion-label class="scnd_lbl">Age</ion-label>
        </ion-card>
      </ion-col>
    </ion-row>
  
    <div class="account">
      <ion-label class="head_lbl">Account</ion-label>
      <div class="info">
        <ion-item lines="none" :button="true" @click="openProfileSettings()">
          <ion-icon :icon="personOutline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>Personal Data</ion-label>
        </ion-item>
        <ion-item lines="none" :button="true" @click="openWorkoutSettings()">
          <ion-icon :icon="documentTextOutline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>Workout Settings</ion-label>
        </ion-item>
        <ion-item lines="none" :button="true" @click="openActivityHistory()">
          <ion-icon :icon="listOutline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>Activity Histrory</ion-label>
        </ion-item>
        <ion-item lines="none" :button="true" @click="openInsights()">
          <ion-icon :icon="barChartOutline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>Insights</ion-label>
        </ion-item>
      </div>
    </div>
  
    <div class="notification">
      <ion-label class="head_lbl">Notification</ion-label>
      <ion-item lines="none">
        <ion-icon :icon="notificationsOutline" color="primary" style="margin-right: 10px;"></ion-icon>
        <ion-label>Pop-out Notificatioon</ion-label>
        <ion-toggle mode="ios" color="primary" checked></ion-toggle>
      </ion-item>
    </div>
  
    <div class="other">
      <ion-label class="head_lbl">Other</ion-label>
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
        </ion-select>
      </ion-item>
 
      <ion-item lines="none">
        <ion-icon :icon="mailOutline" color="primary" style="margin-right: 10px;"></ion-icon>
        <ion-label>Contact Us</ion-label>
      </ion-item>
      <ion-item lines="none">
        <ion-icon :icon="checkboxOutline" color="primary" style="margin-right: 10px;"></ion-icon>
        <ion-label>Privacy Policy</ion-label>
      </ion-item>
   </div>
  </AppLayout>
</template>

<style scoped lang="scss">
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
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.name {
  display: flex;
  font-size: 1.5rem;
  margin-left: 10px;
  flex-direction: column;
  align-items: center;
  .name_lbl {
    margin: 50px 0 5px 0;
  }
}
ion-content {
  ion-item {
    margin-top: 10px;
    border-radius: 10px;
  }
  ion-row {
    margin: 0 1rem 0 0;
    ion-col {
      border-radius: 10px;
      .data {
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
    .head_lbl {
      font-size: 18px;
    }
    .info {
      ion-icon {
        font-size: 20px;
      }
      ion-label {
        font-size: 14px;
      }
    }
  }
  .notification {
    padding: 10px;
    margin-top: 1rem;
    border-radius: 10px;
    .head_lbl {
      font-size: 18px;
    }
    ion-item {
      ion-icon {
        font-size: 20px;
      }
      ion-label {
        font-size: 14px;
      }
    }
  }
  .other {
    padding: 10px;
    margin-top: 1rem;
    margin-bottom: 100px;
    .head_lbl {
      font-size: 18px;
    }
    ion-item {
      ion-icon {
        font-size: 20px;
      }
     ion-label {
        font-size: 14px;
      }
    }
  }
}
</style>