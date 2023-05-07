<script setup lang="ts">
  import { IonGrid, IonRow, IonCol, IonAvatar } from '@ionic/vue';
  import { ref } from 'vue';

  const avatar = ref('')
  const username = ref('Username')
  const height = ref('1.80m')
</script>

<template>
  <ion-card>
    <ion-grid>
      <ion-row>
        <ion-col size="2">
          <ion-row>
            <ion-avatar>
              <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            </ion-avatar>
          </ion-row>
        </ion-col>
        <ion-col>
          <ion-row>
            <h3 class="username">{{ username }}</h3>
          </ion-row>
          <ion-row>
            <p class="height">{{ height }}</p>
          </ion-row>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>
 
<style scoped>
.avatar {
  width: 100%;
  height: auto;
  border-radius: 50%;
}
.username {
  margin: 0;
}
.height {
  margin: 0;
}
</style>