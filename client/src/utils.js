// src/utils.js

export const calculateEndTime = (s) => {
    if (!s) return "10:00";
    const [h, m] = s.split(':').map(Number);
    return `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const getTimelineDays = (baseDate, daysCount) => {
    return Array.from({ length: daysCount }, (_, i) => {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + i);
        return d;
    });
};

export const getMonthDays = (baseDate) => {
    const y = baseDate.getFullYear();
    const m = baseDate.getMonth();
    const dim = new Date(y, m + 1, 0).getDate();
    const fd = new Date(y, m, 1).getDay();
    const d = [];
    for (let i = 0; i < fd; i++) d.push(null);
    for (let i = 1; i <= dim; i++) d.push(new Date(y, m, i));
    return d;
};

export const getYearMonths = (baseDate) =>
    Array.from({ length: 12 }, (_, i) => new Date(baseDate.getFullYear(), i, 1));

export const getDaysInMonth = (d) =>
    new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

export const isSameDate = (d1, d2s) =>
    d1 && d2s && new Date(d2s).toDateString() === d1.toDateString();

export const getTopPosition = (t, compactHours = false) => {
    const HOUR_HEIGHT = 60;
    const [h, m] = t.split(':').map(Number);
    return ((h - (compactHours ? 7 : 0)) * HOUR_HEIGHT) + m;
};

export const getHeight = (s, e) => {
    const [h1, m1] = s.split(':').map(Number);
    const [h2, m2] = e.split(':').map(Number);
    return Math.max(((h2 * 60 + m2) - (h1 * 60 + m1)), 30);
};

export const getTasksWithLayout = (dayTasks) => {
    if (!dayTasks || dayTasks.length === 0) return [];
    const sorted = [...dayTasks].sort((a, b) => {
        const [h1, m1] = a.startTime.split(':').map(Number);
        const [h2, m2] = b.startTime.split(':').map(Number);
        return (h1 * 60 + m1) - (h2 * 60 + m2);
    });
    const columns = [];
    sorted.forEach(task => {
        let placed = false;
        for (let col of columns) {
            const last = col[col.length - 1];
            const [endH, endM] = last.endTime.split(':').map(Number);
            const [startH, startM] = task.startTime.split(':').map(Number);
            if ((endH * 60 + endM) <= (startH * 60 + startM)) {
                col.push(task);
                placed = true;
                break;
            }
        }
        if (!placed) columns.push([task]);
    });

    const result = [];
    const width = 100 / columns.length;
    columns.forEach((col, colIndex) => {
        col.forEach(task => {
            result.push({
                ...task,
                style: {
                    width: `${width}%`,
                    left: `${colIndex * width}%`,
                    position: 'absolute'
                }
            });
        });
    });
    return result;
};