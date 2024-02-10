<script setup lang="ts">
    import { IonCard,
             IonCardHeader,
             IonCardSubtitle,
             IonCardTitle,
             IonCardContent,
             IonRow,
             IonCol } from '@ionic/vue';
    import { onMounted, ref } from 'vue';
    import ImageSkeleton from '../Skeletons/ImageSkeleton.vue';
    
    const props = defineProps({
        title: String,
        subTitle: {
          type: Boolean,
          default: false
        },
        content: {
          type: Boolean,
          default: false
        },
        img_src: String,
        img_height: String,
        titleSize: String
    })

    const loading = ref<boolean>(false)

    const handleLoad = () => {
      loading.value = false
    }

    onMounted(() => {
      if ( props.img_src ) {
        loading.value = true
      }
    })
</script>

<template>
  <ion-card>
    <img 
      v-if="img_src && !loading"
      :src="img_src"
      :style="{height: img_height}"
      @load="handleLoad"
      @error="handleLoad"
    />
    <image-skeleton v-else-if="img_src && loading" :style="{height: img_height, 'max-height': '150px'}"/>
    <ion-card-header>
      <ion-row class="ion-justify-content-between ion-align-items-center">
        <ion-col size="auto">
          <ion-card-title 
            v-if="title"
            :style="{'font-size': titleSize, 'overflow': 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap'}"
          >
            {{ title }}
          </ion-card-title>
        </ion-col>
        <slot name="titleEnd"></slot>
      </ion-row>
      <ion-card-subtitle v-if="subTitle">
        <slot name="subtitle"></slot>
      </ion-card-subtitle>
    </ion-card-header>
    <ion-card-content v-if="content">
      <slot></slot>
    </ion-card-content>
  </ion-card>
</template>

<style scoped>
  ion-card {
    --border-radius: 10px;
    --background: var(--ion-card-background);
  }
  ion-card-header {
    --background: none
  }
  ion-card-content {
    --background: var(--ion-card-background);
  }
  ion-card-title {
    font-size: 1.1rem;
    font-weight: bold;
  }
  ion-card-subtitle {
    font-size: 0.7rem;
  }
  img {
    width: 100%;
    object-fit: cover;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
</style>