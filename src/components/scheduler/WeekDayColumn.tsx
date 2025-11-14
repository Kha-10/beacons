"use client";

import { useState } from "react";
import { type CalendarDay } from "@/lib/calendarUtils";
import { type Event } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventPill from "./EventtPill";

interface WeekDayColumnProps {
  day: CalendarDay;
  events: Event[];
  onEventClick: (event: Event) => void;
  onEventEdit: (event: Event) => void;
  onDateClick: (date: string) => void;
  onEventDrop: (eventId: string, newDate: string) => void;
}

export default function WeekDayColumn({
  day,
  events,
  onEventClick,
  onEventEdit,
  onDateClick,
  onEventDrop,
}: WeekDayColumnProps) {
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

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative min-h-[60vh] border-r p-2 flex flex-col group",
        day.isToday && "bg-accent/20",
        isDragOver && "bg-accent/30",
        "transition-colors duration-200"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDateClick(day.fullDate)}
        aria-label={`Add event on ${day.fullDate}`}
      >
        <Plus className="h-4 w-4" />
      </Button>

      <div className="mt-10 space-y-2 grow overflow-y-auto">
        {events.map((event) => (
          <EventPill
            key={event.id}
            event={event}
            onClick={() => onEventClick(event)}
            onEditClick={() => onEventEdit(event)}
          />
        ))}
      </div>
    </div>
  );
}
