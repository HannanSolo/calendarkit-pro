import * as React6 from 'react';
import React6__default, { useState, useCallback, useId, useMemo, useEffect, useRef } from 'react';
import { useDraggable, useSensors, useSensor, PointerSensor, DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';
import { createSnapModifier, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInDays, format, differenceInMinutes, subDays, addDays, differenceInMilliseconds, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, startOfDay, isBefore, isAfter, isSameDay, addWeeks, addMonths, subWeeks, subMonths, startOfMonth, endOfMonth, isTomorrow, differenceInCalendarDays } from 'date-fns';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Menu, ChevronLeft, ChevronRight, Sun, Moon, CalendarDays, CalendarRange, Calendar, ListTodo, Plus, ChevronDown, Globe, Clock, Users, Paperclip, Bell, Edit3, Copy, Trash2, X, Edit2, MapPin, ExternalLink, AlignLeft, File, Download, BellRing, Check, Repeat, Tag } from 'lucide-react';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { CSS } from '@dnd-kit/utilities';
import { RRule } from 'rrule';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}
var buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React6.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
var CalendarHeader = ({
  currentDate,
  onPrev,
  onNext,
  onToday,
  view,
  onViewChange,
  onMenuClick,
  isDarkMode,
  onThemeToggle,
  translations,
  hideViewSwitcher,
  language,
  onLanguageChange,
  locale
}) => {
  const viewConfig = [
    { key: "month", icon: CalendarDays },
    { key: "week", icon: CalendarRange },
    { key: "day", icon: Calendar },
    { key: "agenda", icon: ListTodo }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between px-3 md:px-5 py-3 border-b-[0px] border-border/50 bg-gradient-to-r from-background via-background to-muted/20 gap-3 md:gap-0 min-h-[64px]", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 w-full md:w-auto justify-between md:justify-start", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 md:gap-3", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-xl h-10 w-10 hidden md:inline-flex transition-all duration-200",
          onClick: onMenuClick,
          children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          onClick: onToday,
          className: "h-9 px-5 rounded-xl text-sm font-medium hidden sm:inline-flex border-[0.5px] border-border/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200",
          children: translations.today
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-muted/40 rounded-xl p-0.5", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: onPrev,
            className: "rounded-lg h-8 w-8 hover:bg-background/80 transition-all duration-200",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 text-muted-foreground" })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: onNext,
            className: "rounded-lg h-8 w-8 hover:bg-background/80 transition-all duration-200",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ml-2 md:ml-4", children: /* @__PURE__ */ jsx("h2", { className: "text-lg md:text-xl font-semibold text-foreground whitespace-nowrap capitalize tracking-tight", children: format(currentDate, "MMMM yyyy", { locale }) }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end", children: [
      onLanguageChange && language && /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => onLanguageChange(language === "en" ? "fr" : "en"),
          className: "h-9 px-3 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-all duration-200 uppercase tracking-wider",
          children: language
        }
      ),
      onThemeToggle && /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "rounded-xl h-9 w-9 hover:bg-accent/80 transition-all duration-200",
          onClick: onThemeToggle,
          children: isDarkMode ? /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4 text-amber-500" }) : /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4 text-muted-foreground" })
        }
      ),
      !hideViewSwitcher && /* @__PURE__ */ jsx("div", { className: "flex items-center bg-muted/50 backdrop-blur-sm rounded-xl p-1", children: viewConfig.map(({ key, icon: Icon }) => /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => onViewChange(key),
          className: cn(
            "h-8 px-3 text-xs rounded-lg transition-all duration-200 gap-1.5",
            view === key ? "bg-background shadow-sm text-foreground font-medium border-[0.5px] border-border/50" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          ),
          children: [
            /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: translations[key] })
          ]
        },
        key
      )) })
    ] })
  ] });
};
var getMonthGrid = (date, weekStartOn = 0) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: weekStartOn });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: weekStartOn });
  return eachDayOfInterval({
    start: startDate,
    end: endDate
  });
};
var MiniCalendar = ({
  currentDate,
  onDateChange,
  onViewChange,
  className
}) => {
  const [viewDate, setViewDate] = React6__default.useState(currentDate);
  React6__default.useEffect(() => {
    setViewDate(currentDate);
  }, [currentDate]);
  const days = React6__default.useMemo(() => getMonthGrid(viewDate), [viewDate]);
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const handlePrev = () => {
    const newDate = subMonths(viewDate, 1);
    setViewDate(newDate);
    onDateChange(newDate);
    if (onViewChange) onViewChange("month");
  };
  const handleNext = () => {
    const newDate = addMonths(viewDate, 1);
    setViewDate(newDate);
    onDateChange(newDate);
    if (onViewChange) onViewChange("month");
  };
  const handleDateClick = (day) => {
    onDateChange(day);
    if (onViewChange) onViewChange("day");
  };
  return /* @__PURE__ */ jsxs("div", { className: cn("px-4 w-[260px]", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground capitalize", children: format(viewDate, "MMMM yyyy") }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-muted/40 rounded-lg p-0.5", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-7 w-7 rounded-md hover:bg-background/80 transition-all",
            onClick: handlePrev,
            "aria-label": "Previous month",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-7 w-7 rounded-md hover:bg-background/80 transition-all",
            onClick: handleNext,
            "aria-label": "Next month",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-y-2 text-center mb-2", children: weekDays.map((day, i) => /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground/70 font-semibold uppercase", children: day }, `${day}-${i}`)) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-y-1 text-center", children: days.map((day) => {
      const isSelected = isSameDay(day, currentDate);
      const isCurrentMonth = isSameMonth(day, viewDate);
      const isTodayDate = isToday(day);
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleDateClick(day),
          className: cn(
            "h-8 w-8 mx-auto flex items-center justify-center text-xs rounded-xl transition-all duration-200 font-medium",
            !isCurrentMonth && "text-muted-foreground/30",
            isCurrentMonth && !isSelected && !isTodayDate && "text-foreground hover:bg-accent/80",
            isSelected && "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105",
            !isSelected && isTodayDate && "bg-primary/10 text-primary ring-1 ring-primary/30"
          ),
          children: format(day, "d")
        },
        day.toISOString()
      );
    }) })
  ] });
};
var Sidebar = ({
  currentDate,
  onDateChange,
  onViewChange,
  onEventCreate,
  timezone,
  onTimezoneChange,
  className,
  readOnly,
  calendars,
  onCalendarToggle,
  translations
}) => {
  const [calendarsOpen, setCalendarsOpen] = useState(true);
  const [timezoneOpen, setTimezoneOpen] = useState(false);
  const [now, setNow] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
    setNow(/* @__PURE__ */ new Date());
    const timer = setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(timer);
  }, []);
  const defaultCalendars = [
    { id: "1", label: "My Calendar", color: "#3b82f6", active: true },
    { id: "2", label: "Birthdays", color: "#10b981", active: true },
    { id: "3", label: "Tasks", color: "#6366f1", active: true }
  ];
  const displayCalendars = calendars || defaultCalendars;
  const getAcronym = (tz) => {
    if (!tz || !now) return "LOC";
    try {
      return new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(now).find((part) => part.type === "timeZoneName")?.value || "";
    } catch (e) {
      return "";
    }
  };
  const timezones = [
    { value: "", label: "Local Time", acronym: "LOC" },
    { value: "UTC", label: "UTC", acronym: "UTC" },
    { value: "America/New_York", label: "New York", acronym: "EST" },
    { value: "America/Chicago", label: "Chicago", acronym: "CST" },
    { value: "America/Denver", label: "Denver", acronym: "MST" },
    { value: "America/Los_Angeles", label: "Los Angeles", acronym: "PST" },
    { value: "Europe/London", label: "London", acronym: "GMT" },
    { value: "Europe/Paris", label: "Paris", acronym: "CET" },
    { value: "Europe/Berlin", label: "Berlin", acronym: "CET" },
    { value: "Asia/Dubai", label: "Dubai", acronym: "GST" },
    { value: "Asia/Tokyo", label: "Tokyo", acronym: "JST" },
    { value: "Asia/Singapore", label: "Singapore", acronym: "SGT" },
    { value: "Australia/Sydney", label: "Sydney", acronym: "AEDT" }
  ];
  const formatTzLabel = (tz, showTime = true) => {
    if (!hasMounted || !now || !showTime) {
      return /* @__PURE__ */ jsx("span", { children: tz.label });
    }
    let time = "";
    let acronym = tz.acronym;
    try {
      if (!tz.value) {
        time = format(now, "HH:mm");
        try {
          acronym = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(now).find((part) => part.type === "timeZoneName")?.value || "LOC";
        } catch (e) {
        }
      } else {
        const zDate = toZonedTime(now, tz.value);
        time = format(zDate, "HH:mm");
        const dynAcronym = getAcronym(tz.value);
        if (dynAcronym && !dynAcronym.includes("GMT") && !dynAcronym.includes("Time")) {
          acronym = dynAcronym;
        }
      }
    } catch (e) {
      return /* @__PURE__ */ jsx("span", { children: tz.label });
    }
    return /* @__PURE__ */ jsxs("div", { className: "flex justify-between w-full", children: [
      /* @__PURE__ */ jsx("span", { children: tz.label }),
      /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground ml-2 tabular-nums", children: [
        time,
        " ",
        /* @__PURE__ */ jsxs("span", { className: "text-xs opacity-75", children: [
          "(",
          acronym,
          ")"
        ] })
      ] })
    ] });
  };
  const selectedTzObj = timezones.find((t) => t.value === (timezone || ""));
  const selectedTimezoneLabel = selectedTzObj ? formatTzLabel(selectedTzObj) : translations?.localTime || "Local Time";
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col w-[260px] overflow-x-hidden h-full bg-gradient-to-b scrollbar-hide from-background via-background to-muted/10 pt-4 pb-4 overflow-y-auto hidden lg:flex", className), children: [
    !readOnly && /* @__PURE__ */ jsx("div", { className: "px-4 mb-6", children: /* @__PURE__ */ jsxs(
      Button,
      {
        className: "w-full rounded-2xl shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 h-12 gap-3 justify-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] font-semibold",
        onClick: onEventCreate,
        children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: translations?.create || "Create" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(MiniCalendar, { currentDate, onDateChange, onViewChange }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 px-4 space-y-5 mt-5", children: /* @__PURE__ */ jsxs("div", { className: "bg-muted/20 rounded-2xl p-3 border-[0px] border-border/30", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-center justify-between cursor-pointer hover:bg-accent/50 p-2 -m-1 rounded-xl mb-2 transition-all duration-200",
          onClick: () => setCalendarsOpen(!calendarsOpen),
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground", children: translations?.calendars || "Calendars" }),
            /* @__PURE__ */ jsx(ChevronDown, { className: cn("w-4 h-4 text-muted-foreground transition-transform duration-200", calendarsOpen && "rotate-180") })
          ]
        }
      ),
      calendarsOpen && /* @__PURE__ */ jsx("div", { className: "space-y-1", children: displayCalendars.map((cal) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-center gap-3 py-2 px-2 hover:bg-accent/60 rounded-xl cursor-pointer group transition-all duration-200",
          onClick: () => onCalendarToggle?.(cal.id, !(cal.active ?? true)),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: cal.active ?? true,
                  onChange: (e) => {
                    e.stopPropagation();
                    onCalendarToggle?.(cal.id, e.target.checked);
                  },
                  className: "peer h-5 w-5 rounded-md border-2 border-border/60 cursor-pointer appearance-none checked:border-transparent transition-all duration-200",
                  style: { "--primary-color": cal.color },
                  "data-cal-id": cal.id
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 3, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) }) }),
              /* @__PURE__ */ jsx("style", { children: `
                      input[type="checkbox"][data-cal-id="${cal.id}"]:checked {
                        background-color: ${cal.color} !important;
                        border-color: ${cal.color} !important;
                      }
                      input[type="checkbox"][data-cal-id="${cal.id}"]:focus {
                        --tw-ring-color: ${cal.color}40 !important;
                      }
                    ` })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground/90 truncate font-medium", children: cal.label }) }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity",
                style: { backgroundColor: cal.color }
              }
            )
          ]
        },
        cal.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-auto px-4 pt-5", children: /* @__PURE__ */ jsxs("div", { className: "bg-muted/20 rounded-2xl p-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-primary/10 rounded-lg", children: /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground", children: translations?.timezone || "Timezone" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setTimezoneOpen(!timezoneOpen),
            className: "w-full flex items-center justify-between bg-blue-200/40  hover:bg-blue-200/80 rounded-xl py-2.5 pl-4 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 text-left",
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex-1 truncate mr-2 font-medium", children: selectedTimezoneLabel }),
              /* @__PURE__ */ jsx(ChevronDown, { className: cn("w-4 h-4 text-muted-foreground transition-transform duration-200", timezoneOpen && "rotate-180") })
            ]
          }
        ),
        timezoneOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40", onClick: () => setTimezoneOpen(false) }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-full left-0 w-full mb-2 bg-background rounded-xl shadow-2xl z-50 max-h-[260px] overflow-y-auto p-1.5 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-none", children: timezones.map((tz) => /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-all duration-200",
                (timezone || "") === tz.value ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-accent/80"
              ),
              onClick: () => {
                onTimezoneChange?.(tz.value);
                setTimezoneOpen(false);
              },
              children: formatTzLabel(tz)
            },
            tz.value
          )) })
        ] })
      ] })
    ] }) })
  ] });
};
var DraggableEvent = ({ event, dragId, children, className, style: propStyle, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: dragId || event.id,
    data: { event }
  });
  const style = {
    ...propStyle,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : propStyle?.zIndex,
    // When dragging, we want the ORIGINAL element to be almost invisible (or fully invisible)
    // so that the DragOverlay (the "ghost") is the only thing the user focuses on.
    // If we set opacity: 0, it disappears. If 0.1, it's a faint placeholder.
    // The user asked for "Make the entire dragged item transparent". 
    // Usually this means the original item should be faded out while the drag overlay is moving.
    opacity: isDragging ? 0 : propStyle?.opacity
    // Hiding original element completely
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: setNodeRef,
      style,
      ...listeners,
      ...attributes,
      ...props,
      className: cn("touch-none", className),
      children
    }
  );
};
var DroppableCell = ({ id, date, resourceId, children, className, style, onClick }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { date, resourceId }
  });
  const minutes = date.getMinutes();
  const quarterClass = minutes === 0 ? "hover:bg-blue-50/50 dark:hover:bg-blue-900/10" : minutes === 15 ? "hover:bg-blue-50/80 dark:hover:bg-blue-900/20" : minutes === 30 ? "hover:bg-blue-100/50 dark:hover:bg-blue-900/30" : "hover:bg-blue-100/80 dark:hover:bg-blue-900/40";
  const activeQuarterClass = minutes === 0 ? "bg-blue-50/50 dark:bg-blue-900/10 ring-2 ring-primary ring-inset" : minutes === 15 ? "bg-blue-50/80 dark:bg-blue-900/20 ring-2 ring-primary ring-inset" : minutes === 30 ? "bg-blue-100/50 dark:bg-blue-900/30 ring-2 ring-primary ring-inset" : "bg-blue-100/80 dark:bg-blue-900/40 ring-2 ring-primary ring-inset";
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: setNodeRef,
      className: cn(
        className,
        quarterClass,
        isOver && activeQuarterClass
      ),
      style,
      onClick,
      children
    }
  );
};
function isAllDayEvent(event) {
  return event.allDay === true;
}
function partitionEvents(events) {
  const allDayEvents = [];
  const timedEvents = [];
  for (const event of events) {
    if (isAllDayEvent(event)) {
      allDayEvents.push(event);
    } else {
      timedEvents.push(event);
    }
  }
  return { allDayEvents, timedEvents };
}
function computeAllDayLayout(rowDays, allDayEvents, getZonedDate) {
  const cols = rowDays.length;
  if (cols === 0) return { segments: [], laneCount: 0 };
  const rowStart = startOfDay(rowDays[0]);
  const rowEnd = startOfDay(rowDays[cols - 1]);
  const unsorted = [];
  for (const event of allDayEvents) {
    const evStart = startOfDay(getZonedDate(event.start));
    const evEnd = startOfDay(getZonedDate(event.end));
    if (isAfter(evStart, rowEnd) || isBefore(evEnd, rowStart)) {
      continue;
    }
    const clampedStart = isBefore(evStart, rowStart) ? rowStart : evStart;
    const clampedEnd = isAfter(evEnd, rowEnd) ? rowEnd : evEnd;
    let startCol = -1;
    let endCol = -1;
    for (let i = 0; i < cols; i++) {
      const dayStart = startOfDay(rowDays[i]);
      if (startCol === -1 && isSameDay(dayStart, clampedStart)) {
        startCol = i;
      }
      if (isSameDay(dayStart, clampedEnd)) {
        endCol = i;
      }
    }
    if (startCol === -1) startCol = 0;
    if (endCol === -1) endCol = cols - 1;
    const span = endCol - startCol + 1;
    unsorted.push({
      event,
      startCol,
      span,
      isStart: isSameDay(evStart, clampedStart),
      isEnd: isSameDay(evEnd, clampedEnd)
    });
  }
  unsorted.sort((a, b) => a.startCol - b.startCol || b.span - a.span);
  const occupied = [];
  const segments = [];
  for (const seg of unsorted) {
    let assignedLane = -1;
    for (let lane = 0; lane < occupied.length; lane++) {
      let fits = true;
      for (let c = seg.startCol; c < seg.startCol + seg.span; c++) {
        if (occupied[lane][c]) {
          fits = false;
          break;
        }
      }
      if (fits) {
        assignedLane = lane;
        break;
      }
    }
    if (assignedLane === -1) {
      assignedLane = occupied.length;
      occupied.push(new Array(cols).fill(false));
    }
    for (let c = seg.startCol; c < seg.startCol + seg.span; c++) {
      occupied[assignedLane][c] = true;
    }
    segments.push({ ...seg, lane: assignedLane });
  }
  return {
    segments,
    laneCount: occupied.length
  };
}
var EventItem = React6__default.memo(({ event, onEventClick }) => /* @__PURE__ */ jsx(DraggableEvent, { event, children: /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "text-xs px-2.5 py-1.5 rounded-lg truncate cursor-pointer shadow-sm transition-all duration-200",
      "hover:shadow-md hover:scale-[1.02] hover:z-10",
      !event.color && "bg-primary/10 text-primary hover:bg-primary/15 border-[0.5px] border-primary/20"
    ),
    style: event.color ? {
      backgroundColor: `${event.color}20`,
      color: event.color,
      borderLeft: `3px solid ${event.color}`
    } : void 0,
    onClick: (e) => {
      e.stopPropagation();
      onEventClick?.(event);
    },
    children: /* @__PURE__ */ jsx("span", { className: "font-medium", children: event.title })
  }
) }));
EventItem.displayName = "EventItem";
var AllDayBar = React6__default.memo(({ segment, laneHeight, onEventClick }) => {
  const { event } = segment;
  const totalDays = differenceInDays(event.end, event.start);
  const tooltip = totalDays > 0 ? `${event.title} (${format(event.start, "MMM d")} \u2013 ${format(event.end, "MMM d")})` : event.title;
  return /* @__PURE__ */ jsx(
    DraggableEvent,
    {
      event,
      dragId: `${event.id}-seg-${segment.startCol}`,
      className: "absolute z-10",
      style: {
        top: segment.lane * laneHeight,
        left: `calc(${segment.startCol / 7 * 100}% + 1px)`,
        width: `calc(${segment.span / 7 * 100}% - 2px)`,
        height: laneHeight - 2
      },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "w-full h-full text-[11px] font-semibold px-2 truncate cursor-pointer transition-all hover:shadow-md hover:brightness-95 flex items-center",
            segment.isStart && "rounded-l-md",
            segment.isEnd && "rounded-r-md"
          ),
          style: {
            backgroundColor: `${event.color || "var(--primary)"}30`,
            color: event.color || "var(--primary)",
            borderLeft: segment.isStart ? `3px solid ${event.color || "var(--primary)"}` : void 0
          },
          title: tooltip,
          "aria-label": tooltip,
          role: "button",
          onClick: (e) => {
            e.stopPropagation();
            onEventClick?.(event);
          },
          children: segment.isStart && event.title
        }
      )
    }
  );
});
AllDayBar.displayName = "AllDayBar";
var MonthView = ({
  currentDate,
  events,
  onEventClick,
  onDateClick,
  timezone,
  locale
}) => {
  const days = useMemo(() => getMonthGrid(currentDate), [currentDate]);
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);
  const getZonedDate = useCallback((date) => {
    return timezone ? toZonedTime(date, timezone) : date;
  }, [timezone]);
  const { allDayEvents, timedEvents } = useMemo(
    () => partitionEvents(events),
    [events]
  );
  const weekRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(days.slice(i, i + 7));
    }
    return rows;
  }, [days]);
  const eventsByDay = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    timedEvents.forEach((event) => {
      const zonedStart = getZonedDate(event.start);
      const key = format(zonedStart, "yyyy-MM-dd");
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(event);
    });
    return map;
  }, [timedEvents, getZonedDate]);
  const weekLayouts = useMemo(() => {
    return weekRows.map((week) => computeAllDayLayout(week, allDayEvents, getZonedDate));
  }, [weekRows, allDayEvents, getZonedDate]);
  const allDayLaneHeight = 22;
  const timedEventSlotHeight = 28;
  const weekRowContentHeight = 130;
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col h-full bg-background border-[0.5px] scrollbar-hide border-border/50 rounded-2xl overflow-hidden min-w-[800px] md:min-w-0 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto flex-1 relative", children: [
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 border-b-[0.5px] border-border/50 bg-gradient-to-r from-muted/30 via-muted/40 to-muted/30 sticky top-0 z-20 backdrop-blur-sm", children: weekDays.map((day) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "py-3 text-center text-xs font-semibold text-muted-foreground border-r-[0.5px] border-border/30 last:border-r-0 uppercase tracking-wider",
        children: format(day, "EEE", { locale })
      },
      day.toISOString()
    )) }),
    weekRows.map((week, weekIndex) => {
      const layout = weekLayouts[weekIndex];
      const maxAllDayLanes = Math.floor(weekRowContentHeight / allDayLaneHeight);
      const visibleLanes = Math.min(layout.laneCount, maxAllDayLanes);
      const hasAllDayOverflow = layout.laneCount > maxAllDayLanes;
      const allDaySectionHeight = visibleLanes > 0 ? visibleLanes * allDayLaneHeight + 2 : 0;
      const remainingHeight = weekRowContentHeight - allDaySectionHeight;
      const maxTimedEvents = Math.max(1, Math.floor(remainingHeight / timedEventSlotHeight));
      return /* @__PURE__ */ jsxs("div", { className: "border-b-[0.5px] border-border/30", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7", children: week.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "px-2 pt-2 pb-1 border-r-[0.5px] border-border/30 last:border-r-0 cursor-pointer group",
                !isCurrentMonth && "bg-muted/5 text-muted-foreground/60",
                isToday(day) && "bg-primary/5"
              ),
              onClick: () => onDateClick?.(day),
              children: /* @__PURE__ */ jsx("div", { className: cn(
                "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200",
                isToday(day) ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" : "group-hover:bg-accent"
              ), children: format(day, "d", { locale }) })
            },
            day.toISOString()
          );
        }) }),
        layout.laneCount > 0 && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "grid grid-cols-7 relative",
            style: { height: allDaySectionHeight, overflow: "hidden" },
            children: [
              week.map((day, colIdx) => /* @__PURE__ */ jsx(
                DroppableCell,
                {
                  id: `allday-month-${day.toISOString()}`,
                  date: day,
                  className: "h-full border-r-[0.5px] border-border/30 last:border-r-0",
                  children: /* @__PURE__ */ jsx("div", { className: "w-full h-full" })
                },
                `allday-${day.toISOString()}`
              )),
              layout.segments.filter((s) => s.lane < visibleLanes).map((segment) => /* @__PURE__ */ jsx(
                AllDayBar,
                {
                  segment,
                  laneHeight: allDayLaneHeight,
                  onEventClick
                },
                `${segment.event.id}-${segment.startCol}`
              )),
              hasAllDayOverflow && week.map((day, colIdx) => {
                const hiddenCount = layout.segments.filter(
                  (s) => s.lane >= visibleLanes && colIdx >= s.startCol && colIdx < s.startCol + s.span
                ).length;
                if (hiddenCount === 0) return null;
                const overflowLabel = `${hiddenCount} more all-day ${hiddenCount === 1 ? "event" : "events"}`;
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "absolute text-[9px] text-primary font-semibold cursor-pointer hover:underline z-20",
                    style: {
                      left: `calc(${colIdx / 7 * 100}% + 4px)`,
                      bottom: 0
                    },
                    title: overflowLabel,
                    "aria-label": overflowLabel,
                    role: "button",
                    onClick: (e) => {
                      e.stopPropagation();
                      onDateClick?.(day);
                    },
                    children: [
                      "+",
                      hiddenCount,
                      " more"
                    ]
                  },
                  `overflow-${colIdx}`
                );
              })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7", style: { gridAutoRows: `${remainingHeight}px` }, children: week.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const dayTimedEvents = eventsByDay.get(dayKey) || [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const cellId = day.toISOString();
          return /* @__PURE__ */ jsx(
            DroppableCell,
            {
              id: cellId,
              date: day,
              className: cn(
                "px-2 py-1 border-r-[0.5px] border-border/30 last:border-r-0 relative transition-all duration-200 hover:bg-accent/5 flex flex-col gap-1 overflow-hidden",
                !isCurrentMonth && "bg-muted/5 text-muted-foreground/60",
                isToday(day) && "bg-primary/5"
              ),
              style: { height: `${remainingHeight}px` },
              onClick: () => onDateClick?.(day),
              children: /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-1 scrollbar-hide overflow-y-auto overflow-x-hidden", children: [
                dayTimedEvents.slice(0, maxTimedEvents).map((event) => /* @__PURE__ */ jsx(EventItem, { event, onEventClick }, `${event.id}-${dayKey}`)),
                dayTimedEvents.length > maxTimedEvents && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "text-[10px] text-primary font-semibold text-center py-0.5 px-2 rounded-md bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors",
                    title: `${dayTimedEvents.length - maxTimedEvents} more ${dayTimedEvents.length - maxTimedEvents === 1 ? "event" : "events"}`,
                    "aria-label": `${dayTimedEvents.length - maxTimedEvents} more ${dayTimedEvents.length - maxTimedEvents === 1 ? "event" : "events"}`,
                    role: "button",
                    children: [
                      "+",
                      dayTimedEvents.length - maxTimedEvents,
                      " more"
                    ]
                  }
                )
              ] })
            },
            cellId
          );
        }) })
      ] }, week[0].toISOString());
    })
  ] }) });
};
var ResizableEvent = ({
  event,
  hourHeight,
  minDuration = 15,
  onResize,
  children,
  className,
  style,
  readonly
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHeight, setResizeHeight] = useState(null);
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startYRef.current = clientY;
    startHeightRef.current = containerRef.current?.offsetHeight || 0;
    setIsResizing(true);
    const handleMove = (moveEvent) => {
      const moveClientY = "touches" in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const deltaY = moveClientY - startYRef.current;
      const snapInterval = hourHeight / 4;
      const snappedDelta = Math.round(deltaY / snapInterval) * snapInterval;
      const newHeight = Math.max(
        minDuration / 60 * hourHeight,
        // Minimum height based on minDuration
        startHeightRef.current + snappedDelta
      );
      setResizeHeight(newHeight);
    };
    const handleEnd = () => {
      setIsResizing(false);
      if (resizeHeight !== null && containerRef.current && onResize) {
        const originalHeight = startHeightRef.current;
        const heightDiff = (resizeHeight || originalHeight) - originalHeight;
        const minutesDiff = heightDiff / hourHeight * 60;
        const newEnd = new Date(event.end);
        newEnd.setMinutes(newEnd.getMinutes() + minutesDiff);
        if (newEnd > event.start) {
          onResize(event, newEnd);
        }
      }
      setResizeHeight(null);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd);
  }, [event, hourHeight, minDuration, onResize, resizeHeight]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: cn("relative group", className),
      style: {
        ...style,
        height: resizeHeight !== null ? `${resizeHeight}px` : style?.height
      },
      children: [
        children,
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              readonly ? "cursor-default" : "cursor-ns-resize group-hover:opacity-100",
              "absolute bottom-0 left-0 right-0 h-3 z-20 flex items-center justify-center",
              "opacity-0 transition-opacity",
              isResizing && "opacity-100"
            ),
            onMouseDown: readonly ? void 0 : handleResizeStart,
            onTouchStart: readonly ? void 0 : handleResizeStart,
            children: /* @__PURE__ */ jsx("div", { className: cn(
              "w-8 h-1 rounded-full transition-all",
              isResizing ? "bg-primary" : "bg-muted-foreground/30 group-hover:bg-primary/50"
            ) })
          }
        ),
        isResizing && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 border-2 border-primary border-dashed rounded-md pointer-events-none bg-primary/5" })
      ]
    }
  );
};
var emptyCell = /* @__PURE__ */ jsx("div", { className: "w-full h-full" });
var WeekAllDayBar = React6__default.memo(({ segment, laneHeight, onEventClick }) => /* @__PURE__ */ jsx(
  DraggableEvent,
  {
    event: segment.event,
    className: "absolute z-10",
    style: {
      top: segment.lane * laneHeight + 2,
      left: `calc(${segment.startCol / 7 * 100}% + 2px)`,
      width: `calc(${segment.span / 7 * 100}% - 4px)`,
      height: laneHeight - 4
    },
    children: /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "w-full h-full text-xs font-medium px-2 py-1 truncate cursor-pointer transition-all hover:shadow-md hover:brightness-95",
          segment.isStart && "rounded-l-md",
          segment.isEnd && "rounded-r-md"
        ),
        style: {
          backgroundColor: `${segment.event.color || "var(--primary)"}30`,
          color: segment.event.color || "var(--primary)",
          borderLeft: segment.isStart ? `3px solid ${segment.event.color || "var(--primary)"}` : void 0
        },
        onClick: (e) => {
          e.stopPropagation();
          onEventClick?.(segment.event);
        },
        children: segment.isStart && segment.event.title
      }
    )
  }
));
WeekAllDayBar.displayName = "WeekAllDayBar";
var WeekView = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
  onEventResize,
  timezone,
  locale,
  readonly
}) => {
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourHeight = 60;
  const scrollContainerRef = React6__default.useRef(null);
  const [now, setNow] = React6__default.useState(/* @__PURE__ */ new Date());
  React6__default.useEffect(() => {
    const interval = setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(interval);
  }, []);
  React6__default.useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollToActualTime = () => {
        const currentHour = now.getHours();
        const offsetHour = 4;
        return (currentHour - offsetHour) * hourHeight;
      };
      scrollContainerRef.current.scrollTop = scrollToActualTime();
    }
  }, []);
  const getZonedDate = useCallback((date) => {
    return timezone ? toZonedTime(date, timezone) : date;
  }, [timezone]);
  const zonedNow = getZonedDate(/* @__PURE__ */ new Date());
  const { allDayEvents, timedEvents } = useMemo(
    () => partitionEvents(events),
    [events]
  );
  const allDayLayout = useMemo(
    () => computeAllDayLayout(weekDays, allDayEvents, getZonedDate),
    [weekDays, allDayEvents, getZonedDate]
  );
  const eventsByDay = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    timedEvents.forEach((event) => {
      const zonedStart = getZonedDate(event.start);
      const key = format(zonedStart, "yyyy-MM-dd");
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(event);
    });
    return map;
  }, [timedEvents, getZonedDate]);
  const allDayLaneHeight = 28;
  const maxVisibleLanes = 3;
  const [showAllLanes, setShowAllLanes] = React6__default.useState(false);
  const visibleLaneCount = showAllLanes ? allDayLayout.laneCount : Math.min(allDayLayout.laneCount, maxVisibleLanes);
  const hasOverflowLanes = allDayLayout.laneCount > maxVisibleLanes;
  const getTimezoneDisplay = (tz) => {
    const date = now;
    let displayTime = "";
    let acronym = "";
    if (!tz) {
      displayTime = format(date, "HH:mm");
      try {
        acronym = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(date).find((part) => part.type === "timeZoneName")?.value || "";
      } catch (e) {
        acronym = "LOC";
      }
    } else {
      try {
        const zDate = toZonedTime(date, tz);
        displayTime = format(zDate, "HH:mm");
        acronym = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(date).find((part) => part.type === "timeZoneName")?.value || "";
      } catch (e) {
        displayTime = format(date, "HH:mm");
        acronym = tz;
      }
    }
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center leading-tight", children: [
      /* @__PURE__ */ jsx("span", { children: displayTime }),
      /* @__PURE__ */ jsxs("span", { className: "text-[10px] opacity-75", children: [
        "(",
        acronym,
        ")"
      ] })
    ] });
  };
  const timeFormat = locale?.code === "fr" ? "H:mm" : "h a";
  const eventTimeFormat = locale?.code === "fr" ? "H:mm" : "h:mm a";
  const nowFormat = locale?.code === "fr" ? "H:mm" : "h:mm";
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col h-full bg-background border-[0.5px] border-border/50 rounded-2xl overflow-hidden min-w-[800px] md:min-w-0 shadow-sm", children: /* @__PURE__ */ jsxs(
    "div",
    {
      ref: scrollContainerRef,
      className: "flex-1 overflow-y-auto scrollbar-hide relative bg-background scroll-smooth",
      style: { scrollbarGutter: "stable" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex border-b-[0.5px] border-border/50 bg-gradient-to-r from-muted/20 via-background to-muted/20 z-20 sticky top-0 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-none p-3 text-center text-xs font-semibold text-muted-foreground w-16 flex items-center justify-center border-r-[0.5px] border-border/30 bg-muted/10", children: getTimezoneDisplay(timezone) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 grid grid-cols-7", children: weekDays.map((day, index) => /* @__PURE__ */ jsxs("div", { className: cn("py-3 px-2 text-center", index > 0 && "border-l-[0.5px] border-border/30"), children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5", children: format(day, "EEE", { locale }) }),
            /* @__PURE__ */ jsx("div", { className: cn(
              "w-9 h-9 flex items-center justify-center rounded-xl mx-auto text-sm font-semibold transition-all duration-200",
              isToday(day) ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110" : "text-foreground hover:bg-accent/80"
            ), children: format(day, "d", { locale }) })
          ] }, day.toISOString())) })
        ] }),
        allDayLayout.laneCount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex border-b-[0.5px] border-border/50 bg-muted/5 sticky top-[73px] z-[19]", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-none w-16 border-r-[0.5px] border-border/30 flex items-center justify-center", children: /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight text-center", children: [
            "All",
            /* @__PURE__ */ jsx("br", {}),
            "day"
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "relative",
                style: { height: visibleLaneCount * allDayLaneHeight + 4, overflow: "hidden" },
                children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid grid-cols-7", children: weekDays.map((day, index) => /* @__PURE__ */ jsx(
                    DroppableCell,
                    {
                      id: `allday-${day.toISOString()}`,
                      date: startOfDay(day),
                      className: cn(
                        "h-full",
                        index > 0 && "border-l-[0.5px] border-border/30"
                      ),
                      children: emptyCell
                    },
                    `allday-drop-${day.toISOString()}`
                  )) }),
                  allDayLayout.segments.map((segment) => /* @__PURE__ */ jsx(
                    WeekAllDayBar,
                    {
                      segment,
                      laneHeight: allDayLaneHeight,
                      onEventClick
                    },
                    `allday-${segment.event.id}-${segment.startCol}`
                  ))
                ]
              }
            ),
            hasOverflowLanes && /* @__PURE__ */ jsx(
              "button",
              {
                className: "w-full text-[10px] text-primary font-semibold py-0.5 hover:bg-primary/5 transition-colors",
                onClick: () => setShowAllLanes((v) => !v),
                children: showAllLanes ? "Show less" : `+${allDayLayout.laneCount - maxVisibleLanes} more`
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex min-w-full relative",
            style: { height: hours.length * hourHeight },
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex-none w-16 border-r-[0.5px] border-border/30 relative bg-muted/5", children: hours.map((hour) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "relative w-full text-[11px] text-muted-foreground/80 text-right pr-3 font-medium tabular-nums box-border",
                  style: { height: hourHeight },
                  children: /* @__PURE__ */ jsx("span", { className: "block -translate-y-1/2", children: hour !== 0 && format((/* @__PURE__ */ new Date()).setHours(hour, 0, 0, 0), timeFormat, { locale }) })
                },
                hour
              )) }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 grid grid-cols-7 relative", children: weekDays.map((day, dayIndex) => {
                const dayKey = format(day, "yyyy-MM-dd");
                const dayEvents = eventsByDay.get(dayKey) || [];
                return /* @__PURE__ */ jsxs("div", { className: cn("relative h-full", dayIndex > 0 && "border-l-[0.5px] border-border/30"), children: [
                  hours.map((hour) => {
                    return /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-full border-b-[0.5px] border-dashed border-border/20 box-border relative hover:bg-accent/5 transition-colors",
                        style: { height: hourHeight },
                        children: [0, 15, 30, 45].map((minute) => {
                          const cellDate = new Date(day);
                          cellDate.setHours(hour, minute, 0, 0);
                          const cellId = cellDate.toISOString();
                          return /* @__PURE__ */ jsx(
                            DroppableCell,
                            {
                              id: cellId,
                              date: cellDate,
                              className: "w-full absolute left-0 right-0 z-0 transition-colors",
                              style: {
                                height: "25%",
                                top: `${minute / 60 * 100}%`
                              },
                              children: /* @__PURE__ */ jsx(
                                "div",
                                {
                                  className: "w-full h-full bg-transparent cursor-pointer",
                                  onClick: () => onTimeSlotClick?.(cellDate)
                                }
                              )
                            },
                            minute
                          );
                        })
                      },
                      hour
                    );
                  }),
                  dayEvents.map((event) => {
                    const overlappingEvents = dayEvents.filter((e) => {
                      if (e.id === event.id) return false;
                      const s1 = getZonedDate(event.start).getTime();
                      const e1 = getZonedDate(event.end).getTime();
                      const s2 = getZonedDate(e.start).getTime();
                      const e2 = getZonedDate(e.end).getTime();
                      return s1 < e2 && e1 > s2;
                    });
                    const group = [event, ...overlappingEvents].sort(
                      (a, b) => getZonedDate(a.start).getTime() - getZonedDate(b.start).getTime() || (a.id > b.id ? 1 : -1)
                    );
                    const index = group.findIndex((e) => e.id === event.id);
                    const count = group.length;
                    const widthPercent = 100 / count;
                    const leftPercent = index * widthPercent;
                    const zonedEventStart = getZonedDate(event.start);
                    const zonedEventEnd = getZonedDate(event.end);
                    const startMinutes = zonedEventStart.getHours() * 60 + zonedEventStart.getMinutes();
                    const durationMinutes = differenceInMinutes(zonedEventEnd, zonedEventStart);
                    const top = startMinutes / 60 * hourHeight;
                    const height = durationMinutes / 60 * hourHeight;
                    const isShortEvent = durationMinutes < 60;
                    return /* @__PURE__ */ jsx(
                      DraggableEvent,
                      {
                        event,
                        className: `absolute z-10 transition-all ${readonly ? "cursor-default" : ""}`,
                        style: {
                          top: `${top}px`,
                          height: `${Math.max(height, 20)}px`,
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                          paddingRight: count > 1 ? "2px" : "0"
                        },
                        children: /* @__PURE__ */ jsx(
                          ResizableEvent,
                          {
                            readonly,
                            event,
                            hourHeight,
                            onResize: onEventResize,
                            className: "h-full",
                            style: { height: "100%" },
                            children: /* @__PURE__ */ jsx(
                              "div",
                              {
                                className: cn(
                                  "rounded-md border shadow-sm transition-all hover:shadow-md group overflow-hidden relative",
                                  "glass",
                                  readonly ? "cursor-default" : "cursor-grab active:cursor-grabbing",
                                  !event.color && "border-primary/20 bg-primary/10",
                                  isShortEvent ? "px-1 flex items-center justify-center" : "p-2",
                                  count > 1 && "border-l-4 border-l-primary/50"
                                ),
                                style: {
                                  height: "100%",
                                  backgroundColor: event.color ? `${event.color}15` : void 0,
                                  borderColor: event.color ? `${event.color}40` : void 0,
                                  borderLeftWidth: "3px",
                                  borderLeftColor: event.color || "var(--primary)"
                                },
                                onClick: (e) => {
                                  e.stopPropagation();
                                  onEventClick?.(event);
                                },
                                title: count > 1 ? `${event.title} (${index + 1}/${count})` : void 0,
                                children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full overflow-hidden w-full", children: [
                                  /* @__PURE__ */ jsx("div", { className: cn(
                                    "font-semibold truncate text-foreground/90 leading-tight",
                                    isShortEvent ? "text-xs text-center" : "text-xs"
                                  ), children: event.title }),
                                  !isShortEvent && /* @__PURE__ */ jsxs(Fragment, { children: [
                                    /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground truncate mt-0.5 font-medium leading-tight", children: [
                                      format(zonedEventStart, eventTimeFormat, { locale }),
                                      " - ",
                                      format(zonedEventEnd, eventTimeFormat, { locale })
                                    ] }),
                                    event.description && height > 50 && /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground/80 truncate mt-1 leading-tight opacity-80", children: event.description })
                                  ] }),
                                  count > 1 && !isShortEvent && /* @__PURE__ */ jsx("div", { className: "absolute top-1 right-1 bg-background/80 backdrop-blur-sm rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold text-muted-foreground border border-border shadow-sm", children: count })
                                ] })
                              }
                            )
                          }
                        )
                      },
                      `${event.id}-${day.toISOString()}`
                    );
                  }),
                  isToday(day) && /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "absolute left-0 right-0 z-20 pointer-events-none flex items-center",
                      style: {
                        top: `${(zonedNow.getHours() * 60 + zonedNow.getMinutes()) / 60 * hourHeight}px`
                      },
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "h-[2px] w-full bg-gradient-to-r from-primary via-primary to-primary/50" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute -left-1.5 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/40 ring-2 ring-background animate-pulse" })
                      ]
                    }
                  )
                ] }, day.toISOString());
              }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute left-0 w-16 pointer-events-none z-30 flex justify-end pr-2",
            style: {
              top: `${(zonedNow.getHours() * 60 + zonedNow.getMinutes()) / 60 * hourHeight + 80}px`
            },
            children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-primary-foreground bg-primary px-1.5 py-0.5 rounded-md shadow-md -translate-y-1/2 backdrop-blur-none", children: format(zonedNow, nowFormat, { locale }) })
          }
        )
      ]
    }
  ) });
};
var DayView = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
  onEventResize,
  timezone,
  locale,
  readonly
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourHeight = 80;
  const scrollContainerRef = React6__default.useRef(null);
  const [now, setNow] = React6__default.useState(/* @__PURE__ */ new Date());
  React6__default.useEffect(() => {
    const interval = setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(interval);
  }, []);
  React6__default.useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollToActualTime = () => {
        const currentHour = now.getHours();
        const offsetHour = 3;
        return (currentHour - offsetHour) * hourHeight;
      };
      scrollContainerRef.current.scrollTop = scrollToActualTime();
    }
  }, []);
  const getZonedDate = useCallback((date) => {
    return timezone ? toZonedTime(date, timezone) : date;
  }, [timezone]);
  const zonedNow = getZonedDate(now);
  const { allDayEvents: allAllDay, timedEvents } = useMemo(
    () => partitionEvents(events),
    [events]
  );
  const dayStart = startOfDay(currentDate);
  const allDayEvents = useMemo(() => allAllDay.filter((e) => {
    const evStart = startOfDay(getZonedDate(e.start));
    const evEnd = startOfDay(getZonedDate(e.end));
    return !isBefore(dayStart, evStart) && !isAfter(dayStart, evEnd);
  }), [allAllDay, getZonedDate, dayStart]);
  const dayEvents = useMemo(() => timedEvents.filter((e) => {
    const zonedStart = getZonedDate(e.start);
    return isSameDay(zonedStart, currentDate);
  }), [timedEvents, getZonedDate, currentDate]);
  const timeFormat = locale?.code === "fr" ? "H:mm" : "h a";
  const eventTimeFormat = locale?.code === "fr" ? "H:mm" : "h:mm a";
  const nowFormat = locale?.code === "fr" ? "H:mm" : "h:mm a";
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full bg-background border-[0.5px] border-border/50 rounded-2xl overflow-hidden shadow-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "px-6 py-4 border-b-[0.5px] border-border/50 bg-gradient-to-r from-muted/20 via-background to-muted/20 text-center shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold capitalize text-foreground", children: format(currentDate, "EEEE, MMMM d, yyyy", { locale }) }),
      isToday(currentDate) && /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full shadow-md shadow-primary/20", children: "Today" })
    ] }) }),
    allDayEvents.length > 0 && /* @__PURE__ */ jsx("div", { className: "border-b-[0.5px] border-border/50 bg-muted/10 px-4 py-2 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-16 text-center shrink-0", children: "All day" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
        allDayEvents.slice(0, 3).map((event) => /* @__PURE__ */ jsx(DraggableEvent, { event, children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer truncate transition-all hover:shadow-md",
            style: {
              backgroundColor: `${event.color || "var(--primary)"}25`,
              color: event.color || "var(--primary)",
              borderLeft: `3px solid ${event.color || "var(--primary)"}`
            },
            onClick: (e) => {
              e.stopPropagation();
              onEventClick?.(event);
            },
            children: event.title
          }
        ) }, event.id)),
        allDayEvents.length > 3 && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-primary font-semibold px-3 py-0.5", children: [
          "+",
          allDayEvents.length - 3,
          " more"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { ref: scrollContainerRef, className: "flex-1 overflow-y-auto relative", children: /* @__PURE__ */ jsxs("div", { className: "flex relative", style: { height: hours.length * hourHeight }, children: [
      /* @__PURE__ */ jsxs("div", { className: "w-20 bg-muted/5 border-r-[0.5px] border-border/30 relative", children: [
        hours.map((hour) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "relative w-full",
            style: { height: hourHeight },
            children: hour !== 0 && /* @__PURE__ */ jsx("span", { className: "absolute w-full text-center -top-3 left-1/2 -translate-x-1/2 text-[11px] text-muted-foreground/80 font-medium tabular-nums bg-background px-1.5 py-0.5 rounded-md", children: format((/* @__PURE__ */ new Date()).setHours(hour, 0, 0, 0), timeFormat, { locale }) })
          },
          hour
        )),
        isToday(currentDate) && /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute left-0 w-full pointer-events-none z-30 flex justify-end pr-2",
            style: {
              top: `${(zonedNow.getHours() * 60 + zonedNow.getMinutes()) / 60 * hourHeight}px`
            },
            children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-white bg-primary px-2 py-1 rounded-lg shadow-md shadow-primary/30 -translate-y-1/2", children: format(zonedNow, nowFormat, { locale }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
        hours.map((hour) => {
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: "border-b-[0.5px] border-dashed border-border/20 box-border relative hover:bg-accent/5 transition-colors",
              style: { height: hourHeight },
              children: [0, 15, 30, 45].map((minute) => {
                const cellDate = new Date(currentDate);
                cellDate.setHours(hour, minute, 0, 0);
                const cellId = cellDate.toISOString();
                return /* @__PURE__ */ jsx(
                  DroppableCell,
                  {
                    id: cellId,
                    date: cellDate,
                    className: "w-full absolute left-0 right-0 z-0 transition-colors",
                    style: {
                      height: "25%",
                      top: `${minute / 60 * 100}%`
                    },
                    children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "h-full w-full bg-transparent cursor-pointer",
                        onClick: () => onTimeSlotClick?.(cellDate)
                      }
                    )
                  },
                  minute
                );
              })
            },
            hour
          );
        }),
        dayEvents.map((event) => {
          const overlappingEvents = dayEvents.filter((e) => {
            if (e.id === event.id) return false;
            const s1 = getZonedDate(event.start).getTime();
            const e1 = getZonedDate(event.end).getTime();
            const s2 = getZonedDate(e.start).getTime();
            const e2 = getZonedDate(e.end).getTime();
            return s1 < e2 && e1 > s2;
          });
          const group = [event, ...overlappingEvents].sort(
            (a, b) => getZonedDate(a.start).getTime() - getZonedDate(b.start).getTime() || (a.id > b.id ? 1 : -1)
          );
          const index = group.findIndex((e) => e.id === event.id);
          const count = group.length;
          const widthPercent = 100 / count;
          const leftPercent = index * widthPercent;
          const zonedStart = getZonedDate(event.start);
          const zonedEnd = getZonedDate(event.end);
          const startMinutes = zonedStart.getHours() * 60 + zonedStart.getMinutes();
          const durationMinutes = differenceInMinutes(zonedEnd, zonedStart);
          const top = startMinutes / 60 * hourHeight;
          const height = durationMinutes / 60 * hourHeight;
          const isShortEvent = durationMinutes < 45;
          return /* @__PURE__ */ jsx(
            DraggableEvent,
            {
              event,
              className: `absolute z-10 transition-all ${readonly ? "cursor-default" : ""}`,
              style: {
                top: `${top}px`,
                height: `${Math.max(height, 28)}px`,
                left: `calc(${leftPercent}% + 4px)`,
                width: `calc(${widthPercent}% - 8px)`,
                paddingRight: count > 1 ? "2px" : "0"
              },
              children: /* @__PURE__ */ jsx(
                ResizableEvent,
                {
                  readonly,
                  event,
                  hourHeight,
                  onResize: onEventResize,
                  className: "h-full",
                  style: { height: "100%" },
                  children: /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: cn(
                        "h-full rounded-lg border-[0.5px] shadow-sm overflow-hidden transition-all hover:shadow-lg hover:z-20 group",
                        "glass backdrop-blur-sm",
                        readonly ? "cursor-default" : "cursor-grab active:cursor-grabbing",
                        !event.color && "bg-primary/10 border-primary/20",
                        isShortEvent ? "px-2 flex items-center" : "px-3 py-2",
                        count > 1 && "border-l-4"
                      ),
                      style: {
                        backgroundColor: event.color ? `${event.color}15` : void 0,
                        borderColor: event.color ? `${event.color}30` : void 0,
                        borderLeftColor: event.color || "var(--primary)",
                        borderLeftWidth: count > 1 ? "4px" : "3px"
                      },
                      onClick: (e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      },
                      title: count > 1 ? `${event.title} (${index + 1}/${count})` : void 0,
                      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full overflow-hidden w-full", children: [
                        /* @__PURE__ */ jsx("div", { className: cn(
                          "font-semibold truncate leading-tight",
                          isShortEvent ? "text-xs" : "text-sm",
                          event.color ? "text-foreground" : "text-foreground/90"
                        ), children: event.title }),
                        !isShortEvent && /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mt-0.5 font-medium", children: [
                            format(zonedStart, eventTimeFormat, { locale }),
                            " - ",
                            format(zonedEnd, eventTimeFormat, { locale })
                          ] }),
                          event.description && height > 60 && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground/80 mt-1 line-clamp-2", children: event.description })
                        ] }),
                        count > 1 && !isShortEvent && /* @__PURE__ */ jsx("div", { className: "absolute top-1.5 right-1.5 bg-background/90 backdrop-blur-sm rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border shadow-sm", children: count })
                      ] })
                    }
                  )
                }
              )
            },
            `${event.id}-${currentDate.toISOString()}`
          );
        }),
        isToday(currentDate) && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "absolute left-0 right-0 z-20 pointer-events-none flex items-center",
            style: {
              top: `${(zonedNow.getHours() * 60 + zonedNow.getMinutes()) / 60 * hourHeight}px`
            },
            children: [
              /* @__PURE__ */ jsx("div", { className: "h-[2px] w-full bg-gradient-to-r from-primary via-primary to-primary/50" }),
              /* @__PURE__ */ jsx("div", { className: "absolute -left-1.5 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/40 ring-2 ring-background animate-pulse" })
            ]
          }
        )
      ] })
    ] }) })
  ] });
};
var AgendaEmptyState = ({ onCreateEvent, translations }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full min-h-[400px] py-12", children: [
  /* @__PURE__ */ jsx("div", { className: "relative mb-8", children: /* @__PURE__ */ jsx("div", { className: "p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-3xl border border-border/30", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-green-600 dark:text-green-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
      /* @__PURE__ */ jsx("div", { className: "font-medium text-foreground", children: "All caught up!" }),
      /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "No events scheduled" })
    ] })
  ] }) }) }),
  /* @__PURE__ */ jsxs("div", { className: "text-center max-w-sm", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground mb-2", children: translations?.noUpcoming || "Your schedule is clear" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "No upcoming events to show. Create a new event to start planning." }),
    onCreateEvent && /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: onCreateEvent,
        className: "inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200",
        children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
          translations?.createEvent || "Create Event"
        ]
      }
    )
  ] })
] });
var formatDuration = (start, end) => {
  const minutes = differenceInMinutes(end, start);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};
