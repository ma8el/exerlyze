<script setup lang="ts">
  import { IonTabBar,
           IonTabButton,
           IonTabs,
           IonLabel,
           IonIcon,
           IonPage,
           IonFab,
           IonFabList,
           IonFabButton,
           IonRouterOutlet,
           modalController,
           onIonViewDidEnter,
           onIonViewDidLeave} from '@ionic/vue';
  import { scaleOutline, clipboardOutline, addOutline } from 'ionicons/icons';
  import OfflineToast from '@/components/Toasts/OfflineToast.vue';
  import AddWorkoutModal from '@/components/Modals/AddWorkoutModal.vue';
  import AddWorkoutPlanModal from '@/components/Modals/AddWorkoutPlanModal.vue';
  import AddNutritionModal from '@/components/Modals/AddNutritionModal.vue';
  import AddWeightModal from '@/components/Modals/AddWeightModal.vue';
  import HomeIcon from '@/icons/home.svg';
  import NutritionIcon from '@/icons/nutrition.svg';
  import ProfileIcon from '@/icons/profile.svg';
  import WorkoutIcon from '@/icons/workout.svg';
  import { ref } from 'vue'

  const tabsInView = ref<Boolean>(false)
  
  const openWorkoutModal = async () => {
    const modal = await modalController.create({
      component: AddWorkoutModal,
      cssClass: 'full-screen-modal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'save') {
      console.log('Save', data);
    } else {
      console.log('Close', data);
    };
  }

  const openWorkoutPlanModal = async () => {
    const modal = await modalController.create({
      component: AddWorkoutPlanModal,
      cssClass: 'full-screen-modal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'save') {
      console.log('Save', data);
    } else {
      console.log('Close', data);
    };
  }

  const openWeightModal = async () => {
    const modal = await modalController.create({
      component: AddWeightModal,
      cssClass: 'full-screen-modal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'save') {
      console.log('Save', data);
    } else {
      console.log('Close', data);
    };
  }

  const openNutritionModal = async () => {
    const modal = await modalController.create({
      component: AddNutritionModal,
      cssClass: 'full-screen-modal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'save') {
      console.log('Save', data);
    } else {
      console.log('Close', data);
    };
  }

onIonViewDidEnter(() => {
  tabsInView.value = true
}
)

onIonViewDidLeave(() =>{
  tabsInView.value = false
})
</script>

<template>
  <ion-page>
   <OfflineToast
     v-if="tabsInView"
     anchor-id="tab-fab-button"
   />
   <ion-tabs >
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar id="tabs" slot="bottom" class="custom-tab-bar">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon aria-hidden="true" :icon="HomeIcon" />
          <ion-label>{{ $t('home.title') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="workouts" href="/tabs/workouts">
          <ion-icon aria-hidden="true" :icon="WorkoutIcon" />
          <ion-label>{{ $t('workouts.title') }}</ion-label>
        </ion-tab-button>

        <svg height="50" viewBox="0 0 100 50" width="100" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 0v50H0V0c.543 27.153 22.72 49 50 49S99.457 27.153 99.99 0h.01z" fill="red" fill-rule="evenodd"></path>
        </svg>

        <ion-tab-button tab="nutrition" href="/tabs/nutrition">
          <ion-icon aria-hidden="true" :icon="NutritionIcon" />
          <ion-label>{{ $t('nutrition.title') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon aria-hidden="true" :icon="ProfileIcon" />
          <ion-label>{{ $t('profile.title') }}</ion-label>
        </ion-tab-button>

     </ion-tab-bar>
    </ion-tabs>
    <ion-fab id="tab-fab-button" vertical="bottom" horizontal="center" translucent="true">
      <ion-fab-button>
        <ion-icon :icon="addOutline"/>
      </ion-fab-button>
      <ion-fab-list side="top">
        <ion-fab-button color="primary" @click="openWeightModal">
          <ion-icon :icon="scaleOutline"></ion-icon>
        </ion-fab-button>
        <ion-fab-button color="primary" @click="openNutritionModal">
          <ion-icon :icon="NutritionIcon"></ion-icon>
        </ion-fab-button>
        <ion-fab-button color="primary" @click="openWorkoutPlanModal">
          <ion-icon :icon="clipboardOutline"></ion-icon>
        </ion-fab-button>
        <ion-fab-button color="primary" @click="openWorkoutModal">
          <ion-icon :icon="WorkoutIcon"></ion-icon>
        </ion-fab-button>
      </ion-fab-list>
    </ion-fab>
  </ion-page>
</template>

<style scoped lang="scss">
ion-tabs{
	ion-fab {
		margin-bottom: env(safe-area-inset-bottom); /* fix notch ios*/
		ion-fab-button {
			--box-shadow: none;
		}
	}
	ion-tab-bar {
		--border: 0;
		--background: transparent;
		position: absolute;
		bottom: 0;
		left:0; right: 0;
		width: 100%;
		&:after{
			content: " ";
			width: 100%;
			bottom: 0;
			background: var(--ion-color-light);
			height: env(safe-area-inset-bottom);
			position: absolute;
		}
		ion-tab-button {
			--background: var(--ion-color-light);
		}
		ion-tab-button.md {
			--background: var(--ion-color-light);
      font-size: 0.5rem;
      :is(ion-icon) {
        font-size: 2rem;
      }
		}
		ion-tab-button.comments {
			margin-right: 0px;
			border-top-right-radius: 18px;
		}
	  ion-tab-button.notifs {
			margin-left: 0px;
			border-top-left-radius: 18px;
		}
		svg {    
			width: 72px;
			margin-top: 19px;
			path{
				fill:  var(--ion-color-light);
			}		
		}
	}
}
</style>