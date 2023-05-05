<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('')
const router = useRouter();

const onLogin = () => {
  console.log('Login');
};
const redirect = () => {
  router.push('/tabs/home');
};
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size-md="6" size-lg="5" size-xs="12">
            <div class="logo-container">
              <img src="../../assets/logo_transparent_white.png" alt="Logo" />
            </div>
            <form @submit.prevent="onLogin">
              <ion-item>
                <ion-label position="floating">Email</ion-label>
                <ion-input type="email" v-model="email"></ion-input>
              </ion-item>
              <ion-button expand="block" type="submit" shape="round" class="ion-margin-top">
                Send magic link
              </ion-button>
              <ion-button @click="redirect" expand="block" shape="round" class="ion-margin-top">
                Continue without login
              </ion-button>
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