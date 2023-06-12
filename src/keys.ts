import type { InjectionKey, Ref } from "vue";

export const selectedDateKey = Symbol() as InjectionKey<Ref<Date>>;