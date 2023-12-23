<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Scrollbar } from 'swiper/modules';
import { ref, onMounted, watch } from 'vue';

import 'swiper/css';
import 'swiper/css/pagination';

const modules = ref([Scrollbar]);
const swiperRef = ref();

const props = defineProps({
  items: {
    type: Object,
    required: true
  },
  moveToSlide: {
    type: Number,
    required: false,
    default: 0
  },
  slideWidth: {
    type: String,
    required: false,
    default: '80%'
  },
  minWidth: {
    type: String,
    required: false,
    default: '200px'
  },
  maxWidth: {
    type: String,
    required: false,
    default: '200px'
  }
})

const moveToSlide = (index: number) => {
  swiperRef.value.$el.swiper.slideTo(index);
}

watch(() => props.moveToSlide, (index) => {
  moveToSlide(index);
})

onMounted(() => {
  moveToSlide(props.moveToSlide);
})

</script>

<template>
  <Swiper
    v-show="items.length > 0"
    ref="swiperRef"
    class="swiper"
    :modules="modules"
    :slides-per-view="'auto'"
    :space-between="5"
    :scrollbar="{ draggable: true }"
  >
    <SwiperSlide 
      class="swiper-slide" 
      v-for="(item, index) in items" :key="item.id"
      :style="{'min-width': minWidth, 'max-width': maxWidth, 'width': slideWidth}"
    >
      <slot :item="item"></slot>
    </SwiperSlide>
    <SwiperSlide 
      class="swiper-slide"
      :style="{'min-width': minWidth, 'max-width': maxWidth, 'width': slideWidth}"
    >
      <slot name="lastSlide"></slot>
    </SwiperSlide>
  </Swiper>
</template>

<style scoped lang="scss">
.swiper {
  width: 100%;
}
</style>