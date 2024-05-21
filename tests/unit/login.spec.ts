import { mount } from '@vue/test-utils'
import Login from '../../src/views/Login.vue'
import { messages } from '../../src/locale'
import { createI18n } from 'vue-i18n';
import { createPinia, setActivePinia } from 'pinia';
import { describe, expect, it, beforeEach } from 'vitest'
import mockRouter from '../mocks/router'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
});

describe('Login.vue', () => {
  const globalMountOptions = {
    global: {
      plugins: [mockRouter, i18n],
    },
  };

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
  })

  it('renders email input correctly', () => {
    const wrapper = mount(Login, globalMountOptions);
    const emailInput = wrapper.find('ion-input');

    expect(emailInput.exists()).toBe(true);
  });

  it('renders send magic link button correctly', () => {
    const wrapper = mount(Login, globalMountOptions);
    const sendMagicLinkButton = wrapper.find('ion-button[id="magic-link-button"]');

    expect(sendMagicLinkButton.exists()).toBe(true);
    expect(sendMagicLinkButton.text()).toBe('Send magic link');
  });
});