import { mount } from '@vue/test-utils'
import Workouts from '@/views/Workouts.vue'
import { describe, expect, test } from 'vitest'

describe('Workouts.vue', () => {
  test('renders workouts page', () => {
    const wrapper = mount(Workouts)
    expect(wrapper.text()).toMatch('Workouts page')
  })
})
