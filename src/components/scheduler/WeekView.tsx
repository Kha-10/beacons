import { generateWeekDays } from "@/lib/calendarUtils";
import { type Event } from "@/lib/types";
import WeekDayColumn from "./WeekDayColumn";
import { format } from "date-fns";

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onEventEdit: (event: Event) => void;
  onDateClick: (date: string) => void;
  onEventDrop: (eventId: string, newDate: string) => void;
}

export default function WeekView({
  currentDate,
  events,
  onEventClick,
  onEventEdit,
  onDateClick,
  onEventDrop,
}: WeekViewProps) {
  const weekDays = generateWeekDays(currentDate);

  return (
    <div className="border-t grid grid-cols-7">
      {weekDays.map((day) => (
        <div
          key={day.fullDate}
          className="p-2 text-center text-sm font-medium text-muted-foreground border-r border-b"
        >
          <span className="hidden md:inline">{format(day.date, "EEEE")}</span>
          <span className="md:hidden">{format(day.date, "E")}</span>
          <p className="text-2xl font-semibold text-foreground">
            {day.dayOfMonth}
          </p>
        </div>
      ))}
      {weekDays.map((day) => {
        const eventsForDay = events
          .filter((event) => event.date === day.fullDate)
          .sort((a, b) => a.time.localeCompare(b.time));
        return (
          <WeekDayColumn
            key={day.fullDate}
            day={day}
            events={eventsForDay}
            onEventClick={onEventClick}
            onEventEdit={onEventEdit}
            onDateClick={onDateClick}
            onEventDrop={onEventDrop}
          />
        );
      })}
    </div>
  );
}
