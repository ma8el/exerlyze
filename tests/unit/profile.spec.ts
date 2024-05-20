import { mount } from '@vue/test-utils'
import Profile from '../../src/views/Profile.vue'
import { describe, expect, test } from 'vitest'

describe('You.vue', () => {
  test('renders you page', () => {
    const wrapper = mount(Profile)
    expect(wrapper.text()).toMatch('Profile')
  })
})
