<script setup lang="ts">
import { IonItem,
         IonIcon,
         IonInput } from '@ionic/vue';
import EmailIcon from '@/icons/email.svg';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    inputEmail: {
        type: String,
        required: true,
    },
})
const emit = defineEmits(['update:inputEmail', 'update:valid']);

const { t } = useI18n();
const errorText = t('invalidEmail');

const valid = ref<boolean>(false);
const inputRef = ref<InstanceType<typeof IonInput>>();
const validityClass = computed(() => {
  return valid.value ? 'ion-valid' : 'ion-invalid';
});

const validateEmail = (email: string) => {
    return email.match(
      /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    );
}

const validate = (email: string) => {
    if (validateEmail(email)) {
        valid.value = true;
        emit('update:valid', true);
    } else {
        valid.value = false;
        emit('update:valid', false);
    }
}

const onInput = (ev: any) => {
    console.log(ev.target.value)
    console.log(validityClass.value)
    emit('update:inputEmail', ev.target.value)
    validate(ev.target.value)
}

const markTouched = () => {
  if (!inputRef.value) {
    return;
  }
  inputRef.value.$el.classList.add('ion-touched');
}
</script>

<template>
  <ion-item lines="none">
    <ion-icon :icon="EmailIcon" slot="end"></ion-icon>
    <ion-input 
      ref="inputRef"
      :label="$t('email')"
      :class="validityClass"
      type="email"
      label-placement="floating"
      :value="inputEmail"
      :error-text="errorText"
      @ionInput="onInput($event)"
      @ionChange="onInput($event)"
      @ion-blur="markTouched()"
    />
   </ion-item>
</template>