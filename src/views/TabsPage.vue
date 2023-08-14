<script setup lang="ts">
  import { IonTabBar,
           IonTabButton,
           IonTabs,
           IonLabel,
           IonIcon,
           IonPage,
           IonRouterOutlet,
           modalController} from '@ionic/vue';
  import { personCircleOutline, nutritionOutline, barbellOutline, homeSharp, add } from 'ionicons/icons';
  import TrackModal from '@/components/Modals/TrackModal.vue';
  
  const openModal = async () => {
    const modal = await modalController.create({
      component: TrackModal,
      cssClass: 'full-screen-modal',
      initialBreakpoint: 0.5,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'save') {
      console.log('Save', data);
    } else {
      console.log('Close', data);
    };
  }

</script>

<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" class="custom-tab-bar">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon aria-hidden="true" :icon="homeSharp" />
          <ion-label>{{ $t('titleHome') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="workouts" href="/tabs/workouts">
          <ion-icon aria-hidden="true" :icon="barbellOutline" />
          <ion-label>{{ $t('titleWorkouts') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button @click="openModal" class="floating-action-button">
          <ion-icon  :icon="add" />
        </ion-tab-button>

        <ion-tab-button tab="nutrition" href="/tabs/nutrition">
          <ion-icon aria-hidden="true" :icon="nutritionOutline" />
          <ion-label>{{ $t('titleNutrition') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="you" href="/tabs/you">
          <ion-icon aria-hidden="true" :icon="personCircleOutline" />
          <ion-label>{{ $t('titleYou') }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<style scoped lang="scss">
.floating-action-button {
  height: 50px;
  border-radius: 50%;
  background-color: #3F63C8;

  ion-icon {
    font-size: 24px;
    color: #ffffff;
  }
}
.custom-tab-bar {
  display: flex;
  justify-content: space-evenly;
}
</style>