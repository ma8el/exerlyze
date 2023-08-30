<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonItem, IonInput, IonButton, IonAlert } from '@ionic/vue';
import { useDark } from '@vueuse/core'
import { supabase } from '@/supabase';

const isDark = useDark();

const email = ref('');
const router = useRouter();
const isOpen = ref(false);
const loading = ref(false);

const alertButtons = [
 {
    text: 'OK',
    handler: () => {
      redirect();
    },
  },
];

const setOpen = (value: boolean) => {
  isOpen.value = value;
};

const onLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
    })
    if (error) throw error
    alert('Check your email for the login link!')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}

const redirect = () => {
  router.push('/tabs/home');
};

const session = ref()
onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
  if (session.value) {
    redirect()
  }
})
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size-md="6" size-lg="5" size-xs="12">
            <div class="logo-container">
              <img v-if="isDark" src="../../assets/logo_transparent_white.png" alt="Light Logo" />
              <img v-else src="../../assets/logo_transparent_black.png" alt="Dark Logo" />
            </div>
            <form @submit.prevent="onLogin">
              <ion-item>
                <ion-input label="Email" label-placement="floating" type="email" v-model="email"></ion-input>
              </ion-item>
              <ion-button id="magic-link-button" expand="block" type="submit" shape="round" class="ion-margin-top" :disabled="loading">
                Send magic link
              </ion-button>
              <ion-button id="no-login-button" @click="setOpen(true)" expand="block" shape="round" class="ion-margin-top" :disabled="loading">
                Continue without login
              </ion-button>
              <ion-alert
               :is-open="isOpen"
               header="Alert"
               sub-header="You are proceeding without login"
               message="Your data can get lost at any time"
               :buttons="alertButtons"
               @didDismiss="setOpen(false)"
              >
              </ion-alert>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-item {
  border-radius: 20px;
  --padding-bottom: 10px;
}
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px 0;
}

.logo-container img {
  max-width: 80%;
  max-height: 50%;
}
</style>