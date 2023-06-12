<script setup lang="ts">
  import { IonList,
           IonItemGroup,
           IonItemDivider,
           IonLabel,
           IonCard } from '@ionic/vue';
  import { useFoodDiaryStore } from '@/store/foodDiary';
  import FoodItem from './FoodItem.vue';
  import { inject } from 'vue';
  import { selectedDateKey } from '@/keys';

  const selectedDate = inject(selectedDateKey)
  const foodDiaryStore = useFoodDiaryStore();
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
          v-for="(foodItem, index) in foodDiaryStore.getBreakfastEntriesOfDate(selectedDate)"
          v-if="selectedDate"
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
          v-for="(foodItem, index) in foodDiaryStore.getLunchEntriesOfDate(selectedDate)"
          v-if="selectedDate"
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
          v-for="(foodItem, index) in foodDiaryStore.getDinnerEntriesOfDate(selectedDate)"
          v-if="selectedDate"
          :key="foodItem.id"
          :foodName="foodItem.foodName"
          :calories="foodItem.calories"
        />
      </ion-item-group>
    </ion-list>
  </ion-card>
</template>