<script setup lang="ts">
  import { supabase } from '@/supabase';
  import { IonHeader,
           IonPage,
           IonContent,
           IonToolbar,
           IonTitle,
           IonFab,
           IonFabButton,
           IonButtons, 
           IonIcon} from '@ionic/vue';
  import { arrowBackOutline } from 'ionicons/icons';
  import UpdateIcon from '@/icons/update.svg';
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import { syncWithBackend } from '@/composables/supabase';

  const router = useRouter();
  const session = ref();

  const props = defineProps({
      title: {
        type: String,
        required: true
      },
      actionButton: {
        type: Boolean,
        default: true 
      },
      backButton: {
        type: Boolean,
        default: false
      },
      titleSize: {
        type: String,
        default: '2rem'
      }
 });

  const navigateBack = () => {
    router.back();
  };

  const sync = async () => {
    await syncWithBackend();
  };

  onMounted(async () => {
    const { data } = await supabase.auth.getSession();
    session.value = data.session
  });
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <slot name="toolbarContent">
        <ion-title 
            size="large"
            :class="{'ion-justify-content-center': backButton}"
            :style="`font-size: ${titleSize};`"
        >
            {{ title }}
        </ion-title>
        </slot>
        <ion-buttons 
          slot="end"
          v-if="actionButton"
        >
          <ion-fab v-if="session !== null" horizontal="end">
            <ion-fab-button color="dark" size="small" @click="sync">
              <ion-icon :icon="UpdateIcon"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </ion-buttons>
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
      <slot name="avatar"></slot>
    <ion-content :fullscreen="true">
      <slot></slot>
      <div class="bottom-margin"></div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
* { 
  box-sizing: unset;
  ion-header {
    position: absolute;
    z-index: 1;
    ion-toolbar {
      --background: none;
      background-image: url('../../assets/header_background.jpg');
      background-position: center center;
      background-size: cover;
      padding: 10px 0 20px 0;
    }
    ion-buttons {
      padding-top: 5px;
    }
    ion-title {
      align-items: center;
    }
  }
  ion-content {
    border-radius: 10px 10px 0 0;
  	overflow: hidden;
    --background: none;
    background-image: url('../../assets/app_background.jpg');
    background-size: cover;
    z-index: 2;
    top: 70px;
  }
}
.bottom-margin {
  margin-bottom: 10rem;
}
</style>