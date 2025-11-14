"use client";

import { useState } from "react";
import { type CalendarDay } from "@/lib/calendarUtils";
import { type Event } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventPill from "./EventtPill";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const MAX_EVENTS_VISIBLE = 3;

interface DayCellProps {
  day: CalendarDay;
  events: Event[];
  onEventClick: (event: Event) => void;
  onEventEdit: (event: Event) => void;
  onDateClick: (date: string) => void;
  onEventDrop: (eventId: string, newDate: string) => void;
}

export default function DayCell({
  day,
  events,
  onEventClick,
  onEventEdit,
  onDateClick,
  onEventDrop,
}: DayCellProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const eventId = e.dataTransfer.getData("text/plain");
    onEventDrop(eventId, day.fullDate);
  };

  const hiddenEvents = events.slice(MAX_EVENTS_VISIBLE);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative h-40 border-b border-r p-2 flex flex-col group",
        !day.isCurrentMonth && "bg-secondary/30",
        day.isCurrentMonth && "bg-card",
        isDragOver && "bg-accent/30",
        "transition-colors duration-200"
      )}
    >
      <div className="flex justify-between items-start">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => day.isCurrentMonth && onDateClick(day.fullDate)}
          disabled={!day.isCurrentMonth}
          aria-label={`Add event on ${day.fullDate}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <span
          className={cn(
            "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
            !day.isCurrentMonth && "text-muted-foreground",
            day.isToday && "bg-primary text-primary-foreground"
          )}
        >
          {day.dayOfMonth}
        </span>
      </div>
      <div className="mt-1 space-y-1.5 grow overflow-y-auto">
        {events.slice(0, MAX_EVENTS_VISIBLE).map((event) => (
          <EventPill
            key={event.id}
            event={event}
            onClick={() => onEventClick(event)}
            onEditClick={() => onEventEdit(event)}
          />
        ))}
        {hiddenEvents.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-xs text-primary hover:underline font-medium mt-1 w-full text-left px-2">
                + {hiddenEvents.length} More
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <ScrollArea className="h-[200px]">
                <div className="p-2 space-y-1.5">
                  {hiddenEvents.map((event) => (
                    <EventPill
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event)}
                      onEditClick={() => onEventEdit(event)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
