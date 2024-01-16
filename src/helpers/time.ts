import { useUserSettingsStore } from "@/store/userSettingsStore";

export const dateToLocaleString = (date: Date | undefined): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
    const userSettingsStore = useUserSettingsStore();
    const locale = userSettingsStore.locale;
    if (date === undefined) return new Date().toLocaleDateString(locale, options);
    return new Date(date).toLocaleDateString(locale, options);
}

export const dateToIsoString = (date: Date | undefined): string => {
    if (date === undefined) return new Date().toISOString().split('T')[0];
    return new Date(date).toISOString().split('T')[0];
}

export const extractTimeFromTS = (date: Date): string => {
    return date.toISOString().split('T')[1].split('.')[0];
}

export const getCurrentWeekDates = () => {
    var now = new Date();
    var dayOfWeek = now.getDay();
    var numDay = dayOfWeek !== 0 ? dayOfWeek - 1 : 6;

    now.setDate(now.getDate() - numDay);

    var dates = [];

    for(var i = 0; i < 7; i++) {
        dates.push(new Date(now));
        now.setDate(now.getDate() + 1);
    }

    return dates;
}

export const getDayIndex = (day: Date | undefined) => {
    if (day === undefined) return (new Date().getDay() - 1) % 7;
    const dayIndex = (new Date(day).getDay() - 1) % 7;
    const cleanedDayIndex = dayIndex < 0 ? 6 : dayIndex;
    return cleanedDayIndex;
}