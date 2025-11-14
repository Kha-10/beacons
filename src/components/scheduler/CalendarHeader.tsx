import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { getMonthName } from '@/lib/calendarUtils';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  view: 'month' | 'week';
  onViewChange: (view: 'month' | 'week') => void;
}

export default function CalendarHeader({ currentDate, onPrevMonth, onNextMonth, onToday, view, onViewChange }: CalendarHeaderProps) {
  const handleValueChange = (value: string) => {
    if (value === 'month' || value === 'week') {
      onViewChange(value);
    }
  }

  const getHeaderText = () => {
    if (view === 'month') {
      return getMonthName(currentDate);
    }
    const start = format(currentDate, 'MMMM d');
    return `${start}`;
  }
  
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-foreground">Social Stream Scheduler</h1>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={onPrevMonth} aria-label={view === 'month' ? 'Previous month' : 'Previous week'}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextMonth} aria-label={view === 'month' ? 'Next month' : 'Next week'}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={onToday}>Today</Button>
        <h2 className="text-lg font-semibold w-36 text-center">{getHeaderText()}</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-1.5">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <ToggleGroup type="single" value={view} onValueChange={handleValueChange} variant="outline">
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </header>
  );
}
