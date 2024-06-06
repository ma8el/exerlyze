import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '../../../src/store/bodyMetricsStore'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { User } from '../../../src/types'

// Mocking supabase
vi.mock('@/lib/supabase', () => {
    return {
        supabase: {
            auth: {
                getSession: vi.fn().mockResolvedValue({ data: { session: null } })
            },
            from: () => ({
                select: vi.fn().mockResolvedValue({ data: [], error: null }),
                upsert: vi.fn().mockResolvedValue({ error: null })
            })
        }
    }
})

describe('User Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should initialize with default user', () => {
        const store = useUserStore()
        expect(store.user.userName).toBe('Anonymous')
    })

    it('should set and get userName', () => {
        const store = useUserStore()
        store.setUserName('John Doe')
        expect(store.userName).toBe('John Doe')
    })

    it('should set and get gender', () => {
        const store = useUserStore()
        store.setGender('female')
        expect(store.gender).toBe('female')
    })

    it('should set and get dateOfBirth', () => {
        const store = useUserStore()
        const dob = new Date('1990-01-01')
        store.setDateOfBirth(dob)
        expect(store.dateOfBirth).toEqual(dob)
    })

    it('should set and get height', () => {
        const store = useUserStore()
        store.setHeight(180)
        expect(store.height).toBe(180)
    })

    it('should check if user profile is complete', () => {
        const store = useUserStore()
        store.setUserName('undefined')
        store.setGender('undefined')
        expect(store.isComplete).toBe(false)
        store.setUserName('John Doe')
        store.setGender('male')
        store.setDateOfBirth(new Date('1990-01-01'))
        store.setHeight(180)
        expect(store.isComplete).toBe(true)
    })

    it('should get user age', () => {
        const store = useUserStore()
        const dob = new Date('1990-01-01')
        store.setDateOfBirth(dob)
        const currentYear = new Date().getFullYear()
        const expectedAge = currentYear - 1990
        expect(store.getAge()).toBe(expectedAge)
    })
})