<script setup lang="ts">
  import { IonTabBar,
           IonTabButton,
           IonTabs,
           IonLabel,
           IonIcon,
           IonPage,
           IonFab,
           IonFabButton,
           IonRouterOutlet,
           modalController} from '@ionic/vue';
  import { personCircleOutline, nutritionOutline, barbellOutline, homeSharp, addOutline } from 'ionicons/icons';
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
          <ion-icon aria-hidden="true" src="../../assets/icons/home_1.svg" />
          <ion-label>{{ $t('home.title') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="workouts" href="/tabs/workouts">
          <ion-icon aria-hidden="true" src="../../assets/icons/workout_1.svg" />
          <ion-label>{{ $t('workouts.title') }}</ion-label>
        </ion-tab-button>

        <svg height="50" viewBox="0 0 100 50" width="100" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 0v50H0V0c.543 27.153 22.72 49 50 49S99.457 27.153 99.99 0h.01z" fill="red" fill-rule="evenodd"></path>
        </svg>

        <ion-tab-button tab="nutrition" href="/tabs/nutrition">
          <ion-icon aria-hidden="true" src="../../assets/icons/nutrition_1.svg" />
          <ion-label>{{ $t('nutrition.title') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon aria-hidden="true" src="../../assets/icons/profile_1.svg" />
          <ion-label>{{ $t('profile.title') }}</ion-label>
        </ion-tab-button>

     </ion-tab-bar>
    </ion-tabs>
    <ion-fab vertical="bottom" horizontal="center" translucent="true">
      <ion-fab-button @click="openModal">
        <ion-icon :icon="addOutline"/>
      </ion-fab-button>
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