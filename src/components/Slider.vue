<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';

const props = defineProps({
  items: {
    type: Object,
    required: true
  },
  minWidth: {
    type: String,
    default: '100%'
  },
  maxWidth: {
    type: String,
    default: '100%'
  }
})
</script>

<template>
  <div class="main_content_div">
    <div class="content_div">
      <div class="service_slider">
        <div class="single_slider" :style="{'min-width': minWidth, 'max-width': maxWidth}" v-for="item in items" :key="item.id">
              <slot :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main_content_div {
  .content_div {
    .service_slider {
      display: flex;
      overflow: scroll;

      .single_slider {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // box-shadow: 0px 3px 6px rgb(0 0 0 / 30%);
        // border-radius: 10px;
      }
    }
  }
}
</style>