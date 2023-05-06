import { mount } from '@vue/test-utils'
import Nutrition from '@/views/Nutrition.vue'
import { describe, expect, test } from 'vitest'

describe('Nutrition.vue', () => {
  test('renders nutrition', () => {
    const wrapper = mount(Nutrition)
    expect(wrapper.text()).toMatch('Nutrition page')
  })
})
