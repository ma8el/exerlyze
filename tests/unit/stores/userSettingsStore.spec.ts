import { createPinia, setActivePinia } from 'pinia'
import { useUserSettingsStore } from '../../../src/store/userSettingsStore'
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('User Settings Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        localStorage.setItem('selectedLocale', 'en')
    })

    it('should initialize with default locale', () => {
        const store = useUserSettingsStore()
        expect(store.locale).toBe('en')
    })

    it('should get and set locale', () => {
        const store = useUserSettingsStore()
        store.setLocale('de')
        expect(store.getLocale()).toBe('de')
    })

    it('should set default locale to en if navigator language is not supported', () => {
        const store = useUserSettingsStore()
        store.setLocale('es')
        expect(store.getLocale()).toBe('en')
    })

    it('should return the navigator language if it is supported', () => {
        const store = useUserSettingsStore()
        store.setLocale('fr')
        expect(store.getLocale()).toBe('fr')
    })

    it('should return en as default language if locale is undefined', () => {
        const store = useUserSettingsStore()
        store.locale = undefined
        expect(store.getLocale()).toBe('en')
    })
})