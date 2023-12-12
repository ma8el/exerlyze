<script setup lang="ts">
  import { IonList,
           IonItemGroup,
           IonItemDivider,
           IonLabel,
           IonIcon } from '@ionic/vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import FoodItem from './FoodItem.vue';
  import { inject } from 'vue';
  import { selectedDateKey } from '@/keys';
  import { chevronDownOutline } from 'ionicons/icons';

  const selectedDate = inject(selectedDateKey)
  const foodDiaryStore = useFoodDiaryStore();
</script>

<template>
  <ion-list class="diary-list ion-padding">
    <ion-item-group class="ion-padding-bottom">
      <ion-item-divider>
        <ion-label>
          {{ $t('nutrition.breakfast') }}
        </ion-label>
        <ion-icon :icon="chevronDownOutline" slot="end"></ion-icon>
      </ion-item-divider>
      <template
        v-if="selectedDate"
      >
      <FoodItem 
        v-for="(foodItem, index) in foodDiaryStore.getMealEntriesOfDate(selectedDate, 'breakfast')"
        :key="foodItem.id"
        :id="foodItem.id"
        :foodName="foodItem.food_name"
        :calories="foodItem.calories"
        :quantity="foodItem.quantity"
        :foodImage="foodItem.image_front_thumb_url"
      />
      </template>
    </ion-item-group>
    <ion-item-group class="ion-padding-bottom">
      <ion-item-divider>
        <ion-label>
          {{ $t('nutrition.lunch') }}
        </ion-label>
        <ion-icon :icon="chevronDownOutline" slot="end"></ion-icon>
      </ion-item-divider>
      <template
        v-if="selectedDate"
      >
      <FoodItem 
        v-for="(foodItem, index) in foodDiaryStore.getMealEntriesOfDate(selectedDate, 'lunch')"
        :key="foodItem.id"
        :id="foodItem.id"
        :foodName="foodItem.food_name"
        :calories="foodItem.calories"
        :quantity="foodItem.quantity"
        :foodImage="foodItem.image_front_thumb_url"
      />
      </template>
    </ion-item-group>
    <ion-item-group class="ion-padding-bottom">
      <ion-item-divider>
        <ion-label>
          {{ $t('nutrition.dinner') }}
        </ion-label>
        <ion-icon :icon="chevronDownOutline" slot="end"></ion-icon>
      </ion-item-divider>
      <template
        v-if="selectedDate"
      >
      <FoodItem 
        v-for="(foodItem, index) in foodDiaryStore.getMealEntriesOfDate(selectedDate, 'dinner')"
        :key="foodItem.id"
        :id="foodItem.id"
        :foodName="foodItem.food_name"
        :calories="foodItem.calories"
        :quantity="foodItem.quantity"
        :foodImage="foodItem.image_front_thumb_url"
      />
      </template>
    </ion-item-group>
  </ion-list>
</template>

<style scoped>
ion-list {
  background: none;
  margin-bottom: 100px;
}
ion-item-group {
  border-radius: 50px;
}
ion-item-divider {
  --padding-start: 20px;
  --padding-end: 20px;
  --padding-top: 10px;
  --padding-bottom: 10px;
  border-radius: 10px;
}
</style>