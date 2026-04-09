"use client";

import { useState, useMemo } from "react";
import { Scheduler, CalendarEvent, ViewType, Resource, EventType } from "@/index";

interface Calendar {
  id: string;
  label: string;
  color: string;
  active: boolean;
}
import { addDays, startOfWeek, addHours } from "date-fns";
import { fr, enUS } from "date-fns/locale";

// Generate demo events
const generateDemoEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const today = new Date();
  const weekStart = startOfWeek(today);

  const createEvent = (
    id: string,
    title: string,
    dayOffset: number,
    hourStart: number,
    duration: number,
    calendarId: string,
    color: string,
    resourceId?: string,
    recurrence?: CalendarEvent["recurrence"]
  ): CalendarEvent => {
    const start = addHours(addDays(weekStart, dayOffset), hourStart);
    const end = addHours(start, duration);
    return { id, title, start, end, calendarId, color, resourceId, recurrence };
  };

  // Monday
  events.push(createEvent("1", "Team Standup", 1, 9, 0.5, "work", "#3b82f6", "room-a"));
  events.push(createEvent("2", "Project Review", 1, 10, 2, "work", "#3b82f6", "room-b"));
  events.push(createEvent("3", "Lunch Meeting", 1, 12, 1, "personal", "#10b981"));

  // Tuesday
  events.push(createEvent("4", "Client Call", 2, 9, 1, "work", "#3b82f6", "room-a"));
  events.push(createEvent("5", "Code Review", 2, 14, 1.5, "work", "#3b82f6"));

  // Wednesday - with recurrence
  events.push(createEvent("6", "Workshop", 3, 10, 3, "work", "#3b82f6", "room-c"));
  events.push(createEvent("7", "Gym", 3, 17, 1, "personal", "#10b981", undefined, {
    freq: "WEEKLY",
    interval: 1
  }));

  // Thursday
  events.push(createEvent("8", "Sprint Planning", 4, 9, 2, "work", "#3b82f6", "room-b"));
  events.push(createEvent("9", "1:1 Meeting", 4, 14, 0.5, "work", "#3b82f6", "room-a"));

  // Friday
  events.push(createEvent("10", "Demo Day", 5, 14, 2, "work", "#3b82f6", "room-c"));
  events.push(createEvent("11", "Happy Hour", 5, 17, 2, "personal", "#10b981"));

  // Multi-day all-day events
  events.push({
    id: "ad-1",
    title: "Team Offsite",
    start: addDays(weekStart, 1), // Monday
    end: addDays(weekStart, 3),   // Wednesday
    allDay: true,
    calendarId: "work",
    color: "#8b5cf6",
  });
  events.push({
    id: "ad-2",
    title: "Holiday",
    start: addDays(weekStart, 5), // Friday
    end: addDays(weekStart, 5),   // Single day
    allDay: true,
    calendarId: "personal",
    color: "#10b981",
  });
  events.push({
    id: "ad-3",
    title: "Conference",
    start: addDays(weekStart, 3), // Wednesday
    end: addDays(weekStart, 6),   // Saturday
    allDay: true,
    calendarId: "work",
    color: "#f59e0b",
  });

  return events;
};

// Demo resources
const demoResources: Resource[] = [
  { id: "room-a", label: "Conference Room A", color: "#3b82f6" },
  { id: "room-b", label: "Conference Room B", color: "#10b981" },
  { id: "room-c", label: "Meeting Room C", color: "#f59e0b" },
];

// Demo event types
const demoEventTypes: EventType[] = [
  { id: "meeting", label: "Meeting", color: "#3b82f6" },
  { id: "focus", label: "Focus Time", color: "#8b5cf6" },
  { id: "personal", label: "Personal", color: "#10b981" },
];

// Translations
const translations = {
  en: {
    today: "Today",
    month: "Month",
    week: "Week",
    day: "Day",
    agenda: "Agenda",
    resource: "Resource",
    createEvent: "Create Event",
    editEvent: "Edit Event",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    title: "Title",
    start: "Start",
    end: "End",
    allDay: "All Day",
    description: "Description",
    repeat: "Repeat",
    noRepeat: "Does not repeat",
    selectCalendar: "Select Calendar",
    selectType: "Select Type",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
  },
  fr: {
    today: "Aujourd'hui",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
    agenda: "Agenda",
    resource: "Ressource",
    createEvent: "Créer un événement",
    editEvent: "Modifier l'événement",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    title: "Titre",
    start: "Début",
    end: "Fin",
    allDay: "Toute la journée",
    description: "Description",
    repeat: "Répéter",
    noRepeat: "Ne se répète pas",
    selectCalendar: "Sélectionner un calendrier",
    selectType: "Sélectionner un type",
    daily: "Quotidien",
    weekly: "Hebdomadaire",
    monthly: "Mensuel",
    yearly: "Annuel",
  },
};

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>(generateDemoEvents());
  const [view, setView] = useState<ViewType>("week");
  const [date, setDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [timezone, setTimezone] = useState("America/New_York");

  const [calendars, setCalendars] = useState<Calendar[]>([
    { id: "work", label: "Work", color: "#3b82f6", active: true },
    { id: "personal", label: "Personal", color: "#10b981", active: true },
  ]);

  const filteredEvents = useMemo(() => {
    const activeIds = calendars.filter((c) => c.active).map((c) => c.id);
    return events.filter((e) => !e.calendarId || activeIds.includes(e.calendarId));
  }, [events, calendars]);

  const handleEventCreate = (newEvent: Partial<CalendarEvent>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: Math.random().toString(36).substr(2, 9),
      start: newEvent.start as Date,
      end: newEvent.end as Date,
      title: newEvent.title || "New Event",
      color: calendars.find((c) => c.id === newEvent.calendarId)?.color || "#3b82f6",
    };
    setEvents((prev) => [...prev, event]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
  };

  const handleEventDelete = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  return (
    <main className={`min-h-screen p-4 md:p-8 ${isDarkMode ? "dark" : ""}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ProScheduler</h1>
          <p className="text-muted-foreground">
            Professional React calendar with drag-drop, timezone support, i18n, resources, and recurring events.
          </p>
        </div>

        <div className="h-[800px] border rounded-lg overflow-hidden">
          <Scheduler
            events={filteredEvents}
            view={view}
            onViewChange={setView}
            date={date}
            onDateChange={setDate}
            calendars={calendars}
            onCalendarToggle={(id, active) => {
              setCalendars((cals) =>
                cals.map((c) => (c.id === id ? { ...c, active } : c))
              );
            }}
            onEventCreate={handleEventCreate}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            resources={demoResources}
            eventTypes={demoEventTypes}
            isDarkMode={isDarkMode}
            onThemeToggle={() => setIsDarkMode(!isDarkMode)}
            timezone={timezone}
            onTimezoneChange={setTimezone}
            language={language}
            onLanguageChange={(lang) => setLanguage(lang as "en" | "fr")}
            translations={translations[language]}
            locale={language === "fr" ? fr : enUS}
          />
        </div>
      </div>
    </main>
  );
}
