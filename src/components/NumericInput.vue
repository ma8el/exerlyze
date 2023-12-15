<script setup lang="ts">
import { IonInput,
       } from '@ionic/vue'
import { ref, computed, watch } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  inputValue: {
    type: Number,
    required: true,
  },
  minValue: {
    type: Number,
    required: false,
    default: 0,
  },
  maxValue: {
    type: Number,
    required: false,
    default: 1000,
  }
});

const emit = defineEmits(['update:inputValue', 'update:valid']);

const inputRef = ref<InstanceType<typeof IonInput>>();
const valid = ref(true);
const validityClass = computed(() => {
  return valid.value ? 'ion-valid' : 'ion-invalid';
});

const setInvalid = () => {
  if (!inputRef.value) {
    return;
  }
  valid.value = false;
}

const setValid = () => {
  if (!inputRef.value) {
    return;
  }
  valid.value = true;
}

const validate = (ev: any) => {
 const value = ev.target.value;
  if (isNaN(+value)) {
    setInvalid();
    return;
  }
  const numberValue = Number(value);
  if (value === '' || value === undefined || value === null) {
    setInvalid();
    return;
  }

  if (numberValue < props.minValue) {
    setInvalid();
  } else if (numberValue > props.maxValue) {
    setInvalid();
  } else {
    setValid();
  }
}

const onInput = (ev: any) => {
    emit('update:inputValue', ev.target.value)
    validate(ev)
}

const markTouched = () => {
  if (!inputRef.value) {
    return;
  }
  inputRef.value.$el.classList.add('ion-touched');
}

watch (valid, (newValue) => {
  emit('update:valid', newValue)
})
</script>

<template>
  <ion-input 
    ref="inputRef"
    :label="label"
    :class="validityClass"
    label-placement="stacked"
    inputmode="numeric"
    error-text="Invalid number"
    @ionInput="onInput($event)"
    @ionChange="onInput($event)"
    @ionBlur="markTouched()"
    :value="inputValue"
    :clear-on-edit="true"
    :clear-input="true"
  />
</template>