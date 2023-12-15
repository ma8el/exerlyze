<script setup lang="ts">
  import { IonContent,
           IonRow,
           IonCol,
           IonFab,
           IonIcon,
           modalController, 
           IonFabButton} from '@ionic/vue';
  import { arrowBackSharp } from 'ionicons/icons';

  const props = defineProps({
    title: String,
    backColor: {
      type: String,
      default: 'light'
    },
    saveButton: {
      type: Boolean,
      default: true
    },
    disableButton: {
      type: Boolean,
      default: false
    }
 })

  const closeModal = () => {
      return modalController.dismiss(null, 'close');
  };
</script>

<template>
  <ion-content>
    <div class="header-container">
      <ion-row>
        <ion-col>
          <ion-fab vertical="top" horizontal="start">
            <ion-fab-button :color="backColor" size="small" @click="closeModal">
              <ion-icon :icon="arrowBackSharp"></ion-icon>
            </ion-fab-button>
          </ion-fab>
          <ion-fab v-if="saveButton" vertical="top" horizontal="end">
            <ion-fab-button :color="backColor" size="small" :disabled="disableButton">
              <slot name="saveButton"></slot>
            </ion-fab-button>
          </ion-fab>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <slot name="modalHeader"></slot>
        </ion-col>
      </ion-row>
    </div>
    <slot name="modalContent"></slot>
  </ion-content>
  <slot name="modalFooter"></slot>
</template>

<style scoped>
.header-container {
  width: 100%;
  min-height: 70px;
}

ion-content {
	overflow: hidden;
  --background: none;
  background-image: url('../../../assets/app_background.jpg');
  background-size: cover;
}
</style>