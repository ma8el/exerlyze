<script setup lang="ts">
import { IonRow,
         IonCol,
         IonIcon,
         IonSpinner } from '@ionic/vue';
import { arrowUpOutline, arrowForwardOutline, arrowDownOutline } from 'ionicons/icons';
import BaseCard from '@/components/Cards/BaseCard.vue';
  
const props = defineProps({
  title: String,
  value: {
    type: Number,
    required: true,
    default: 0,
  },
  percentage: {
    type: Boolean,
    default: false,
  },
  average: {
    type: Boolean,
    default: false,
  },
  unit: {
    type: String,
    default: '%',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isLeft: {
    type: Boolean,
    default: false,
  }
})
</script>

<template>
  <BaseCard
    :title="title"
    :content="true"
    titleSize="1rem"
    :class="isLeft ? 'info-card margin-right': 'info-card margin-left'"
  >
    <ion-row
      class="ion-justify-content-between ion-align-items-center"
      v-if="!loading"
    >
      <ion-col size="4">
        <div v-if="percentage">
          <ion-icon v-if="value > 0" color="tertiary" size="large" :icon="arrowUpOutline"></ion-icon>
          <ion-icon v-if="value < 0" color="secondary" size="large" :icon="arrowDownOutline"></ion-icon>
          <ion-icon v-if="value === 0" color="primary" size="large" :icon="arrowForwardOutline"></ion-icon>
        </div>
        <p class="average" v-if="average">∅</p>
      </ion-col>
      <ion-col 
        size="8"
        class="ion-justify-content-center ion-align-items-center"
      >
        <p :class="average ? 'average-value': 'percentage-value'">{{ value }} {{ unit }}</p>
      </ion-col>
    </ion-row>
    <ion-spinner
      class="ion-justify-content-center"
      v-if="loading"
    />
  </BaseCard>
</template>

<style scoped>
  .average {
    font-size: 1.5rem;
  }
  .percentage-value {
    margin-bottom: 5px;
    font-size: 1.3rem;
    font-weight: bold;
  }
  .average-value {
    margin-top: 5px;
    font-size: 1.3rem;
    font-weight: bold;
  }
  .info-card {
    margin: 0;
  }
  .margin-left {
    margin-left: 8px;
  }
  .margin-right {
    margin-right: 8px;
  }
</style>