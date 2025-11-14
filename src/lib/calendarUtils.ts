import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  addDays,
  getDay,
} from "date-fns";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayOfMonth: string;
  fullDate: string;
}

export const generateMonthDays = (date: Date): CalendarDay[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return days.map((day) => ({
    date: day,
    isCurrentMonth: isSameMonth(day, monthStart),
    isToday: isToday(day),
    dayOfMonth: format(day, "d"),
    fullDate: format(day, "yyyy-MM-dd"),
  }));
};

export const generateWeekDays = (date: Date): CalendarDay[] => {
  const weekStart = startOfWeek(date);
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return days.map((day) => ({
    date: day,
    isCurrentMonth: isSameMonth(day, date),
    isToday: isToday(day),
    dayOfMonth: format(day, "d"),
    fullDate: format(day, "yyyy-MM-dd"),
  }));
};

export const getMonthName = (date: Date) => format(date, "MMMM yyyy");

export const nextMonth = (date: Date) => addMonths(date, 1);
export const prevMonth = (date: Date) => subMonths(date, 1);
export const nextWeek = (date: Date) => addDays(date, 7);
export const prevWeek = (date: Date) => addDays(date, -7);
