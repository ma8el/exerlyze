<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonContent,
         IonLabel,
         IonPage,
         IonHeader,
         IonToolbar,
         IonButtons,
         IonFab,
         IonFabButton,
         IonIcon
        } from '@ionic/vue'
import { arrowBackOutline } from 'ionicons/icons';

const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  settingComplete: {
    type: Boolean,
    required: false,
    default: false,
  },
  redirectPath: {
    type: String,
    required: true,
  },
  backButton: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const router = useRouter();

const navigateBack = () => {
  router.back();
};

onMounted(() => {
  if (props.settingComplete) {
    router.push(props.redirectPath);
  }
})
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons 
          slot="start"
          v-if="backButton"
        >
          <ion-fab>
            <ion-fab-button color="dark" size="small" @click="navigateBack">
              <ion-icon :icon="arrowBackOutline"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </ion-buttons>
        <slot name="header"></slot>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="image">
        <img :src="image" alt="">
      </div>
      <div class="name">
        <ion-label class="bold_lbl">{{ title }}</ion-label>
        <ion-label class="smpl_lbl">{{ subtitle }}</ion-label>
      </div>
      <slot></slot>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
ion-header {
  position: absolute;
  z-index: 1;
 ion-toolbar {
    padding: 10px 0 20px 0;
    --background: transparent !important;
    --border-color: transparent;
    --box-shadow: none;
  }
  ion-buttons {
    padding-top: 5px;
  }
  ion-title {
    align-items: center;
  }
}
ion-content{
  .image{
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    img{
      height: 300px;
      width: 300px;
    }
  }
  .name{
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin-top: 1.5rem;
    .bold_lbl{
        font-size: 24px;
        margin-bottom: 10px;
        span{
            font-size: 44px;
            color: var(--ion-color-primary);
        }
    }
    .smpl_lbl{
        font-size: 14px;
        margin-bottom: 16px;
    }
  }
  :is(ion-item) {
      border: 1px solid #92949c2a;
      border-radius: 10px;
      margin-top: 16px;
      :is(ion-input) {
          --padding-start: 10px;
      }
  }
}
</style>