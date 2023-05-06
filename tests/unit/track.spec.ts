import { mount } from '@vue/test-utils'
import Track from '@/views/Track.vue'
import { describe, expect, test } from 'vitest'

describe('Track.vue', () => {
  test('renders track page', () => {
    const wrapper = mount(Track)
    expect(wrapper.text()).toMatch('Track page')
  })
})
