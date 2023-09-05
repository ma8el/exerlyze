<script setup lang="ts">
const props = defineProps({
  items: Object,
})
</script>

<template>
  <div class="main_content_div">
    <div class="content_div">
      <div class="service_slider">
        <div class="single_slider" v-for="item in items" :key="item.id">
              <slot :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.swiper {
  width: 95%;
  --bullet-background: #fff;
  --bullet-background-active: #3F63C8;
}
.main_content_div {
  .content_div {
    .service_slider {
      display: flex;
      overflow: scroll;

      .single_slider {
        width: 100%;
        min-width: 300px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 5px;
        // box-shadow: 0px 3px 6px rgb(0 0 0 / 30%);
        // border-radius: 10px;

        .back_image {
          width: 100%;
          height: 100%;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
      }
    }
  }
}
</style>