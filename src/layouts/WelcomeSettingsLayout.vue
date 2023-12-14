<script setup lang="ts">
import { IonContent, IonLabel } from '@ionic/vue'

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
});
</script>

<template>
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
</template>

<style scoped lang="scss">
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
    .button{
        margin-top: 1.5rem;
        :is(ion-button){
            height: 50px;
        }
    }
}
</style>