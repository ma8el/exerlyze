<script setup lang="ts">
import { IonPage,
         IonContent,
         IonGrid,
         IonRow,
         IonIcon,
         IonCol,
         IonItem,
         IonInput,
         IonButton,
         IonAlert } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { mailOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
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
  router.push('/complete-profile');
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
              <ion-item lines="none">
                <ion-icon src="../../assets/icons/email.svg" slot="end"></ion-icon>
                <ion-input 
                  label="Email"
                  type="email"
                  label-placement="floating"
                  v-model="email"
                  fill="solid">
                </ion-input>
              </ion-item>
              <ion-button id="magic-link-button" expand="block" type="submit" class="ion-margin-top" :disabled="loading">
                Send magic link
              </ion-button>

              <div class="line">
                <hr>
                <ion-label class="or_lbl">or</ion-label>
                <hr>
              </div>

              <div class="social-button">
                <ion-buttons slot="start">
                  <ion-button>
                    <img src="../../assets/google.png" alt="">
                  </ion-button>
                </ion-buttons>
        
                <ion-buttons slot="start">
                  <ion-button>
                    <img src="../../assets/facebook.png" alt="">
                  </ion-button>
                </ion-buttons>
              </div>

              <div class="end">
                <ion-label class="end_lbl">
                  Want to try the app first? <span @click="setOpen(true)">Skip</span>
                </ion-label>
              </div>
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
ion-content {
  --background: none;
  background-image: url('../../assets/login_background.jpg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
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


.line {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  hr {
      width: 100%;
      height: 1px;
      border-bottom: 1px solid lightgrey;
      margin-bottom: 10px;
      margin-top: 10px;
  }
  .or_lbl {
      margin: 10px;
  }
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  ion-buttons {
      margin: 20px;
      ion-button {
          height: 50px;
          width: 50px;
          border: 1px solid lightgray;
          border-radius: 10px;
          img {
              height: 22px;
              width: 22px;
              margin: 10px;
          }
      }
  }
}
.end {
  display: flex;
  align-items: center;
  justify-content: center;
  .end_lbl {
      font-size: 16px;
      margin-top: 10px;
      span {
          color: #c58bf2;
      }
  }
}
</style>