import { mount } from '@vue/test-utils'
import Login from '@/views/Login.vue'
import { describe, expect, it, vi } from 'vitest'
import mockRouter from '../mocks/router'

describe('Login.vue', () => {
  const globalMountOptions = {
    global: {
      plugins: [mockRouter],
    },
  };

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

  it('renders continue without login button correctly', () => {
    const wrapper = mount(Login, globalMountOptions);
    const continueWithoutLoginButton = wrapper.find('ion-button[id="no-login-button"]');

    expect(continueWithoutLoginButton.exists()).toBe(true);
    expect(continueWithoutLoginButton.text()).toBe('Continue without login');
  });
});