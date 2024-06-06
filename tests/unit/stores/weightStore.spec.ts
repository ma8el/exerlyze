import { setActivePinia, createPinia } from 'pinia'
import { useWeightStore } from '../../../src/store/bodyMetricsStore'
import { describe, it, expect, beforeEach } from 'vitest'
import { Weight } from '../../../src/types' // Assuming you have a types file for Weight type

describe('Weight Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should initialize with empty weights', () => {
        const store = useWeightStore()
        expect(store.weights).toEqual([])
    })

    it('should get current weight', () => {
        const store = useWeightStore()
        store.weights = [
            { id: '1', created_at: new Date('2024-05-25T00:00:00.000Z'), updated_at: new Date('2024-05-25T00:00:00.000Z'), weight: 70, unit: 'kg'},
            { id: '2', created_at: new Date('2024-06-01T00:00:00.000Z'), updated_at: new Date('2024-06-01T00:00:00.000Z'), weight: 72, unit: 'kg'}
        ] as Weight[]
        expect(store.currentWeight).toEqual(
            { id: '2', created_at: new Date('2024-06-01T00:00:00.000Z'), updated_at: new Date('2024-06-01T00:00:00.000Z'), weight: 72, unit: 'kg'}
        )
    })

    it('should get weights of the week', () => {
        const store = useWeightStore()
        const today = new Date()
        const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7).toISOString()
        store.weights = [
            { id: '1', created_at: new Date('2024-05-25T00:00:00.000Z'), updated_at: new Date('2024-05-25T00:00:00.000Z'), weight: 70, unit: 'kg'},
            { id: '2', created_at: today, updated_at: today, weight: 72, unit: 'kg'}
        ] as Weight[]
        const weightsOfWeek = store.getWeightsOfWeek
        expect(weightsOfWeek.length).toBe(1)
        expect(weightsOfWeek[0].id).toBe('2')
    })

    it('should add weight', async () => {
        const store = useWeightStore()
        const newWeight = { id: '3', created_at: new Date('2024-06-02T00:00:00.000Z'), updated_at: new Date('2024-06-02T00:00:00.000Z'), weight: 73, unit: 'kg' } as Weight
        await store.addWeight(newWeight)
        expect(store.weights).toContainEqual(newWeight)
    })

    // Add more tests as needed
})