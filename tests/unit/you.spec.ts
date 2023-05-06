import { mount } from '@vue/test-utils'
import You from '@/views/You.vue'
import { describe, expect, test } from 'vitest'

describe('You.vue', () => {
  test('renders you page', () => {
    const wrapper = mount(You)
    expect(wrapper.text()).toMatch('You page')
  })
})
