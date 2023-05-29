<script setup lang="ts">
  import { IonList,
           IonItemGroup,
           IonItemDivider,
           IonLabel,
           IonCard } from '@ionic/vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import FoodItem from './FoodItem.vue';

  const foodDiaryStore = useFoodDiaryStore();
  const today = new Date();
</script>

<template>
  <ion-card>
    <ion-list>
      <ion-item-group>
        <ion-item-divider>
          <ion-label>
            Breakfast
          </ion-label>
        </ion-item-divider>
        <FoodItem 
          v-for="(foodItem, index) in foodDiaryStore.getBreakfastEntriesOfDate(today)"
          :key="foodItem.id"
          :foodName="foodItem.foodName"
          :calories="foodItem.calories"
        />
      </ion-item-group>
      <ion-item-group>
        <ion-item-divider>
          <ion-label>
            Lunch
          </ion-label>
        </ion-item-divider>
        <FoodItem 
          v-for="(foodItem, index) in foodDiaryStore.getLunchEntriesOfDate(today)"
          :key="foodItem.id"
          :foodName="foodItem.foodName"
          :calories="foodItem.calories"
        />
      </ion-item-group>
      <ion-item-group>
        <ion-item-divider>
          <ion-label>
            Dinner
          </ion-label>
        </ion-item-divider>
        <FoodItem 
          v-for="(foodItem, index) in foodDiaryStore.getDinnerEntriesOfDate(today)"
          :key="foodItem.id"
          :foodName="foodItem.foodName"
          :calories="foodItem.calories"
        />
      </ion-item-group>
    </ion-list>
  </ion-card>
</template>