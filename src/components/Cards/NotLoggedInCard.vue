<script setup lang="ts">
import { IonRow,
         IonCol,
         IonIcon } from '@ionic/vue';
import BaseCard from '@/components/Cards/BaseCard.vue';
import { lockClosedOutline } from 'ionicons/icons';
  
const props = defineProps({
  title: String,
})
</script>

<template>
  <BaseCard
    :title="title"
    :content="true"
    titleSize="1rem"
  >
  <div class="login-badge">
    <ion-icon :icon="lockClosedOutline"></ion-icon>
    <p>Log in</p>
  </div>
  </BaseCard>
</template>

<style scoped>
  ion-col {
    p {
      margin: 0;
    }
  }

  .login-badge {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--ion-color-primary);
    border-radius: 10px;
    padding: 5px;
    ion-icon {
      color: white;
      margin-right: 10px;
    }
    p {
      color: white;
      font-weight: bold;
      margin-top: 3px;
    }
  }
</style>