var getDateLabel = (date) => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEEE");
};
var AgendaView = ({
  currentDate,
  events,
  onEventClick,
  onCreateEvent
}) => {
  const groupedEvents = useMemo(() => {
    const startDate = startOfDay(currentDate);
    const groups = [];
    const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
    for (let i = 0; i < 30; i++) {
      const day = addDays(startDate, i);
      const dayEvents = sortedEvents.filter((event) => isSameDay(event.start, day));
      if (dayEvents.length > 0) {
        groups.push({ date: day, events: dayEvents });
      }
    }
    return groups;
  }, [currentDate, events]);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col h-full bg-background overflow-y-auto", children: groupedEvents.length === 0 ? /* @__PURE__ */ jsx(AgendaEmptyState, { onCreateEvent }) : /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "max-w-3xl mx-auto w-full pb-10 px-4 md:px-6",
      variants: container,
      initial: "hidden",
      animate: "show",
      children: groupedEvents.map((group, groupIndex) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "relative",
          variants: item,
          children: [
            /* @__PURE__ */ jsx("div", { className: "sticky top-0 bg-background/95 backdrop-blur-md py-4 z-10 border-b border-border/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: cn(
                "flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all",
                isToday(group.date) ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-muted/50 text-foreground"
              ), children: [
                /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold leading-none", children: format(group.date, "d") }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium uppercase tracking-wide opacity-80", children: format(group.date, "MMM") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx("span", { className: cn(
                  "text-lg font-semibold",
                  isToday(group.date) && "text-primary"
                ), children: getDateLabel(group.date) }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
                  group.events.length,
                  " event",
                  group.events.length !== 1 ? "s" : ""
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "py-4 space-y-3", children: group.events.map((event, eventIndex) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                onClick: () => onEventClick?.(event),
                className: cn(
                  "group relative flex gap-4 p-4 rounded-2xl border border-border/40",
                  "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
                  "transition-all duration-200 cursor-pointer",
                  "bg-gradient-to-br from-card via-card to-card/80"
                ),
                whileHover: { scale: 1.01, y: -2 },
                transition: { duration: 0.2 },
                children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "absolute left-0 top-3 bottom-3 w-1 rounded-full",
                      style: { backgroundColor: event.color || "var(--primary)" }
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center min-w-[70px] pl-2", children: event.allDay ? /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-muted-foreground bg-muted/80 px-2.5 py-1 rounded-full", children: "All Day" }) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-base font-semibold text-foreground", children: format(event.start, "h:mm") }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground uppercase", children: format(event.start, "a") }),
                    /* @__PURE__ */ jsx("div", { className: "w-px h-3 bg-border my-1" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground/70 font-medium", children: formatDuration(event.start, event.end) })
                  ] }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1", children: event.title }),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "w-3 h-3 rounded-full shrink-0 mt-1.5",
                          style: { backgroundColor: event.color || "var(--primary)" }
                        }
                      )
                    ] }),
                    event.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground line-clamp-2 leading-relaxed", children: event.description }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 pt-1", children: [
                      !event.allDay && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                        /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
                        /* @__PURE__ */ jsxs("span", { children: [
                          format(event.start, "h:mm a"),
                          " - ",
                          format(event.end, "h:mm a")
                        ] })
                      ] }),
                      event.guests && event.guests.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                        /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5" }),
                        /* @__PURE__ */ jsxs("span", { children: [
                          event.guests.length,
                          " guest",
                          event.guests.length !== 1 ? "s" : ""
                        ] })
                      ] }),
                      event.attachments && event.attachments.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                        /* @__PURE__ */ jsx(Paperclip, { className: "w-3.5 h-3.5" }),
                        /* @__PURE__ */ jsx("span", { children: event.attachments.length })
                      ] }),
                      event.reminders && event.reminders.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                        /* @__PURE__ */ jsx(Bell, { className: "w-3.5 h-3.5" }),
                        /* @__PURE__ */ jsx("span", { children: event.reminders.length })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-muted-foreground", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M9 18l6-6-6-6" }) }) })
                ]
              },
              event.id
            )) })
          ]
        },
        group.date.toISOString()
      ))
    }
  ) });
};
var ResourceView = ({
  currentDate,
  events,
  resources,
  onEventClick,
  onTimeSlotClick,
  locale
}) => {
  const containerRef = useRef(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourWidth = 100;
  const timeFormat = locale?.code === "fr" ? "H:mm" : "h a";
  const getEventStyle = (event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const dayStart = startOfDay(currentDate);
    const startMinutes = differenceInMinutes(start, dayStart);
    const durationMinutes = differenceInMinutes(end, start);
    const left = startMinutes / 60 * hourWidth;
    const width = durationMinutes / 60 * hourWidth;
    return {
      left: `${left}px`,
      width: `${Math.max(width, 4)}px`
      // Min width for visibility
    };
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full bg-background overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex border-b border-border bg-muted/20", children: [
      /* @__PURE__ */ jsx("div", { className: "w-48 shrink-0 border-r border-border p-4 font-semibold text-sm bg-background sticky left-0 z-20", children: "Resources" }),
      /* @__PURE__ */ jsx("div", { className: "flex overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "flex relative", style: { width: hours.length * hourWidth }, children: hours.map((hour) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "border-r border-border/50 text-xs text-muted-foreground p-2 font-medium shrink-0",
          style: { width: hourWidth },
          children: format((/* @__PURE__ */ new Date()).setHours(hour, 0, 0, 0), timeFormat, { locale })
        },
        hour
      )) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto relative", ref: containerRef, children: /* @__PURE__ */ jsx("div", { className: "min-w-fit", children: resources.map((resource) => {
      const resourceEvents = events.filter(
        (e) => e.resourceId === resource.id && isSameDay(new Date(e.start), currentDate)
      );
      return /* @__PURE__ */ jsxs("div", { className: "flex border-b border-border min-h-[100px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-48 shrink-0 border-r border-border p-4 bg-background sticky left-0 z-10 flex items-center gap-3", children: [
          resource.avatar ? /* @__PURE__ */ jsx("img", { src: resource.avatar, alt: resource.label, className: "w-8 h-8 rounded-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary", children: resource.label.substring(0, 2).toUpperCase() }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: resource.label }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "ID: ",
              resource.id
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex", style: { width: hours.length * hourWidth }, children: [
          hours.map((hour) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex h-full shrink-0",
              style: { width: hourWidth },
              children: [0, 15, 30, 45].map((minute) => {
                const slotDate = new Date(currentDate);
                slotDate.setHours(hour, minute, 0, 0);
                const slotId = `${resource.id}-${slotDate.toISOString()}`;
                return /* @__PURE__ */ jsx(
                  DroppableCell,
                  {
                    id: slotId,
                    date: slotDate,
                    resourceId: resource.id,
                    className: "h-full flex-1 border-r border-border/10 last:border-border/30 hover:bg-accent/10 transition-colors",
                    onClick: () => {
                      onTimeSlotClick?.(slotDate, resource.id);
                    }
                  },
                  minute
                );
              })
            },
            hour
          )),
          resourceEvents.map((event) => /* @__PURE__ */ jsx(
            DraggableEvent,
            {
              event,
              onClick: (e) => {
                e.stopPropagation();
                onEventClick?.(event);
              },
              className: "absolute top-2 bottom-2 rounded-md px-2 py-1 text-xs font-medium border shadow-sm cursor-pointer overflow-hidden hover:brightness-95 transition-all z-10",
              style: {
                ...getEventStyle(event),
                backgroundColor: event.color || resource.color || "var(--primary)",
                borderColor: "rgba(0,0,0,0.1)",
                color: "#fff"
              },
              children: /* @__PURE__ */ jsx("div", { className: "truncate", children: event.title })
            },
            event.id
          ))
        ] })
      ] }, resource.id);
    }) }) })
  ] });
};
var Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  hideHeader = false
}) => {
  const overlayRef = useRef(null);
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: overlayRef,
        className: "absolute inset-0",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "relative bg-background rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[70vh] sm:max-h-[80vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-border/50",
          className
        ),
        children: [
          !hideHeader && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border/50 shrink-0 bg-gradient-to-r from-muted/20 to-background", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: title }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: onClose,
                className: "h-9 w-9 p-0 rounded-xl hover:bg-accent/80 transition-all duration-200",
                children: [
                  /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: cn("overflow-y-auto flex-1", !hideHeader && "p-6"), children })
        ]
      }
    )
  ] });
};
var REMINDER_OPTIONS = [
  { value: 0, label: "At time of event" },
  { value: 5, label: "5 minutes before" },
  { value: 10, label: "10 minutes before" },
  { value: 15, label: "15 minutes before" },
  { value: 30, label: "30 minutes before" },
  { value: 60, label: "1 hour before" },
  { value: 120, label: "2 hours before" },
  { value: 1440, label: "1 day before" },
  { value: 2880, label: "2 days before" },
  { value: 10080, label: "1 week before" }
];
var COLOR_PALETTE = [
  "#3b82f6",
  // Blue
  "#ef4444",
  // Red
  "#10b981",
  // Emerald
  "#f59e0b",
  // Amber
  "#8b5cf6",
  // Violet
  "#ec4899",
  // Pink
  "#06b6d4",
  // Cyan
  "#84cc16",
  // Lime
  "#f97316",
  // Orange
  "#6366f1"
  // Indigo
];
var EventModal = ({
  isOpen,
  onClose,
  event,
  initialDate,
  onSave,
  onDelete,
  calendars,
  eventTypes,
  translations
}) => {
  const [mode, setMode] = useState("create");
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    start: /* @__PURE__ */ new Date(),
    end: /* @__PURE__ */ new Date(),
    allDay: false,
    color: "#3b82f6",
    calendarId: calendars?.[0]?.id,
    type: void 0,
    recurrence: void 0,
    attachments: [],
    reminders: [{ id: "1", type: "notification", time: 30, label: "30 minutes before" }]
  });
  const [isCalendarDropdownOpen, setIsCalendarDropdownOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isReminderDropdownOpen, setIsReminderDropdownOpen] = useState(false);
  const [isGuestsDropdownOpen, setIsGuestsDropdownOpen] = useState(false);
  const fakeGuests = [
    "alice@example.com",
    "bob@example.com",
    "charlie@example.com",
    "diana@example.com",
    "evan@example.com"
  ];
  useRef(null);
  const [selectedGuests, setSelectedGuests] = useState([]);
  useEffect(() => {
    if (isOpen) {
      if (event) {
        setMode("view");
        setFormData({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          attachments: event.attachments || [],
          reminders: event.reminders || [{ id: "1", type: "notification", time: 30, label: "30 minutes before" }]
        });
        setSelectedGuests(event.guests || []);
      } else {
        setMode("create");
        const start = initialDate || /* @__PURE__ */ new Date();
        const end = new Date(start);
        end.setHours(start.getHours() + 1);
        setFormData({
          title: "",
          description: "",
          location: "",
          start,
          end,
          allDay: false,
          color: "#3b82f6",
          calendarId: calendars?.[0]?.id,
          attachments: [],
          reminders: [{ id: "1", type: "notification", time: 30, label: "30 minutes before" }]
        });
        setSelectedGuests([]);
        setActiveTab("details");
      }
    }
  }, [isOpen, event, initialDate, calendars]);
  const toggleGuest = (email) => {
    setSelectedGuests((prev) => {
      const newGuests = prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email];
      setFormData((curr) => ({ ...curr, guests: newGuests }));
      return newGuests;
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let eventColor = formData.color;
    if (formData.calendarId && calendars) {
      const selectedCal = calendars.find((c) => c.id === formData.calendarId);
      if (selectedCal?.color) {
        eventColor = selectedCal.color;
      }
    }
    onSave({
      ...formData,
      color: eventColor,
      id: event?.id
    });
    onClose();
  };
  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };
  const formatDateForInput = (date) => {
    if (!date) return "";
    if (formData.allDay) return format(date, "yyyy-MM-dd");
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };
  const handleDateChange = (field, value) => {
    let date;
    if (formData.allDay) {
      const [y, m, d] = value.split("-").map(Number);
      date = new Date(y, m - 1, d);
    } else {
      date = new Date(value);
    }
    if (isNaN(date.getTime())) return;
    if (field === "start") {
      if (formData.allDay) {
        const daySpan = differenceInCalendarDays(formData.end, formData.start);
        const newEnd = new Date(date);
        newEnd.setDate(newEnd.getDate() + Math.max(0, daySpan));
        setFormData((prev) => ({ ...prev, start: date, end: newEnd }));
      } else {
        const duration = formData.end.getTime() - formData.start.getTime();
        setFormData((prev) => ({
          ...prev,
          start: date,
          end: new Date(date.getTime() + duration)
        }));
      }
    } else {
      if (date < formData.start) {
        setFormData((prev) => ({ ...prev, start: date, end: date }));
      } else {
        setFormData((prev) => ({ ...prev, end: date }));
      }
    }
  };
  const addReminder = (minutes, label) => {
    const newReminder = {
      id: Math.random().toString(36).substr(2, 9),
      type: "notification",
      time: minutes,
      label
    };
    setFormData((prev) => ({
      ...prev,
      reminders: [...prev.reminders || [], newReminder]
    }));
    setIsReminderDropdownOpen(false);
  };
  const removeReminder = (id) => {
    setFormData((prev) => ({
      ...prev,
      reminders: prev.reminders?.filter((r) => r.id !== id)
    }));
  };
  const handleAllDayToggle = (checked) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        allDay: true,
        start: startOfDay(prev.start),
        end: startOfDay(prev.end || prev.start)
      }));
    } else {
      const start = new Date(formData.start);
      start.setHours(9, 0, 0, 0);
      const end = new Date(start);
      end.setHours(10, 0, 0, 0);
      setFormData((prev) => ({
        ...prev,
        allDay: false,
        start,
        end
      }));
    }
  };
  const handleDownload = (attachment) => {
    const element = document.createElement("a");
    const file = new Blob(["Dummy content for " + attachment.name], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = attachment.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const getDurationText = () => {
    if (!formData.start || !formData.end) return "";
    if (formData.allDay) {
      const days = differenceInCalendarDays(formData.end, formData.start) + 1;
      return days === 1 ? "1 day" : `${days} days`;
    }
    const mins = differenceInMinutes(formData.end, formData.start);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (remainingMins === 0) return `${hours} hr`;
    return `${hours} hr ${remainingMins} min`;
  };
  const renderViewMode = () => /* @__PURE__ */ jsxs("div", { className: "flex flex-col bg-background overflow-hidden w-full max-h-[90vh]", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative px-6 pt-6 pb-8",
        style: {
          background: `linear-gradient(135deg, ${event?.color || "#3b82f6"}15 0%, transparent 100%)`
        },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-3 h-3 rounded-full",
                  style: { backgroundColor: event?.color || "#3b82f6" }
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: calendars?.find((c) => c.id === event?.calendarId)?.label || "Event" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setMode("edit"),
                  className: "p-2 hover:bg-background/80 rounded-lg transition-all text-muted-foreground hover:text-foreground",
                  title: "Edit",
                  children: /* @__PURE__ */ jsx(Edit2, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleDelete,
                  className: "p-2 hover:bg-destructive/10 rounded-lg transition-all text-muted-foreground hover:text-destructive",
                  title: "Delete",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  className: "p-2 hover:bg-background/80 rounded-lg transition-all text-muted-foreground hover:text-foreground",
                  title: "Close",
                  children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground mb-3 leading-tight", children: event?.title || "(No title)" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-background/60 backdrop-blur-sm rounded-lg border border-border/30", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: event?.allDay && event?.start && event?.end && differenceInCalendarDays(new Date(event.end), new Date(event.start)) > 0 ? `${format(new Date(event.start), "MMM d")} \u2013 ${format(new Date(event.end), "MMM d, yyyy")}` : event?.start && format(new Date(event.start), "EEE, MMM d") })
            ] }),
            event?.allDay ? /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-primary/10 backdrop-blur-sm rounded-lg border border-primary/20", children: /* @__PURE__ */ jsx("span", { className: "font-medium text-primary", children: translations.allDay || "All Day" }) }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-background/60 backdrop-blur-sm rounded-lg border border-border/30", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                event?.start && format(new Date(event.start), "h:mm a"),
                " \u2013 ",
                event?.end && format(new Date(event.end), "h:mm a")
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "px-6 pb-6 space-y-4 overflow-y-auto flex-1", children: [
      event?.location && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          className: "flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border/30 group hover:bg-muted/50 transition-all cursor-pointer",
          children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-primary/10 rounded-xl", children: /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: event.location }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Click to open in maps" })
            ] }),
            /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" })
          ]
        }
      ),
      event?.guests && event.guests.length > 0 && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.05 },
          className: "space-y-3",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-foreground", children: [
                event.guests.length,
                " ",
                event.guests.length > 1 ? "Guests" : "Guest"
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: event.guests.map((email, index) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-all cursor-pointer group",
                children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white",
                      style: { backgroundColor: `hsl(${index * 60}, 70%, 50%)` },
                      children: email[0].toUpperCase()
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: email.split("@")[0] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: email })
                  ] })
                ]
              },
              index
            )) })
          ]
        }
      ),
      event?.reminders && event.reminders.length > 0 && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "flex items-center gap-3",
          children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-amber-500/10 rounded-xl", children: /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4 text-amber-500" }) }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: event.reminders.map((reminder) => /* @__PURE__ */ jsx(
              "span",
              {
                className: "text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400",
                children: reminder.label || `${reminder.time} min before`
              },
              reminder.id
            )) })
          ]
        }
      ),
      event?.description && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15 },
          className: "space-y-2",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(AlignLeft, { className: "w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Notes" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed pl-6 p-3 rounded-xl bg-muted/20 border border-border/30", children: event.description })
          ]
        }
      ),
      event?.attachments && event.attachments.length > 0 && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2 },
          className: "space-y-2",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Paperclip, { className: "w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Attachments" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid gap-2", children: event.attachments.map((att) => /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => handleDownload(att),
                className: "flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer group",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "p-2 bg-primary/10 rounded-lg", children: /* @__PURE__ */ jsx(File, { className: "w-4 h-4 text-primary" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground truncate", children: att.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: att.size })
                  ] }),
                  /* @__PURE__ */ jsx(Download, { className: "w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" })
                ]
              },
              att.id
            )) })
          ]
        }
      )
    ] })
  ] });
  const renderEditMode = () => /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col bg-background overflow-hidden w-full max-h-[85vh]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setIsColorPickerOpen(!isColorPickerOpen),
            className: "relative p-1",
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform",
                  style: {
                    backgroundColor: formData.color,
                    boxShadow: `0 0 0 2px var(--background), 0 0 0 4px ${formData.color}60`
                  }
                }
              ),
              isColorPickerOpen && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 mt-2 p-2 bg-background border border-border rounded-xl shadow-xl z-50 flex flex-wrap gap-1.5 w-[180px]", children: COLOR_PALETTE.map((color) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setFormData((prev) => ({ ...prev, color }));
                    setIsColorPickerOpen(false);
                  },
                  className: cn(
                    "w-7 h-7 rounded-full transition-all hover:scale-110",
                    formData.color === color && "ring-2 ring-offset-2 ring-offset-background ring-current"
                  ),
                  style: { backgroundColor: color, color }
                },
                color
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground", children: mode === "edit" ? "Edit Event" : "New Event" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "p-2 hover:bg-accent rounded-xl transition-all text-muted-foreground hover:text-foreground",
          children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 space-y-5", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          required: true,
          autoFocus: true,
          className: "w-full text-xl font-semibold border-0 border-b-2 border-transparent focus:border-primary bg-transparent px-0 py-2 placeholder-muted-foreground/50 transition-all text-foreground focus:outline-none",
          value: formData.title,
          onChange: (e) => setFormData({ ...formData, title: e.target.value }),
          placeholder: "Add title"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: translations.allDay || "All Day" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": formData.allDay,
            onClick: () => handleAllDayToggle(!formData.allDay),
            className: cn(
              "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer",
              formData.allDay ? "bg-primary" : "bg-muted"
            ),
            children: /* @__PURE__ */ jsx(
              "span",
              {
                className: cn(
                  "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                  formData.allDay ? "translate-x-5" : "translate-x-0"
                )
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 rounded-2xl bg-muted/20 border border-border/30", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-primary/10 rounded-xl shrink-0", children: /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block", children: "Start" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: formData.allDay ? "date" : "datetime-local",
                className: "w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
                value: formatDateForInput(formData.start),
                onChange: (e) => handleDateChange("start", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block", children: "End" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: formData.allDay ? "date" : "datetime-local",
                className: "w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
                value: formatDateForInput(formData.end),
                onChange: (e) => handleDateChange("end", e.target.value)
              }
            )
          ] })
        ] })
      ] }),
      getDurationText() && /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary", children: getDurationText() }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Reminders" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setIsReminderDropdownOpen(!isReminderDropdownOpen),
                className: "flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                  "Add"
                ]
              }
            ),
            isReminderDropdownOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40", onClick: () => setIsReminderDropdownOpen(false) }),
              /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-full mt-1 w-48 bg-background border border-border rounded-xl shadow-xl z-50 py-1 max-h-60 overflow-y-auto", children: REMINDER_OPTIONS.map((option) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => addReminder(option.value, option.label),
                  className: "w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors",
                  children: option.label
                },
                option.value
              )) })
            ] })
          ] })
        ] }),
        formData.reminders && formData.reminders.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: formData.reminders.map((reminder) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20",
            children: [
              /* @__PURE__ */ jsx(BellRing, { className: "w-3.5 h-3.5 text-amber-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-amber-600 dark:text-amber-400", children: reminder.label }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removeReminder(reminder.id),
                  className: "p-0.5 hover:bg-amber-500/20 rounded-full transition-colors",
                  children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3 text-amber-500" })
                }
              )
            ]
          },
          reminder.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Guests" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setIsGuestsDropdownOpen(!isGuestsDropdownOpen),
              className: "w-full flex items-center justify-between px-4 py-3 bg-muted/20 border border-border/30 rounded-xl text-sm text-left hover:bg-muted/30 transition-all",
              children: [
                /* @__PURE__ */ jsx("span", { className: selectedGuests.length > 0 ? "text-foreground font-medium" : "text-muted-foreground", children: selectedGuests.length > 0 ? `${selectedGuests.length} guest${selectedGuests.length > 1 ? "s" : ""} added` : "Add guests" }),
                /* @__PURE__ */ jsx(ChevronDown, { className: cn("w-4 h-4 text-muted-foreground transition-transform", isGuestsDropdownOpen && "rotate-180") })
              ]
            }
          ),
          isGuestsDropdownOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40", onClick: () => setIsGuestsDropdownOpen(false) }),
            /* @__PURE__ */ jsx("div", { className: "absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-xl max-h-48 overflow-y-auto", children: fakeGuests.map((email) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "px-4 py-3 hover:bg-accent cursor-pointer flex items-center gap-3 transition-colors",
                onClick: () => toggleGuest(email),
                children: [
                  /* @__PURE__ */ jsx("div", { className: cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                    selectedGuests.includes(email) ? "bg-primary border-primary" : "border-border"
                  ), children: selectedGuests.includes(email) && /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-primary-foreground" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white",
                        style: { backgroundColor: `hsl(${fakeGuests.indexOf(email) * 60}, 70%, 50%)` },
                        children: email[0].toUpperCase()
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-sm", children: email })
                  ] })
                ]
              },
              email
            )) })
          ] })
        ] }),
        selectedGuests.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: selectedGuests.map((email) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-2 pl-1 pr-2 py-1 bg-muted/30 border border-border/30 rounded-full",
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white",
                  style: { backgroundColor: `hsl(${fakeGuests.indexOf(email) * 60}, 70%, 50%)` },
                  children: email[0].toUpperCase()
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-foreground", children: email.split("@")[0] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => toggleGuest(email),
                  className: "p-0.5 hover:bg-destructive/10 rounded-full transition-colors",
                  children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3 text-muted-foreground" })
                }
              )
            ]
          },
          email
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-muted-foreground shrink-0" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none",
            placeholder: "Add location",
            value: formData.location || "",
            onChange: (e) => setFormData({ ...formData, location: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(AlignLeft, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Notes" })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            className: "w-full bg-muted/20 border border-border/30 rounded-xl px-4 py-3 text-sm min-h-[100px] resize-none text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
            placeholder: "Add description or notes...",
            value: formData.description || "",
            onChange: (e) => setFormData({ ...formData, description: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30", children: [
        /* @__PURE__ */ jsx(Repeat, { className: "w-5 h-5 text-muted-foreground shrink-0" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "flex-1 bg-transparent text-sm text-foreground focus:outline-none cursor-pointer",
            value: formData.recurrence?.freq || "",
            onChange: (e) => {
              if (e.target.value === "") {
                setFormData({ ...formData, recurrence: void 0 });
              } else {
                setFormData({
                  ...formData,
                  recurrence: {
                    freq: e.target.value,
                    interval: 1
                  }
                });
              }
            },
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Does not repeat" }),
              /* @__PURE__ */ jsx("option", { value: "DAILY", children: "Daily" }),
              /* @__PURE__ */ jsx("option", { value: "WEEKLY", children: "Weekly" }),
              /* @__PURE__ */ jsx("option", { value: "MONTHLY", children: "Monthly" }),
              /* @__PURE__ */ jsx("option", { value: "YEARLY", children: "Yearly" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Tag, { className: "w-5 h-5 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground", children: "Calendar" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setIsCalendarDropdownOpen(!isCalendarDropdownOpen),
              className: "flex items-center gap-2 px-3 py-1.5 bg-background border border-border/50 rounded-lg text-sm hover:bg-accent/50 transition-all",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full",
                    style: { backgroundColor: calendars?.find((c) => c.id === formData.calendarId)?.color || "#3b82f6" }
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: calendars?.find((c) => c.id === formData.calendarId)?.label || "Select" }),
                /* @__PURE__ */ jsx(ChevronDown, { className: "w-3.5 h-3.5 text-muted-foreground" })
              ]
            }
          ),
          isCalendarDropdownOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40", onClick: () => setIsCalendarDropdownOpen(false) }),
            /* @__PURE__ */ jsx("div", { className: "absolute right-0 bottom-full mb-2 w-48 bg-background border border-border rounded-xl shadow-xl z-50 py-1", children: calendars?.map((cal) => /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "w-full flex items-center gap-3 px-3 py-2 hover:bg-accent transition-colors text-left",
                onClick: () => {
                  setFormData({
                    ...formData,
                    calendarId: cal.id,
                    color: cal.color || formData.color
                  });
                  setIsCalendarDropdownOpen(false);
                },
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: cal.color } }),
                  /* @__PURE__ */ jsx("span", { className: "flex-1 text-sm", children: cal.label }),
                  formData.calendarId === cal.id && /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-primary" })
                ]
              },
              cal.id
            )) })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-t border-border/50 flex items-center justify-between bg-muted/10 shrink-0", children: [
      mode === "edit" && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: handleDelete,
          className: "flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-xl transition-all text-sm font-medium",
          children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
            "Delete"
          ]
        }
      ),
      mode === "create" && /* @__PURE__ */ jsx("div", {}),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-4 py-2.5 text-muted-foreground hover:text-foreground font-medium text-sm rounded-xl transition-all hover:bg-accent",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-xl shadow-md transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95",
            children: mode === "edit" ? "Save Changes" : "Create Event"
          }
        )
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsx(Modal, { isOpen, onClose, hideHeader: true, className: "p-0 overflow-hidden max-w-lg rounded-2xl shadow-2xl", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: mode === "view" && event ? /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.15 },
      children: renderViewMode()
    },
    "view"
  ) : /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.15 },
      children: renderEditMode()
    },
    "edit"
  ) }) });
};
var Skeleton = ({ className, style }) => /* @__PURE__ */ jsx("div", { className: cn("animate-pulse bg-muted/40 rounded", className), style });
var MonthViewSkeleton = () => /* @__PURE__ */ jsxs("div", { className: "h-full bg-background border border-border/50 rounded-2xl overflow-hidden", children: [
  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 border-b border-border/50 bg-muted/10", children: Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "py-3 px-2 text-center border-r border-border/30 last:border-r-0", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-8 mx-auto" }) }, i)) }),
  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 flex-1", children: Array.from({ length: 35 }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "min-h-[120px] border-r border-b border-border/30 p-2", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-6 mb-2" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      Math.random() > 0.5 && /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-full rounded-md" }),
      Math.random() > 0.7 && /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-3/4 rounded-md" })
    ] })
  ] }, i)) })
] });
var WeekViewSkeleton = () => /* @__PURE__ */ jsxs("div", { className: "h-full bg-background border border-border/50 rounded-2xl overflow-hidden", children: [
  /* @__PURE__ */ jsxs("div", { className: "flex border-b border-border/50 bg-muted/10", children: [
    /* @__PURE__ */ jsx("div", { className: "w-16 p-3 border-r border-border/30", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-10 mx-auto" }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 grid grid-cols-7", children: Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "py-3 px-2 text-center border-r border-border/30 last:border-r-0", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-8 mx-auto mb-1" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-8 mx-auto rounded-xl" })
    ] }, i)) })
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "flex flex-1", style: { height: "600px" }, children: [
    /* @__PURE__ */ jsx("div", { className: "w-16 border-r border-border/30", children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-[60px] relative", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-10 absolute right-2 -translate-y-1/2" }) }, i)) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 grid grid-cols-7 relative", children: Array.from({ length: 7 }).map((_, colIdx) => /* @__PURE__ */ jsxs("div", { className: "relative border-r border-border/30 last:border-r-0", children: [
      Array.from({ length: 10 }).map((_2, rowIdx) => /* @__PURE__ */ jsx("div", { className: "h-[60px] border-b border-dashed border-border/20" }, rowIdx)),
      Math.random() > 0.3 && /* @__PURE__ */ jsx(
        Skeleton,
        {
          className: "absolute rounded-md",
          style: {
            top: `${Math.floor(Math.random() * 400)}px`,
            left: "4px",
            right: "4px",
            height: `${60 + Math.floor(Math.random() * 120)}px`
          }
        }
      )
    ] }, colIdx)) })
  ] })
] });
var DayViewSkeleton = () => /* @__PURE__ */ jsxs("div", { className: "h-full bg-background border border-border/50 rounded-2xl overflow-hidden", children: [
  /* @__PURE__ */ jsx("div", { className: "px-6 py-4 border-b border-border/50 bg-muted/10 text-center", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-7 w-64 mx-auto" }) }),
  /* @__PURE__ */ jsxs("div", { className: "flex flex-1", style: { height: "600px" }, children: [
    /* @__PURE__ */ jsx("div", { className: "w-20 border-r border-border/30 bg-muted/5", children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-[80px] relative", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-12 absolute left-1/2 -translate-x-1/2 -translate-y-1/2" }) }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
      Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-[80px] border-b border-dashed border-border/20" }, i)),
      /* @__PURE__ */ jsx(
        Skeleton,
        {
          className: "absolute rounded-lg left-4 right-4",
          style: { top: "160px", height: "120px" }
        }
      ),
      /* @__PURE__ */ jsx(
        Skeleton,
        {
          className: "absolute rounded-lg left-4 right-4",
          style: { top: "400px", height: "80px" }
        }
      )
    ] })
  ] })
] });
var AgendaViewSkeleton = () => /* @__PURE__ */ jsx("div", { className: "h-full bg-background border border-border/50 rounded-2xl overflow-hidden p-6", children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: Array.from({ length: 4 }).map((_, dayIdx) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-40 mb-4" }),
  /* @__PURE__ */ jsx("div", { className: "space-y-3", children: Array.from({ length: 2 + Math.floor(Math.random() * 3) }).map((_2, eventIdx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-3 rounded-xl bg-muted/10", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-10 rounded-lg" }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-3/4" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-1/2" })
    ] })
  ] }, eventIdx)) })
] }, dayIdx)) }) });
var EventContextMenu = ({
  event,
  position,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  customActions = [],
  translations
}) => {
  const menuRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (position) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [position, onClose]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (position) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [position, onClose]);
  if (!event || !position) return null;
  const actions = [
    ...onEdit ? [{
      id: "edit",
      label: translations?.edit || "Edit",
      icon: /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" }),
      onClick: () => {
        onEdit(event);
        onClose();
      }
    }] : [],
    ...onDuplicate ? [{
      id: "duplicate",
      label: translations?.duplicate || "Duplicate",
      icon: /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" }),
      onClick: () => {
        onDuplicate(event);
        onClose();
      }
    }] : [],
    ...customActions,
    ...onDelete ? [{
      id: "delete",
      label: translations?.delete || "Delete",
      icon: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
      onClick: () => {
        onDelete(event.id);
        onClose();
      },
      variant: "danger"
    }] : []
  ];
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 200),
    y: Math.min(position.y, window.innerHeight - (actions.length * 44 + 80))
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      ref: menuRef,
      initial: { opacity: 0, scale: 0.95, y: -5 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: -5 },
      transition: { duration: 0.15, ease: "easeOut" },
      className: "fixed z-[100] min-w-[180px] bg-background border-[0.5px] border-border rounded-xl shadow-xl overflow-hidden",
      style: {
        left: adjustedPosition.x,
        top: adjustedPosition.y
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "px-3 py-2 border-b-[0.5px] border-border bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-2.5 h-2.5 rounded-full shrink-0",
              style: { backgroundColor: event.color || "var(--primary)" }
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium truncate text-foreground", children: event.title })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "py-1", children: actions.map((action, index) => /* @__PURE__ */ jsxs(React6__default.Fragment, { children: [
          index > 0 && action.variant === "danger" && /* @__PURE__ */ jsx("div", { className: "h-px bg-border my-1" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: action.onClick,
              disabled: action.disabled,
              className: cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                action.disabled && "opacity-50 cursor-not-allowed",
                action.variant === "danger" ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20" : "text-foreground hover:bg-accent"
              ),
              children: [
                action.icon,
                /* @__PURE__ */ jsx("span", { children: action.label })
              ]
            }
          )
        ] }, action.id)) })
      ]
    }
  ) });
};
var useEventContextMenu = () => {
  const [contextMenu, setContextMenu] = useState({ event: null, position: null });
  const openContextMenu = useCallback((event, e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      event,
      position: { x: e.clientX, y: e.clientY }
    });
  }, []);
  const closeContextMenu = useCallback(() => {
    setContextMenu({ event: null, position: null });
  }, []);
  return {
    contextMenuEvent: contextMenu.event,
    contextMenuPosition: contextMenu.position,
    openContextMenu,
    closeContextMenu
  };
};

