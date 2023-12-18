<script setup lang="ts">
import { IonInput } from '@ionic/vue'
import { onMounted } from 'vue';
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
  },
  errorText: {
    type: String,
    required: false,
    default: 'Invalid number',
  },
  clearInput: {
    type: Boolean,
    required: false,
    default: true,
  },
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
  emit('update:valid', false)
}

const setValid = () => {
  if (!inputRef.value) {
    return;
  }
  valid.value = true;
  emit('update:valid', true)
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
    emit('update:inputValue', Number(ev.target.value))
    validate(ev)
}

const markTouched = () => {
  if (!inputRef.value) {
    return;
  }
  inputRef.value.$el.classList.add('ion-touched');
}

watch (valid, (newValue) => {
  emit('update:valid', Number(newValue))
})

watch(() => props.inputValue, (newValue) => {
  validate({ target: { value: newValue } });
});

const updateValidity = async () => {
  if (!inputRef.value) {
    return;
  }
  inputRef.value.$el.classList.add('ion-untouched');
  inputRef.value.$el.classList.add('ion-pristine');
  if (props.inputValue) {
    inputRef.value.$el.classList.add('ion-dirty');
  }
  if (props.inputValue < props.minValue || props.inputValue > props.maxValue) {
    setInvalid();
  } else {
    setValid();
  }
}

onMounted(async () => {
  await updateValidity();
})
</script>

<template>
  <div class="numeric-input">
    <ion-input 
      ref="inputRef"
      :label="label"
      :class="validityClass"
      label-placement="stacked"
      inputmode="numeric"
      :error-text="errorText"
      @ionInput="onInput($event)"
      @ionChange="onInput($event)"
      @input="onInput($event)"
      @ionBlur="markTouched()"
      :value="inputValue"
      :clear-on-edit="true"
      :clear-input="clearInput"
    />
  </div>
</template>