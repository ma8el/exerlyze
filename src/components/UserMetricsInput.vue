<script setup lang="ts">
import {
  IonItem,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonIcon,
} from '@ionic/vue';
import { peopleOutline,
         personOutline,
         scaleOutline,
         swapVerticalOutline,
         chevronForward } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore, useWeightStore } from '@/store/bodyMetricsStore';
import { dateToIsoString } from '@/helpers/time';

const router = useRouter();
const userStore = useUserStore();
const weightStore = useWeightStore();

const userNameInputRef = ref<HTMLElement | undefined>(undefined);

const userName = ref<string | undefined>(undefined);
const gender = ref<string | undefined>(undefined);
const dateOfBirth = ref<string | undefined>(undefined);
const weight = ref<number | undefined>(undefined);
const height = ref<number | undefined>(undefined);

const props = defineProps({
    buttonLabel: {
        type: String,
        required: true,
    },
    saveRedirectPath: {
        type: String,
        required: false,
        default: 'tabs/home',
    },
});

const save = async () => {
    if (userName.value === undefined || userName.value === '') {
        return;
    }
    userStore.setUserName(userName.value);
    if (dateOfBirth.value === undefined || dateOfBirth.value === '') {
        return;
    }
    userStore.setDateOfBirth(new Date(dateOfBirth.value));
    if (gender.value === undefined) {
        return;
    }
    userStore.setGender(gender.value);
    if (weight.value === undefined) {
        return;
    }
    weightStore.addWeight({
        id: weightStore.getNewId(),
        created_at: new Date(),
        updated_at: new Date(),
        weight: weight.value,
        unit: 'kg'
    }
    );
    if (height.value === undefined) {
        return;
    }
    userStore.setHeight(height.value);
    await userStore.syncUser();
    router.push(props.saveRedirectPath);
};

onMounted(() => {
  userName.value = userStore.getUserName()
  gender.value = userStore.getGender()
  if (userStore.getDateOfBirth() !== undefined) {
    dateOfBirth.value = dateToIsoString(userStore.getDateOfBirth())
  }
  if (weightStore.weights.length > 0) {
    weight.value = weightStore.getCurrentWeight.weight
  }
  height.value = userStore.getHeight()
});
</script>

<template>
  <ion-item lines="none">
    <ion-icon :src="personOutline" color="medium" style="margin-right: 10px;"></ion-icon>
    <ion-input 
      ref="userNameInputRef"
      v-model="userName"
      type="text"
      placeholder="Username"
    >
    </ion-input>
  </ion-item>

  <ion-item lines="none">
    <ion-icon :src="peopleOutline" color="medium" style="margin-right: 10px;"></ion-icon>
    <ion-select 
      v-model="gender"
      :multiple="false" 
      :placeholder="$t('chooseGender')"
    >
      <ion-select-option value="male">{{ $t('male') }}</ion-select-option>
      <ion-select-option value="female">{{ $t('female') }}</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item lines="none">
    <ion-input 
      v-model="dateOfBirth"
      type="date"
      :placeholder="$t('dateOfBirth')"
    >
  </ion-input>
  </ion-item>

  <ion-item lines="none">
    <ion-icon :src="scaleOutline" color="medium" style="margin-right: 10px;"></ion-icon>
    <ion-input 
      v-model="weight"
      type="number"
      :placeholder="$t('yourWeight')"
    >
    </ion-input>
    <ion-button expand="block" slot="end" shape="round" color="primary">
      {{ $t('weightUnitBig') }} 
    </ion-button>
  </ion-item>

  <ion-item lines="none">
    <ion-icon :src="swapVerticalOutline" color="medium" style="margin-right: 10px;"></ion-icon>
    <ion-input
      v-model="height"
      type="number"
      :placeholder="$t('yourHeight')"
    >
    </ion-input>
    <ion-button expand="block" slot="end" shape="round" color="primary">
      {{ $t('lengthUnit') }}
    </ion-button>
  </ion-item>

  <div class="button">
    <ion-button expand="block" @click="save()">
      {{  buttonLabel }}
      <ion-icon :src="chevronForward" style="margin-left: 10px;"></ion-icon>
    </ion-button>
  </div>
</template>

<style scoped>
ion-item {
    border: 1px solid #92949c2a;
    border-radius: 10px;
    margin-top: 16px;
    ion-input {
        --padding-start: 10px;
    }
    ion-button {
        margin: 0 0 0 10px;
        --padding-start: 10px;
        --padding-end: 10px;
    }
}
.button{
    margin-top: 1.5rem;
    ion-button{
        height: 50px;
    }
}
</style>