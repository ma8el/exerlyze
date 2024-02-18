<script setup lang="ts">
import {
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonSearchbar,
  modalController,
} from '@ionic/vue';
import { bookmarkOutline } from 'ionicons/icons';
import { supabase } from '@/supabase';
import type { SearchbarCustomEvent } from '@ionic/vue';
import BaseFullPageModal from './BaseFullPageModal.vue';
import ListSkeleton from '../Skeletons/ListSkeleton.vue';
import { useUserSettingsStore } from '@/store/userSettingsStore';
import { ref } from 'vue';
import { onMounted } from 'vue';

interface Exercise {
  id: number;
  name: string;
}

const userSettingsStore = useUserSettingsStore();
const locale = userSettingsStore.getLocale();
const loading = ref<boolean>(true);

const uniqueExercises = ref<Exercise[]>([]);
const filteredItems = ref<Exercise[]>([]);
const selectedExercise = ref<number>();

const getUniqueExercises = async () => {
  const { data, error } = await supabase
    .from('v_unique_performed_exercises')
    .select(`exercise_id, name_en, name_de, name_fr`)
    .order(`name_${locale}`, { ascending: true })
  if (data === null || data === undefined) {
    return;
  }
  return data.map((item) => {
    if (locale === 'de') {
      return {
        id: item.exercise_id,
        name: item.name_de,
      };
    } else if (locale === 'en') {
      return {
        id: item.exercise_id,
        name: item.name_en,
      };
    } else {
      return {
        id: item.exercise_id,
        name: item.name_fr,
      };
    }
  });
};
  
const confirmChanges = () => {
  modalController.dismiss(selectedExercise.value, 'save');
};

const searchbarInput = (ev: SearchbarCustomEvent) => {
  if (ev.target.value === null) {
    return;
  }
  filterList(ev.target.value);
};

const filterList = (searchQuery: string | undefined) => {
 if (searchQuery === undefined || searchQuery === '') {
    filteredItems.value = uniqueExercises.value;
  } else {
    const normalizedQuery = searchQuery.toLowerCase();
    filteredItems.value = uniqueExercises.value.filter((item: Exercise) => {
      return item.name.toLocaleLowerCase().includes(normalizedQuery);
    });
  }
};

onMounted(async () => {
  loading.value = true;
  const data = await getUniqueExercises();
  if (data === null || data === undefined) {
    return;
  }
  uniqueExercises.value = data;
  filteredItems.value = data
  loading.value = false;
});
</script>

<template>
  <BaseFullPageModal>
    <template #modalHeader>
      <p class="header-title">{{ $t('filterByExercise') }}</p>
    </template>
    <template #saveButton>
      <ion-icon :icon="bookmarkOutline" @click="confirmChanges"/>
    </template>
    <template #modalContent>
      <ion-item>
        <ion-searchbar 
          @ionInput="searchbarInput($event)"
          :debounce="500"
        />
      </ion-item>
      <template v-if="loading">
        <ListSkeleton />
      </template>
      <template
        v-else
      >
      <ion-radio-group 
        v-model="selectedExercise"
        :allow-empty-selection="true"
      >
          <ion-item 
            v-for="(exercise, key) in filteredItems"
            :key="key"
          >
            <ion-radio 
              :value="exercise.id"
            >
              {{ exercise.name }}
            </ion-radio>
         </ion-item>
      </ion-radio-group>
      </template>
    </template>
  </BaseFullPageModal>
</template>

<style scoped>
  .header-title {
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
  }
</style>