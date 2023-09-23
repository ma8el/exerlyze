export const dateToIsoString = (date: Date | undefined): string => {
    console.log(date)
    if (date === undefined) return '1900-01-01'
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