import React, { useMemo, useCallback } from 'react';
import { format, isSameDay, differenceInMinutes, isToday, startOfWeek, endOfWeek, eachDayOfInterval, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { CalendarEvent } from '../types';
import { cn } from '../utils';
import { DraggableEvent } from '../components/dnd/DraggableEvent';
import { DroppableCell } from '../components/dnd/DroppableCell';
import { ResizableEvent } from '../components/dnd/ResizableEvent';
import { partitionEvents, computeAllDayLayout } from '../lib/allDayLayout';
import { Locale } from 'date-fns';

// Hoisted static JSX to avoid recreation (rendering-hoist-jsx)
const emptyCell = <div className="w-full h-full" />;

// Memoized all-day bar for WeekView (rerender-memo)
const WeekAllDayBar = React.memo(({ segment, laneHeight, onEventClick }: {
  segment: { event: CalendarEvent; startCol: number; span: number; lane: number; isStart: boolean; isEnd: boolean };
  laneHeight: number;
  onEventClick?: (e: CalendarEvent) => void;
}) => (
  <DraggableEvent
    event={segment.event}
    className="absolute z-10"
    style={{
      top: segment.lane * laneHeight + 2,
      left: `calc(${(segment.startCol / 7) * 100}% + 2px)`,
      width: `calc(${(segment.span / 7) * 100}% - 4px)`,
      height: laneHeight - 4,
    }}
  >
    <div
      className={cn(
        "w-full h-full text-xs font-medium px-2 py-1 truncate cursor-pointer transition-all hover:shadow-md hover:brightness-95",
        segment.isStart && "rounded-l-md",
        segment.isEnd && "rounded-r-md"
      )}
      style={{
        backgroundColor: `${segment.event.color || 'var(--primary)'}30`,
        color: segment.event.color || 'var(--primary)',
        borderLeft: segment.isStart ? `3px solid ${segment.event.color || 'var(--primary)'}` : undefined,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onEventClick?.(segment.event);
      }}
    >
      {segment.isStart && segment.event.title}
    </div>
  </DraggableEvent>
));

WeekAllDayBar.displayName = 'WeekAllDayBar';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date) => void;
  onEventResize?: (event: CalendarEvent, newEnd: Date) => void;
  timezone?: string;
  locale?: Locale;
  readonly?: boolean;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
  onEventResize,
  timezone,
  locale,
  readonly,
}) => {
  // Generate days for the week
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const hourHeight = 60; // px
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to 8am on mount for better UX
  React.useEffect(() => {
    if (scrollContainerRef.current) {
        const scrollToActualTime = () => {
            const currentHour = now.getHours();
            const offsetHour = 4; // Scroll a bit above current hour
            return (currentHour - offsetHour) * hourHeight;
        }
      scrollContainerRef.current.scrollTop = scrollToActualTime();
    }
  }, []);

  // Timezone adjustment helper
  const getZonedDate = useCallback((date: Date) => {
    return timezone ? toZonedTime(date, timezone) : date;
  }, [timezone]);

  const zonedNow = getZonedDate(new Date());

  // Partition events into all-day and timed
  const { allDayEvents, timedEvents } = useMemo(
    () => partitionEvents(events),
    [events]
  );

  // Compute all-day layout for this week (spanning bars)
  const allDayLayout = useMemo(
    () => computeAllDayLayout(weekDays, allDayEvents, getZonedDate),
    [weekDays, allDayEvents, getZonedDate]
  );

  // Pre-calculate timed event buckets for O(1) access per day column
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    timedEvents.forEach(event => {
      const zonedStart = getZonedDate(event.start);
      const key = format(zonedStart, 'yyyy-MM-dd');
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(event);
    });
    return map;
  }, [timedEvents, getZonedDate]);

  const allDayLaneHeight = 28; // px per lane
  const maxVisibleLanes = 3;
  const [showAllLanes, setShowAllLanes] = React.useState(false);
  const visibleLaneCount = showAllLanes ? allDayLayout.laneCount : Math.min(allDayLayout.laneCount, maxVisibleLanes);
  const hasOverflowLanes = allDayLayout.laneCount > maxVisibleLanes;

  const getTimezoneDisplay = (tz: string | undefined) => {
      const date = now;
      let displayTime = '';
      let acronym = '';

      if (!tz) {
          displayTime = format(date, 'HH:mm');
          try {
             acronym = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
              .formatToParts(date)
              .find(part => part.type === 'timeZoneName')?.value || '';
          } catch (e) { acronym = 'LOC'; }
      } else {
          try {
              const zDate = toZonedTime(date, tz);
              displayTime = format(zDate, 'HH:mm');
              acronym = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
                  .formatToParts(date)
                  .find(part => part.type === 'timeZoneName')?.value || '';
          } catch (e) {
              displayTime = format(date, 'HH:mm');
              acronym = tz;
          }
      }

      return (
        <div className="flex flex-col items-center justify-center leading-tight">
            <span>{displayTime}</span>
            <span className="text-[10px] opacity-75">({acronym})</span>
        </div>
      );
  };

  const timeFormat = locale?.code === 'fr' ? 'H:mm' : 'h a';
  const eventTimeFormat = locale?.code === 'fr' ? 'H:mm' : 'h:mm a';
  const nowFormat = locale?.code === 'fr' ? 'H:mm' : 'h:mm';

  return (
    <div className="flex flex-col h-full bg-background border-[0.5px] border-border/50 rounded-2xl overflow-hidden min-w-[800px] md:min-w-0 shadow-sm">
      {/* Scrollable Container - includes header for proper alignment */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hide relative bg-background scroll-smooth"
        style={{ scrollbarGutter: 'stable' }}
      >
        {/* Header - sticky inside scroll container */}
        <div className="flex border-b-[0.5px] border-border/50 bg-gradient-to-r from-muted/20 via-background to-muted/20 z-20 sticky top-0 backdrop-blur-sm">
          <div className="flex-none p-3 text-center text-xs font-semibold text-muted-foreground w-16 flex items-center justify-center border-r-[0.5px] border-border/30 bg-muted/10">
            {getTimezoneDisplay(timezone)}
          </div>
          <div className="flex-1 grid grid-cols-7">
              {weekDays.map((day, index) => (
              <div key={day.toISOString()} className={cn("py-3 px-2 text-center", index > 0 && "border-l-[0.5px] border-border/30")}>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{format(day, 'EEE', { locale })}</div>
                  <div className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-xl mx-auto text-sm font-semibold transition-all duration-200",
                    isToday(day)
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                      : "text-foreground hover:bg-accent/80"
                  )}>
                    {format(day, 'd', { locale })}
                  </div>
              </div>
              ))}
          </div>
        </div>

        {/* All-Day Section with per-column drop targets */}
        {allDayLayout.laneCount > 0 && (
          <div className="flex border-b-[0.5px] border-border/50 bg-muted/5 sticky top-[73px] z-[19]">
            <div className="flex-none w-16 border-r-[0.5px] border-border/30 flex items-center justify-center">
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight text-center">
                All<br/>day
              </span>
            </div>
            <div className="flex-1 relative">
              <div
                className="relative"
                style={{ height: visibleLaneCount * allDayLaneHeight + 4, overflow: 'hidden' }}
              >
                {/* Per-column droppable targets (underneath the spanning bars) */}
                <div className="absolute inset-0 grid grid-cols-7">
                  {weekDays.map((day, index) => (
                    <DroppableCell
                      key={`allday-drop-${day.toISOString()}`}
                      id={`allday-${day.toISOString()}`}
                      date={startOfDay(day)}
                      className={cn(
                        "h-full",
                        index > 0 && "border-l-[0.5px] border-border/30"
                      )}
                    >
                      {emptyCell}
                    </DroppableCell>
                  ))}
                </div>

                {/* Spanning event bars (visually on top) */}
                {allDayLayout.segments.map((segment) => (
                  <WeekAllDayBar
                    key={`allday-${segment.event.id}-${segment.startCol}`}
                    segment={segment}
                    laneHeight={allDayLaneHeight}
                    onEventClick={onEventClick}
                  />
                ))}
              </div>
              {hasOverflowLanes && (
                <button
                  className="w-full text-[10px] text-primary font-semibold py-0.5 hover:bg-primary/5 transition-colors"
                  onClick={() => setShowAllLanes(v => !v)}
                >
                  {showAllLanes ? 'Show less' : `+${allDayLayout.laneCount - maxVisibleLanes} more`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Grid Content */}
        <div
          className="flex min-w-full relative"
          style={{ height: hours.length * hourHeight }}
        >
          {/* Time Labels Column */}
          <div className="flex-none w-16 border-r-[0.5px] border-border/30 relative bg-muted/5">
            {hours.map((hour) => (
                 <div
                   key={hour}
                   className="relative w-full text-[11px] text-muted-foreground/80 text-right pr-3 font-medium tabular-nums box-border"
                   style={{ height: hourHeight }}
                 >
                   <span className="block -translate-y-1/2">
                    {hour !== 0 && format(new Date().setHours(hour, 0, 0, 0), timeFormat, { locale })}
                   </span>
                 </div>
            ))}
          </div>

          {/* Days Columns */}
          <div className="flex-1 grid grid-cols-7 relative">
            {weekDays.map((day, dayIndex) => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const dayEvents = eventsByDay.get(dayKey) || [];

                return (
                <div key={day.toISOString()} className={cn("relative h-full", dayIndex > 0 && "border-l-[0.5px] border-border/30")}>
                    {/* Grid Rows (Droppable Cells) */}
                    {hours.map((hour) => {
                        return (
                            <div
                                key={hour}
                                className="w-full border-b-[0.5px] border-dashed border-border/20 box-border relative hover:bg-accent/5 transition-colors"
                                style={{ height: hourHeight }}
                            >
                                {/* 4 x 15-minute intervals */}
                                {[0, 15, 30, 45].map((minute) => {
                                    const cellDate = new Date(day);
                                    cellDate.setHours(hour, minute, 0, 0);
                                    const cellId = cellDate.toISOString();

                                    return (
                                        <DroppableCell
                                            key={minute}
                                            id={cellId}
                                            date={cellDate}
                                            className="w-full absolute left-0 right-0 z-0 transition-colors"
                                            style={{
                                                height: '25%',
                                                top: `${(minute / 60) * 100}%`
                                            }}
                                        >
                                            <div
                                                className="w-full h-full bg-transparent cursor-pointer"
                                                onClick={() => onTimeSlotClick?.(cellDate)}
                                            />
                                        </DroppableCell>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {/* Events Overlay */}
                    {dayEvents.map((event) => {
                        const overlappingEvents = dayEvents.filter(e => {
                            if (e.id === event.id) return false;
                            const s1 = getZonedDate(event.start).getTime();
                            const e1 = getZonedDate(event.end).getTime();
                            const s2 = getZonedDate(e.start).getTime();
                            const e2 = getZonedDate(e.end).getTime();
                            return s1 < e2 && e1 > s2;
                        });

                        const group = [event, ...overlappingEvents].sort((a, b) =>
                            getZonedDate(a.start).getTime() - getZonedDate(b.start).getTime() ||
                            (a.id > b.id ? 1 : -1)
                        );

                        const index = group.findIndex(e => e.id === event.id);
                        const count = group.length;

                        const widthPercent = 100 / count;
                        const leftPercent = index * widthPercent;

                        const zonedEventStart = getZonedDate(event.start);
                        const zonedEventEnd = getZonedDate(event.end);

                        const startMinutes = zonedEventStart.getHours() * 60 + zonedEventStart.getMinutes();
                        const durationMinutes = differenceInMinutes(zonedEventEnd, zonedEventStart);

                        const top = (startMinutes / 60) * hourHeight;
                        const height = (durationMinutes / 60) * hourHeight;

                        const isShortEvent = durationMinutes < 60;

                        return (
                            <DraggableEvent
                                key={`${event.id}-${day.toISOString()}`}
                                event={event}
                                className={`absolute z-10 transition-all ${readonly ? "cursor-default" : ""}`}
                                style={{
                                    top: `${top}px`,
                                    height: `${Math.max(height, 20)}px`,
                                    left: `${leftPercent}%`,
                                    width: `${widthPercent}%`,
                                    paddingRight: count > 1 ? '2px' : '0'
                                }}
                            >
                                <ResizableEvent
                                    readonly={readonly}
                                    event={event}
                                    hourHeight={hourHeight}
                                    onResize={onEventResize}
                                    className="h-full"
                                    style={{ height: '100%' }}
                                >
                                    <div
                                        className={cn(
                                            "rounded-md border shadow-sm transition-all hover:shadow-md group overflow-hidden relative",
                                            "glass",
                                            readonly ? "cursor-default" : "cursor-grab active:cursor-grabbing",
                                            !event.color && "border-primary/20 bg-primary/10",
                                            isShortEvent ? "px-1 flex items-center justify-center" : "p-2",
                                            count > 1 && "border-l-4 border-l-primary/50"
                                        )}
                                        style={{
                                            height: '100%',
                                            backgroundColor: event.color ? `${event.color}15` : undefined,
                                            borderColor: event.color ? `${event.color}40` : undefined,
                                            borderLeftWidth: '3px',
                                            borderLeftColor: event.color || 'var(--primary)'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEventClick?.(event);
                                        }}
                                        title={count > 1 ? `${event.title} (${index + 1}/${count})` : undefined}
                                    >
                                        <div className="flex flex-col h-full overflow-hidden w-full">
                                            <div className={cn("font-semibold truncate text-foreground/90 leading-tight",
                                                isShortEvent ? "text-xs text-center" : "text-xs"
                                            )}>
                                                {event.title}
                                            </div>
                                            {!isShortEvent && (
                                                <>
                                                    <div className="text-[10px] text-muted-foreground truncate mt-0.5 font-medium leading-tight">
                                                        {format(zonedEventStart, eventTimeFormat, { locale })} - {format(zonedEventEnd, eventTimeFormat, { locale })}
                                                    </div>
                                                    {event.description && height > 50 && (
                                                        <div className="text-[10px] text-muted-foreground/80 truncate mt-1 leading-tight opacity-80">
                                                            {event.description}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {count > 1 && !isShortEvent && (
                                                <div className="absolute top-1 right-1 bg-background/80 backdrop-blur-sm rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold text-muted-foreground border border-border shadow-sm">
                                                    {count}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </ResizableEvent>
                            </DraggableEvent>
                        );
                    })}

                    {/* Current Time Indicator */}
                    {isToday(day) && (
                    <div
                        className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
                        style={{
                          top: `${(zonedNow.getHours() * 60 + zonedNow.getMinutes()) / 60 * hourHeight}px`
                        }}
                    >
                        <div className="h-[2px] w-full bg-gradient-to-r from-primary via-primary to-primary/50" />
                        <div className="absolute -left-1.5 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/40 ring-2 ring-background animate-pulse" />
                    </div>
                    )}
                </div>
                );
            })}
          </div>
        </div>

        {/* Current Time Label (Left Axis) */}
        <div
            className="absolute left-0 w-16 pointer-events-none z-30 flex justify-end pr-2"
            style={{
                top: `${(zonedNow.getHours() * 60 + zonedNow.getMinutes()) / 60 * hourHeight + 80}px`,
            }}
        >
            <span className="text-[10px] font-bold text-primary-foreground bg-primary px-1.5 py-0.5 rounded-md shadow-md -translate-y-1/2 backdrop-blur-none">
                {format(zonedNow, nowFormat, { locale })}
            </span>
        </div>
      </div>
    </div>
  );
};
