<script setup lang="ts">
  import { IonGrid, IonRow } from '@ionic/vue';
  import { useDark } from '@vueuse/core'

  const isDark = useDark()
</script>

<template>
  <ion-grid>
    <ion-row class="ion-justify-content-center">
        <VCalendar expanded transparent borderless :is-dark="isDark" view="weekly" />
    </ion-row>
  </ion-grid>
</template>