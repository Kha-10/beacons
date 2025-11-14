import { generateMonthDays } from '@/lib/calendarUtils';
import { type Event } from '@/lib/types';
import DayCell from './DayCell';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onEventEdit: (event: Event) => void;
  onDateClick: (date: string) => void;
  onEventDrop: (eventId: string, newDate: string) => void;
}

export default function MonthView({ currentDate, events, onEventClick, onEventEdit, onDateClick, onEventDrop }: MonthViewProps) {
  const days = generateMonthDays(currentDate);

  return (
    <div className="grid grid-cols-7 border-t">
      {WEEKDAYS.map(day => (
        <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-r border-b">
          {day}
        </div>
      ))}
      {days.map(day => {
        const eventsForDay = events.filter(event => event.date === day.fullDate).sort((a,b) => a.time.localeCompare(b.time));
        return (
          <DayCell 
            key={day.fullDate}
            day={day}
            events={eventsForDay}
            onEventClick={onEventClick}
            onEventEdit={onEventEdit}
            onDateClick={onDateClick}
            onEventDrop={onEventDrop}
          />
        )
      })}
    </div>
  );
}
