import { mount } from '@vue/test-utils'
import Profile from '../../src/views/Profile.vue'
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import { messages } from '../../src/locale'
import { describe, expect, test, beforeEach } from 'vitest'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
});

describe('You.vue', () => {
  const globalMountOptions = {
    global: {
      plugins: [i18n],
    },
  };

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
  })


  test('renders you page', () => {
    const wrapper = mount(Profile, globalMountOptions)
    expect(wrapper.text()).toMatch('Profile')
  })
})
