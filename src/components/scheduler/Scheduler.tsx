"use client";

import { useState, useEffect, useCallback } from "react";
import { type Event } from "@/lib/types";
import { MOCK_EVENTS } from "@/lib/events";
import { toast } from "sonner";
import CalendarHeader from "./CalendarHeader";
import MonthView from "./MonthView";
import { nextMonth, prevMonth, nextWeek, prevWeek } from "@/lib/calendarUtils";
import NewEventSheet from "./NewEventSheet";
import EventDetailsSheet from "./EventDetailSheet";
import WeekView from "./WeekView";

export default function Scheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [view, setView] = useState<"month" | "week">("month");

  useEffect(() => {
    setEvents(MOCK_EVENTS);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentDate((currentDate) =>
      view === "month" ? prevMonth(currentDate) : prevWeek(currentDate)
    );
  }, [view]);

  const handleNext = useCallback(() => {
    setCurrentDate((currentDate) =>
      view === "month" ? nextMonth(currentDate) : nextWeek(currentDate)
    );
  }, [view]);

  const handleToday = () => setCurrentDate(new Date());

  const handleAddEvent = (newEventData: Omit<Event, "id">) => {
    const newEvent = { ...newEventData, id: Date.now().toString() };
    setEvents((prev) => [...prev, newEvent]);
    setSelectedDate(null);
    // toast({
    //   title: "✅ Post Scheduled!",
    //   description: `Your post "${newEvent.title}" is on the calendar.`,
    // });
  };

  const handleUpdateEvent = (
    eventId: string,
    updatedValues: Omit<Event, "id" | "date">
  ) => {
    let eventTitle = "";
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const updatedEvent = {
            ...e,
            ...updatedValues,
          };
          eventTitle = updatedEvent.title;
          return updatedEvent;
        }
        return e;
      })
    );

    // After update, reflect changes in the selected event state as well
    setSelectedEvent((prev) => (prev ? { ...prev, ...updatedValues } : null));
    setIsEditing(false);

    // toast({
    //     title: "✅ Post Updated!",
    //     description: `Your post "${eventTitle}" has been successfully updated.`,
    // });
  };

  const handleReschedule = (eventId: string, newDate: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event && event.date !== newDate) {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, date: newDate } : e))
      );
      //   toast({
      //     title: "✅ Done! We’ve rescheduled your post.",
      //     description: `"${event.title}" moved to ${format(new Date(newDate.replace(/-/g, '/')), 'MMMM d, yyyy')}.`
      //   });
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setIsDetailSheetOpen(false);
      setSelectedEvent(null);
      setIsEditing(false);
      // toast({
      //     title: "🗑️ Post Deleted",
      //     description: `Your post "${event.title}" has been removed.`,
      //     variant: "destructive",
      // });
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEditing(false);
    setIsDetailSheetOpen(true);
  };

  const handleEventEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditing(true);
    setIsDetailSheetOpen(true);
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setIsDetailSheetOpen(false);
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const handleDetailSheetOpenChange = (open: boolean) => {
    setIsDetailSheetOpen(open);
    if (!open) {
      setSelectedEvent(null);
      setIsEditing(false);
    }
  };

  const handleNewEventSheetOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedDate(null);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg border">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrev}
        onNextMonth={handleNext}
        onToday={handleToday}
        view={view}
        onViewChange={setView}
      />
      {view === "month" ? (
        <MonthView
          currentDate={currentDate}
          events={events}
          onEventClick={handleEventClick}
          onEventEdit={handleEventEdit}
          onDateClick={handleDateClick}
          onEventDrop={handleReschedule}
        />
      ) : (
        <WeekView
          currentDate={currentDate}
          events={events}
          onEventClick={handleEventClick}
          onEventEdit={handleEventEdit}
          onDateClick={handleDateClick}
          onEventDrop={handleReschedule}
        />
      )}
      <NewEventSheet
        isOpen={!!selectedDate}
        onOpenChange={handleNewEventSheetOpenChange}
        selectedDate={selectedDate}
        onAddEvent={handleAddEvent}
      />
      {selectedEvent && (
        <EventDetailsSheet
          isOpen={isDetailSheetOpen}
          onOpenChange={handleDetailSheetOpenChange}
          event={selectedEvent}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onDelete={handleDeleteEvent}
          onUpdate={handleUpdateEvent}
        />
      )}
    </div>
  );
}
