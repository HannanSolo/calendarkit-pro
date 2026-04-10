import React$1 from 'react';
import { Locale } from 'date-fns';
import { ClassValue } from 'clsx';

type ViewType = 'month' | 'week' | 'day' | 'agenda' | 'resource';
interface EventAttachment {
    id: string;
    name: string;
    url?: string;
    type: 'file' | 'link' | 'image';
    size?: string;
}
interface EventReminder {
    id: string;
    type: 'notification' | 'email';
    time: number;
    label?: string;
}
interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    color?: string;
    allDay?: boolean;
    calendarId?: string;
    resourceId?: string;
    type?: string;
    icon?: string;
    attachments?: EventAttachment[];
    guests?: string[];
    reminders?: EventReminder[];
    recurrence?: {
        freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
        interval?: number;
        count?: number;
        until?: Date;
        byweekday?: number[];
    };
    [key: string]: any;
}
interface EventType {
    id: string;
    label: string;
    color?: string;
    icon?: React.ReactNode;
}
interface Resource {
    id: string;
    label: string;
    color?: string;
    avatar?: string;
}
interface ThemeColors {
    primary?: string;
    secondary?: string;
    background?: string;
    foreground?: string;
    border?: string;
    muted?: string;
    accent?: string;
}
interface CalendarTheme {
    colors?: ThemeColors;
    fontFamily?: string;
    borderRadius?: string;
}
interface CalendarTranslations {
    today: string;
    month: string;
    week: string;
    day: string;
    agenda: string;
    resource: string;
    createEvent: string;
    editEvent: string;
    delete: string;
    save: string;
    cancel: string;
    title: string;
    start: string;
    end: string;
    allDay: string;
    description: string;
    repeat: string;
    noRepeat: string;
    selectCalendar: string;
    selectType: string;
    daily: string;
    weekly: string;
    monthly: string;
    yearly: string;
    event: string;
    task: string;
    appointmentSchedule: string;
    new: string;
    dateAndTime: string;
    timezone: string;
    whosJoining: string;
    suggestedTimes: string;
    viewSuggestions: string;
    whereWillItBe: string;
    location: string;
    descriptionAndAttachments: string;
    dragAndDrop: string;
    guests: string;
    addAttachment: string;
    moreOptions: string;
    doesNotRepeat: string;
    locationHelpText: string;
}
interface CalendarProps {
    events?: CalendarEvent[];
    translations?: Partial<CalendarTranslations>;
    view?: ViewType;
    onViewChange?: (view: ViewType) => void;
    date?: Date;
    onDateChange?: (date: Date) => void;
    onEventClick?: (event: CalendarEvent) => void;
    onEventDrop?: (event: CalendarEvent, start: Date, end: Date) => void;
    onEventResize?: (event: CalendarEvent, start: Date, end: Date) => void;
    onEventCreate?: (event: Partial<CalendarEvent>) => void;
    onEventUpdate?: (event: CalendarEvent) => void;
    onEventDelete?: (eventId: string) => void;
    theme?: CalendarTheme;
    locale?: Locale;
    timezone?: string;
    onTimezoneChange?: (timezone: string) => void;
    className?: string;
    readOnly?: boolean;
    calendars?: {
        id: string;
        label: string;
        color?: string;
        active?: boolean;
    }[];
    resources?: Resource[];
    eventTypes?: EventType[];
    onCalendarToggle?: (calendarId: string, active: boolean) => void;
    isLoading?: boolean;
    isDarkMode?: boolean;
    onThemeToggle?: () => void;
    hideViewSwitcher?: boolean;
    language?: 'en' | 'fr';
    onLanguageChange?: (lang: 'en' | 'fr') => void;
    renderEventForm?: (props: {
        isOpen: boolean;
        onClose: () => void;
        event?: CalendarEvent | null;
        initialDate?: Date;
        onSave: (event: Partial<CalendarEvent>) => void;
        onDelete?: (eventId: string) => void;
    }) => React.ReactNode;
}

declare function cn(...inputs: ClassValue[]): string;

declare const Scheduler: React$1.FC<CalendarProps>;

export { type CalendarEvent, type CalendarProps, type CalendarTheme, type CalendarTranslations, type EventAttachment, type EventReminder, type EventType, type Resource, Scheduler, type ThemeColors, type ViewType, cn };