// src/lib/theme.ts
function colorToHsl(color) {
  let r = 0, g = 0, b = 0;
  if (color.startsWith("#") || /^[0-9a-fA-F]{3,6}$/.test(color)) {
    let c = color.replace(/^#/, "");
    if (c.length === 3) {
      c = c.split("").map((char) => char + char).join("");
    }
    if (c.length !== 6) return null;
    r = parseInt(c.substring(0, 2), 16) / 255;
    g = parseInt(c.substring(2, 4), 16) / 255;
    b = parseInt(c.substring(4, 6), 16) / 255;
  } else if (color.startsWith("rgb")) {
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) return null;
    r = parseInt(match[0]) / 255;
    g = parseInt(match[1]) / 255;
    b = parseInt(match[2]) / 255;
  } else {
    return null;
  }
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);
  return `${hDeg} ${sPct}% ${lPct}%`;
}
function getThemeStyles(theme) {
  if (!theme) return {};
  const styles = {};
  if (theme.colors) {
    const mappings = {
      "--background": "background",
      "--foreground": "foreground",
      "--primary": "primary",
      "--secondary": "secondary",
      "--muted": "muted",
      "--accent": "accent",
      "--border": "border"
    };
    Object.entries(mappings).forEach(([cssVar, themeKey]) => {
      const colorValue = theme.colors?.[themeKey];
      if (colorValue) {
        const hsl = colorToHsl(colorValue);
        if (hsl) {
          styles[cssVar] = hsl;
        }
      }
    });
  }
  if (theme.borderRadius) {
    styles["--radius"] = theme.borderRadius;
  }
  if (theme.fontFamily) {
    styles["fontFamily"] = theme.fontFamily;
  }
  return styles;
}
var useCalendarLogic = ({
  events,
  view: controlledView,
  onViewChange: controlledOnViewChange,
  date: controlledDate,
  onDateChange: controlledOnDateChange,
  onEventClick,
  onEventUpdate,
  onEventCreate,
  onEventDelete,
  readOnly,
  timezone
}) => {
  const [internalView, setInternalView] = useState("week");
  const [internalDate, setInternalDate] = useState(/* @__PURE__ */ new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalInitialDate, setModalInitialDate] = useState(void 0);
  const view = controlledView ?? internalView;
  const currentDate = controlledDate ?? internalDate;
  const expandedEvents = useMemo(() => {
    const allEvents = [];
    const rangeStart = subDays(currentDate, 365);
    const rangeEnd = addDays(currentDate, 365);
    events.forEach((event) => {
      if (event.recurrence) {
        try {
          const rule = new RRule({
            freq: RRule[event.recurrence.freq],
            interval: event.recurrence.interval || 1,
            dtstart: new Date(event.start),
            until: event.recurrence.until ? new Date(event.recurrence.until) : void 0,
            count: event.recurrence.count
          });
          const dates = rule.between(rangeStart, rangeEnd);
          dates.forEach((date) => {
            const duration = differenceInMilliseconds(new Date(event.end), new Date(event.start));
            allEvents.push({
              ...event,
              id: `${event.id}-${date.getTime()}`,
              // Unique ID for each instance
              originalEventId: event.id,
              // Reference to original
              start: date,
              end: new Date(date.getTime() + duration)
            });
          });
        } catch (e) {
          console.error("Error parsing recurrence rule", e);
          allEvents.push(event);
        }
      } else {
        allEvents.push(event);
      }
    });
    return allEvents;
  }, [events, currentDate]);
  const handleViewChange = (newView) => {
    if (controlledOnViewChange) {
      controlledOnViewChange(newView);
    } else {
      setInternalView(newView);
    }
  };
  const handleDateChange = (newDate) => {
    if (controlledOnDateChange) {
      controlledOnDateChange(newDate);
    } else {
      setInternalDate(newDate);
    }
  };
  const handlePrev = () => {
    switch (view) {
      case "month":
        handleDateChange(subMonths(currentDate, 1));
        break;
      case "week":
        handleDateChange(subWeeks(currentDate, 1));
        break;
      case "day":
      case "resource":
        handleDateChange(subDays(currentDate, 1));
        break;
      case "agenda":
        handleDateChange(subDays(currentDate, 7));
        break;
    }
  };
  const handleNext = () => {
    switch (view) {
      case "month":
        handleDateChange(addMonths(currentDate, 1));
        break;
      case "week":
        handleDateChange(addWeeks(currentDate, 1));
        break;
      case "day":
      case "resource":
        handleDateChange(addDays(currentDate, 1));
        break;
      case "agenda":
        handleDateChange(addDays(currentDate, 7));
        break;
    }
  };
  const handleToday = () => {
    handleDateChange(/* @__PURE__ */ new Date());
  };
  const handleDateClick = (date) => {
    handleDateChange(date);
    handleViewChange("day");
  };
  const handleTimeSlotClick = (date) => {
    if (readOnly) return;
    setSelectedEvent(null);
    setModalInitialDate(date);
    setIsModalOpen(true);
  };
  const handleEventClickInternal = (event) => {
    if (onEventClick) {
      onEventClick(event);
    }
    if (!readOnly) {
      setSelectedEvent(event);
      setModalInitialDate(void 0);
      setIsModalOpen(true);
    }
  };
  const handleCreateEvent = () => {
    if (readOnly) return;
    setSelectedEvent(null);
    setModalInitialDate(/* @__PURE__ */ new Date());
    setIsModalOpen(true);
  };
  const handleModalSave = (eventData) => {
    let effectiveEventId = selectedEvent?.id;
    if (selectedEvent?.originalEventId) {
      effectiveEventId = selectedEvent.originalEventId;
    }
    if (effectiveEventId) {
      if (onEventUpdate) {
        onEventUpdate({
          ...eventData,
          id: effectiveEventId
        });
      }
    } else {
      if (onEventCreate) {
        onEventCreate(eventData);
      }
    }
  };
  const handleModalDelete = (eventId) => {
    let effectiveEventId = eventId;
    if (selectedEvent?.originalEventId && selectedEvent.id === eventId) {
      effectiveEventId = selectedEvent.originalEventId;
    }
    if (onEventDelete) {
      onEventDelete(effectiveEventId);
    }
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeEvent = active.data.current?.event;
    const overDate = over.data.current?.date;
    if (!activeEvent || !overDate) return;
    const originalStart = new Date(activeEvent.start);
    const originalEnd = new Date(activeEvent.end);
    const duration = differenceInMilliseconds(originalEnd, originalStart);
    let newStart;
    if (activeEvent.allDay) {
      newStart = new Date(overDate);
      newStart.setHours(0, 0, 0, 0);
    } else if (view === "month") {
      if (timezone) {
        const zonedOriginal = toZonedTime(originalStart, timezone);
        const zonedNew = new Date(overDate);
        zonedNew.setHours(zonedOriginal.getHours());
        zonedNew.setMinutes(zonedOriginal.getMinutes());
        zonedNew.setSeconds(zonedOriginal.getSeconds());
        zonedNew.setMilliseconds(zonedOriginal.getMilliseconds());
        newStart = fromZonedTime(zonedNew, timezone);
      } else {
        newStart = new Date(overDate);
        newStart.setHours(originalStart.getHours());
        newStart.setMinutes(originalStart.getMinutes());
        newStart.setSeconds(originalStart.getSeconds());
        newStart.setMilliseconds(originalStart.getMilliseconds());
      }
    } else {
      if (timezone) {
        newStart = fromZonedTime(overDate, timezone);
      } else {
        newStart = new Date(overDate);
      }
      newStart.setSeconds(0);
      newStart.setMilliseconds(0);
    }
    const newEnd = new Date(newStart.getTime() + duration);
    let newResourceId = activeEvent.resourceId;
    const overResourceId = over.data.current?.resourceId;
    if (overResourceId) {
      newResourceId = overResourceId;
    }
    if (newStart.getTime() === originalStart.getTime() && newEnd.getTime() === originalEnd.getTime() && newResourceId === activeEvent.resourceId) {
      return;
    }
    if (onEventUpdate) {
      onEventUpdate({
        ...activeEvent,
        start: newStart,
        end: newEnd,
        resourceId: newResourceId
      });
    }
  };
  return {
    view,
    currentDate,
    isSidebarOpen,
    setIsSidebarOpen,
    isModalOpen,
    setIsModalOpen,
    selectedEvent,
    modalInitialDate,
    expandedEvents,
    handleViewChange,
    handleDateChange,
    handlePrev,
    handleNext,
    handleToday,
    handleDateClick,
    handleTimeSlotClick,
    handleEventClickInternal,
    handleCreateEvent,
    handleModalSave,
    handleModalDelete,
    handleDragEnd
  };
};
var useSwipeGesture = (options) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 100,
    restraint = 100,
    allowedTime = 500,
    enabled = true
  } = options;
  const touchInfoRef = useRef(null);
  const elementRef = useRef(null);
  const handleTouchStart = useCallback((e) => {
    if (!enabled) return;
    const touch = e.touches[0];
    touchInfoRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now()
    };
  }, [enabled]);
  const handleTouchEnd = useCallback((e) => {
    if (!enabled || !touchInfoRef.current) return;
    const touch = e.changedTouches[0];
    const { startX, startY, startTime } = touchInfoRef.current;
    const distX = touch.clientX - startX;
    const distY = touch.clientY - startY;
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime <= allowedTime) {
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        if (distX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
        if (distY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }
    touchInfoRef.current = null;
  }, [enabled, threshold, restraint, allowedTime, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);
  return elementRef;
};
var useViewSwipe = (onPrev, onNext, enabled = true) => {
  return useSwipeGesture({
    onSwipeLeft: onNext,
    onSwipeRight: onPrev,
    threshold: 50,
    restraint: 100,
    allowedTime: 300,
    enabled
  });
};
var Scheduler = ({
  events = [],
  view: controlledView,
  onViewChange: controlledOnViewChange,
  date: controlledDate,
  onDateChange: controlledOnDateChange,
  onEventClick,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onEventResize,
  timezone,
  onTimezoneChange,
  className,
  theme,
  renderEventForm,
  readOnly,
  calendars,
  resources,
  eventTypes,
  onCalendarToggle,
  isLoading,
  isDarkMode,
  onThemeToggle,
  translations,
  // New Prop
  hideViewSwitcher,
  language,
  onLanguageChange,
  locale
  // Date-fns locale
}) => {
  const [activeDragEvent, setActiveDragEvent] = useState(null);
  const {
    contextMenuEvent,
    contextMenuPosition,
    closeContextMenu
  } = useEventContextMenu();
  const {
    view,
    currentDate,
    isSidebarOpen,
    setIsSidebarOpen,
    isModalOpen,
    setIsModalOpen,
    selectedEvent,
    modalInitialDate,
    handleViewChange,
    handleDateChange,
    handlePrev,
    handleNext,
    handleToday,
    handleDateClick,
    handleTimeSlotClick,
    handleEventClickInternal,
    handleCreateEvent,
    handleModalSave,
    handleModalDelete,
    handleDragEnd,
    expandedEvents
    // New export
  } = useCalendarLogic({
    events,
    view: controlledView,
    onViewChange: controlledOnViewChange,
    date: controlledDate,
    onDateChange: controlledOnDateChange,
    onEventClick,
    onEventUpdate,
    onEventCreate,
    onEventDelete,
    readOnly,
    timezone
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );
  const gridSize = 15;
  const snapToGrid = createSnapModifier(gridSize);
  const modifiers = [snapToGrid, restrictToWindowEdges];
  const dndSensors = readOnly ? [] : sensors;
  const handleEventResize = useCallback((event, newEnd) => {
    if (readOnly) return;
    if (onEventResize) {
      onEventResize(event, event.start, newEnd);
    }
    if (onEventUpdate) {
      onEventUpdate({
        ...event,
        end: newEnd
      });
    }
  }, [readOnly, onEventResize, onEventUpdate]);
  const id = useId();
  const swipeRef = useViewSwipe(handlePrev, handleNext, true);
  const t = {
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
    ...translations
  };
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    const draggedEvent = active.data.current?.event;
    if (draggedEvent) {
      setActiveDragEvent(draggedEvent);
    }
  }, []);
  const onDragEndWrapper = useCallback((event) => {
    setActiveDragEvent(null);
    handleDragEnd(event);
  }, [handleDragEnd]);
  const getDragHeight = () => {
    if (!activeDragEvent) return void 0;
    if (view === "resource") {
      return 80;
    }
    if (activeDragEvent.allDay) return 28;
    if (view !== "week" && view !== "day") return void 0;
    const duration = differenceInMinutes(activeDragEvent.end, activeDragEvent.start);
    const hourHeight = view === "day" ? 80 : 60;
    return duration / 60 * hourHeight;
  };
  const getDragWidth = () => {
    if (view === "month") return "200px";
    if (activeDragEvent?.allDay) return "200px";
    if (view === "resource" && activeDragEvent) {
      const duration = differenceInMinutes(activeDragEvent.end, activeDragEvent.start);
      const width = duration / 60 * 100;
      return `${Math.max(width, 4)}px`;
    }
    return "150px";
  };
  const filteredEvents = useMemo(() => {
    if (!calendars) return expandedEvents;
    const activeCalendarIds = calendars.filter((c) => c.active !== false).map((c) => c.id);
    return expandedEvents.filter((e) => {
      if (!e.calendarId) return true;
      return activeCalendarIds.includes(e.calendarId);
    });
  }, [expandedEvents, calendars]);
  return /* @__PURE__ */ jsx(
    DndContext,
    {
      id,
      sensors: dndSensors,
      onDragStart: handleDragStart,
      onDragEnd: onDragEndWrapper,
      modifiers,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn("flex flex-col h-full bg-background text-foreground relative", className),
          style: getThemeStyles(theme),
          children: [
            /* @__PURE__ */ jsx(
              CalendarHeader,
              {
                currentDate,
                onPrev: handlePrev,
                onNext: handleNext,
                onToday: handleToday,
                view,
                onViewChange: handleViewChange,
                onMenuClick: () => setIsSidebarOpen(!isSidebarOpen),
                isDarkMode,
                onThemeToggle,
                translations: t,
                hideViewSwitcher,
                language,
                onLanguageChange,
                locale
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  className: cn(
                    "hidden md:block overflow-hidden"
                  ),
                  initial: false,
                  animate: {
                    width: isSidebarOpen ? 256 : 0,
                    opacity: isSidebarOpen ? 1 : 0
                  },
                  transition: {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  },
                  children: /* @__PURE__ */ jsx(
                    Sidebar,
                    {
                      currentDate,
                      onDateChange: handleDateChange,
                      onViewChange: handleViewChange,
                      onEventCreate: handleCreateEvent,
                      timezone,
                      onTimezoneChange,
                      className: "w-full h-full",
                      readOnly,
                      calendars,
                      onCalendarToggle,
                      translations: t
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col overflow-hidden relative", children: [
                isLoading ? /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto p-0 md:p-4", children: /* @__PURE__ */ jsxs("div", { className: "h-full min-w-full", children: [
                  view === "month" && /* @__PURE__ */ jsx(MonthViewSkeleton, {}),
                  view === "week" && /* @__PURE__ */ jsx(WeekViewSkeleton, {}),
                  view === "day" && /* @__PURE__ */ jsx(DayViewSkeleton, {}),
                  view === "agenda" && /* @__PURE__ */ jsx(AgendaViewSkeleton, {}),
                  view === "resource" && /* @__PURE__ */ jsx(WeekViewSkeleton, {})
                ] }) }) : /* @__PURE__ */ jsx("div", { ref: swipeRef, className: "flex-1 overflow-auto p-0 md:p-4 touch-pan-y", children: /* @__PURE__ */ jsx("div", { className: "h-full min-w-full", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.98, y: 15 },
                    animate: {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: {
                        duration: 0.25,
                        ease: [0.25, 0.1, 0.25, 1]
                      }
                    },
                    exit: {
                      opacity: 0,
                      scale: 0.98,
                      y: -10,
                      transition: {
                        duration: 0.15,
                        ease: [0.25, 0.1, 0.25, 1]
                      }
                    },
                    className: "h-full",
                    children: [
                      view === "month" && /* @__PURE__ */ jsx(
                        MonthView,
                        {
                          currentDate,
                          events: filteredEvents,
                          onEventClick: handleEventClickInternal,
                          onDateClick: handleDateClick,
                          timezone,
                          locale
                        }
                      ),
                      view === "week" && /* @__PURE__ */ jsx(
                        WeekView,
                        {
                          currentDate,
                          events: filteredEvents,
                          onEventClick: handleEventClickInternal,
                          onTimeSlotClick: handleTimeSlotClick,
                          onEventResize: handleEventResize,
                          timezone,
                          locale,
                          readonly: readOnly
                        }
                      ),
                      view === "day" && /* @__PURE__ */ jsx(
                        DayView,
                        {
                          currentDate,
                          events: filteredEvents,
                          onEventClick: handleEventClickInternal,
                          onTimeSlotClick: handleTimeSlotClick,
                          onEventResize: handleEventResize,
                          timezone,
                          locale,
                          readonly: readOnly
                        }
                      ),
                      view === "agenda" && /* @__PURE__ */ jsx(
                        AgendaView,
                        {
                          currentDate,
                          events: filteredEvents,
                          onEventClick: handleEventClickInternal,
                          onCreateEvent: handleCreateEvent
                        }
                      ),
                      view === "resource" && resources && /* @__PURE__ */ jsx(
                        ResourceView,
                        {
                          currentDate,
                          events: filteredEvents,
                          resources,
                          onEventClick: handleEventClickInternal,
                          onTimeSlotClick: (date, resourceId) => {
                            if (readOnly) return;
                            handleTimeSlotClick(date);
                          },
                          locale
                        }
                      )
                    ]
                  },
                  `${view}-${currentDate.toISOString()}-${timezone || "local"}`
                ) }) }) }),
                /* @__PURE__ */ jsx("div", { className: "md:hidden absolute bottom-6 right-6 z-50", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: handleCreateEvent,
                    className: "w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white active:scale-90 transition-transform",
                    children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      /* @__PURE__ */ jsx("path", { d: "M5 12h14" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 5v14" })
                    ] })
                  }
                ) })
              ] })
            ] }),
            renderEventForm ? renderEventForm({
              isOpen: isModalOpen,
              onClose: () => setIsModalOpen(false),
              event: selectedEvent,
              initialDate: modalInitialDate,
              onSave: handleModalSave,
              onDelete: handleModalDelete
            }) : /* @__PURE__ */ jsx(
              EventModal,
              {
                isOpen: isModalOpen,
                onClose: () => setIsModalOpen(false),
                event: selectedEvent,
                initialDate: modalInitialDate,
                onSave: handleModalSave,
                onDelete: handleModalDelete,
                calendars,
                eventTypes,
                translations: t
              }
            ),
            /* @__PURE__ */ jsx(
              EventContextMenu,
              {
                event: contextMenuEvent,
                position: contextMenuPosition,
                onClose: closeContextMenu,
                onEdit: (event) => {
                  handleEventClickInternal(event);
                  closeContextMenu();
                },
                onDelete: (eventId) => {
                  onEventDelete?.(eventId);
                  closeContextMenu();
                },
                onDuplicate: (event) => {
                  const duplicatedEvent = {
                    ...event,
                    id: `${event.id}-copy-${Date.now()}`,
                    title: `${event.title} (Copy)`,
                    start: new Date(event.start.getTime() + 24 * 60 * 60 * 1e3),
                    // +1 day
                    end: new Date(event.end.getTime() + 24 * 60 * 60 * 1e3)
                  };
                  onEventCreate?.(duplicatedEvent);
                  closeContextMenu();
                },
                translations: {
                  edit: t.editEvent || "Edit",
                  delete: t.delete || "Delete",
                  duplicate: "Duplicate"
                }
              }
            ),
            /* @__PURE__ */ jsx(DragOverlay, { dropAnimation: null, children: activeDragEvent ? /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "rounded-lg shadow-2xl border-2 overflow-hidden cursor-grabbing transition-transform",
                  "backdrop-blur-sm",
                  !activeDragEvent.color && "bg-primary/90 border-primary/60 text-primary-foreground"
                ),
                style: {
                  backgroundColor: activeDragEvent.color ? `${activeDragEvent.color}e0` : void 0,
                  borderColor: activeDragEvent.color ? `${activeDragEvent.color}80` : void 0,
                  color: activeDragEvent.color ? "#fff" : void 0,
                  width: getDragWidth(),
                  height: getDragHeight() ? `${getDragHeight()}px` : void 0,
                  boxShadow: `0 20px 40px -15px ${activeDragEvent.color || "var(--primary)"}40, 0 10px 20px -10px rgba(0,0,0,0.2)`,
                  transform: "rotate(-2deg) scale(1.02)"
                },
                children: /* @__PURE__ */ jsxs("div", { className: "p-2.5 h-full flex flex-col", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
                      style: { backgroundColor: activeDragEvent.color || "var(--primary)" }
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "pl-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "font-semibold truncate text-sm", children: activeDragEvent.title }),
                    (view === "week" || view === "day") && getDragHeight() && getDragHeight() > 40 && /* @__PURE__ */ jsxs("div", { className: "text-xs opacity-80 mt-0.5 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxs("svg", { className: "w-3 h-3", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                        /* @__PURE__ */ jsx("path", { d: "M12 6v6l4 2" })
                      ] }),
                      format(activeDragEvent.start, "h:mm a"),
                      " - ",
                      format(activeDragEvent.end, "h:mm a")
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "absolute bottom-1.5 right-1.5 opacity-60", children: /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "currentColor", children: [
                    /* @__PURE__ */ jsx("circle", { cx: "9", cy: "5", r: "1.5" }),
                    /* @__PURE__ */ jsx("circle", { cx: "15", cy: "5", r: "1.5" }),
                    /* @__PURE__ */ jsx("circle", { cx: "9", cy: "12", r: "1.5" }),
                    /* @__PURE__ */ jsx("circle", { cx: "15", cy: "12", r: "1.5" }),
                    /* @__PURE__ */ jsx("circle", { cx: "9", cy: "19", r: "1.5" }),
                    /* @__PURE__ */ jsx("circle", { cx: "15", cy: "19", r: "1.5" })
                  ] }) })
                ] })
              }
            ) : null })
          ]
        }
      )
    }
  );
};

export { Scheduler, cn };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map