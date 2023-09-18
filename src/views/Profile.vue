<script setup lang="ts">
  import {
    IonItem,
    IonThumbnail,
    IonButton,
    IonLabel,
    IonRow,
    IonCol,
    IonCard,
    IonToggle,
    IonIcon,
  } from '@ionic/vue';
  import AppLayout from '@/layouts/AppLayout.vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const openActivityHistory = () => {
    router.push('/activity-history');
  };

</script>

<template>
  <AppLayout :title="$t('profile.title')">
    <ion-item lines="none">
      <ion-thumbnail>
        <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
      </ion-thumbnail>
      <div class="name">
        <ion-label class="name_lbl">Stefani Wong</ion-label>
      </div>
      <ion-button slot="end" shape="round">
        Edit
      </ion-button>
    </ion-item>
  
    <ion-row>
      <ion-col size="4">
        <ion-card class="data">
          <ion-label class="frst_lbl">180cm</ion-label>
          <ion-label class="scnd_lbl">Height</ion-label>
        </ion-card>
      </ion-col>
  
      <ion-col size="4">
        <ion-card class="data">
          <ion-label class="frst_lbl">65kg</ion-label>
          <ion-label class="scnd_lbl">Weight</ion-label>
        </ion-card>
      </ion-col>
  
      <ion-col size="4">
        <ion-card class="data">
          <ion-label class="frst_lbl">22yo</ion-label>
          <ion-label class="scnd_lbl">Age</ion-label>
        </ion-card>
      </ion-col>
    </ion-row>
  
    <div class="account">
      <ion-label class="head_lbl">Account</ion-label>
      <div class="info">
        <ion-item lines="none">
          <ion-icon name="person-outline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>Personal Data</ion-label>
          <ion-icon slot="end" name="chevron-forward" color="medium"></ion-icon>
        </ion-item>
        <ion-item lines="none">
          <ion-icon name="document-text-outline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>Achievement</ion-label>
          <ion-icon slot="end" name="chevron-forward" color="medium"></ion-icon>
        </ion-item>
        <ion-item lines="none" :button="true" @click="openActivityHistory()">
          <ion-icon name="tennisball-outline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>Activity Histrory</ion-label>
          <ion-icon slot="end" name="chevron-forward" color="medium"></ion-icon>
        </ion-item>
        <ion-item lines="none">
          <ion-icon name="bar-chart-outline" color="primary" style="margin-right: 10px;"></ion-icon>
          <ion-label>Workout Progress</ion-label>
          <ion-icon slot="end" name="chevron-forward" color="medium"></ion-icon>
        </ion-item>
      </div>
    </div>
  
    <div class="notification">
      <ion-label class="head_lbl">Notification</ion-label>
      <ion-item lines="none">
        <ion-icon name="notifications-outline" color="primary" style="margin-right: 10px;"></ion-icon>
        <ion-label>Pop-out Notificatioon</ion-label>
        <ion-toggle mode="ios" color="primary" checked></ion-toggle>
      </ion-item>
    </div>
  
    <div class="other">
      <ion-label class="head_lbl">Other</ion-label>
      <ion-item lines="none">
        <ion-icon name="mail-outline" color="primary" style="margin-right: 10px;"></ion-icon>
        <ion-label>Contact Us</ion-label>
        <ion-icon slot="end" name="chevron-forward" color="medium"></ion-icon>
      </ion-item>
      <ion-item lines="none">
        <ion-icon name="checkbox-outline" color="primary" style="margin-right: 10px;"></ion-icon>
        <ion-label>Privacy Policy</ion-label>
        <ion-icon slot="end" name="chevron-forward" color="medium"></ion-icon>
      </ion-item>
      <ion-item lines="none">
        <ion-icon name="settings-outline" color="primary" style="margin-right: 10px;"></ion-icon>
        <ion-label>Settings</ion-label>
        <ion-icon slot="end" name="chevron-forward" color="medium"></ion-icon>
      </ion-item>
    </div>
  </AppLayout>
</template>

<style scoped lang="scss">
ion-content {
  ion-item {
    margin-top: 10px;
    border-radius: 10px;
    ion-thumbnail {
      img {
        height: 50px;
        width: 50px;
        border-radius: 50%;
      }
    }
    .name {
      display: flex;
      margin-left: 10px;
      flex-direction: column;
      .name_lbl {
        margin-bottom: 5px;
      }
      .prgrm_lbl {
        font-size: 14px;
      }
    }
    ion-button {
      width: 70px;
      height: 30px;
    }
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