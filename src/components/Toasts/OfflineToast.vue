<script setup lang="ts">
import { onMounted } from 'vue';
import { IonToast } from '@ionic/vue';
import { alertOutline, wifi } from 'ionicons/icons';
import { Network } from '@capacitor/network';
import { ref } from 'vue';

const props = defineProps({
  anchorId: {
    type: String,
    required: false,
  }
});

const firstUpdate = ref<boolean>(true);
const online = ref<boolean>(true);

const updateOnlineStatus = async () => {
  Network.addListener('networkStatusChange', status => {
    if (status.connected) {
      online.value = true;
    } else {
      online.value = false;
    } 
    firstUpdate.value = false;
  });
  const status = await Network.getStatus();
};

onMounted(async () => {
  await updateOnlineStatus();
});
</script>

<template>
<ion-toast
  class="offline-toast"
  :message="$t('offlineMessage')"
  position="bottom"
  duration="5000"
  :position-anchor="anchorId"
  :icon="alertOutline"
  :isOpen="!online"
/>
<ion-toast
  v-if="!firstUpdate"
  class="online-toast"
  :message="$t('onlineMessage')"
  position="bottom"
  duration="5000"
  :position-anchor="anchorId"
  :icon="wifi"
  :isOpen="online"
/>
</template>

<style scoped>
.offline-toast {
  --background: var(--ion-color-danger);
  --color: var(--ion-color-dark);
  margin-bottom: 5rem;
}

.online-toast {
  --background: var(--ion-color-success);
  --color: var(--ion-color-dark);
  margin-bottom: 5rem;
}
</style>