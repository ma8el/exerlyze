<script setup lang="ts">
import { IonPage,
         IonContent,
         IonGrid,
         IonRow,
         IonIcon,
         IonCol,
         IonItem,
         IonInput,
         IonButtons,
         IonLabel,
         IonButton,
         IonAlert} from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDark } from '@vueuse/core'
import { supabase } from '@/supabase';
import EmailIcon from '@/icons/email.svg';
import Line from '@/components/Line.vue';
import { useUserStore } from '@/store/bodyMetricsStore';
import { useUserFitnessLevelStore } from '@/store/userSettingsStore';
import { useFoodDiaryStore } from '@/store/foodDiary';
import { syncWithBackend } from '@/composables/supabase';

const userStore = useUserStore();
const userFitnessLevelStore = useUserFitnessLevelStore();
const foodDiaryStore = useFoodDiaryStore();

//const isDark = useDark();
const isDark = true;

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

const redirect = async () => {
  await syncWithBackend();
  if (userStore.isComplete &&
      userFitnessLevelStore.hasExistingFitnessLevel() &&
      foodDiaryStore.dailyNutritionGoalComplete) {
    router.push('/tabs/home');
  } else {
    if(!userStore.isComplete) {
      router.push('/complete-profile');
    } else if (!userFitnessLevelStore.hasExistingFitnessLevel()) {
      router.push('/complete-fitness-level');
    } else if (!foodDiaryStore.dailyNutritionGoalComplete) {
      router.push('/complete-diet-profile');
    } else {
      router.push('/complete-profile');
    }
  }
};

const session = ref()
onMounted(async () => {
  await supabase.auth.getSession().then(({ data }) => {
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
                <ion-icon :icon="EmailIcon" slot="end"></ion-icon>
                <ion-input 
                  :label="$t('email')"
                  type="email"
                  label-placement="floating"
                  v-model="email">
                </ion-input>
              </ion-item>
              <ion-button id="magic-link-button" expand="block" type="submit" class="ion-margin-top" :disabled="loading">
                {{ $t('sendMagicLink') }}
              </ion-button>

              <Line :label="$t('or')" />

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
                  {{ $t('tryFirst') }} <span @click="setOpen(true)">{{ $t('yes') }}.</span>
                </ion-label>
              </div>
             <ion-alert
               :is-open="isOpen"
               :header="$t('alert')"
               :sub-header="$t('withoutLoginWarning')"
               :message="$t('withoutLoginWarningMessage')"
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

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  :is(ion-buttons) {
      margin: 20px;
      :is(ion-button) {
          height: 50px;
          width: 50px;
          border: 1px solid lightgray;
          border-radius: 10px;
          :is(img) {
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
      :is(span) {
          color: #c58bf2;
      }
  }
}
</style>