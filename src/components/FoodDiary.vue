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
      <FoodItem 
        v-for="(foodItem, index) in foodDiaryStore.getBreakfastEntriesOfDate(selectedDate)"
        v-if="selectedDate"
        :key="foodItem.id"
        :foodName="foodItem.foodName"
        :calories="foodItem.calories"
        :quantity="foodItem.quantity"
      />
    </ion-item-group>
    <ion-item-group class="ion-padding-bottom">
      <ion-item-divider>
        <ion-label>
          {{ $t('nutrition.lunch') }}
        </ion-label>
        <ion-icon :icon="chevronDownOutline" slot="end"></ion-icon>
      </ion-item-divider>
      <FoodItem 
        v-for="(foodItem, index) in foodDiaryStore.getLunchEntriesOfDate(selectedDate)"
        v-if="selectedDate"
        :key="foodItem.id"
        :foodName="foodItem.foodName"
        :calories="foodItem.calories"
        :quantity="foodItem.quantity"
      />
    </ion-item-group>
    <ion-item-group class="ion-padding-bottom">
      <ion-item-divider>
        <ion-label>
          {{ $t('nutrition.dinner') }}
        </ion-label>
        <ion-icon :icon="chevronDownOutline" slot="end"></ion-icon>
      </ion-item-divider>
      <FoodItem 
        v-for="(foodItem, index) in foodDiaryStore.getDinnerEntriesOfDate(selectedDate)"
        v-if="selectedDate"
        :key="foodItem.id"
        :foodName="foodItem.foodName"
        :calories="foodItem.calories"
        :quantity="foodItem.quantity"
      />
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
</style>