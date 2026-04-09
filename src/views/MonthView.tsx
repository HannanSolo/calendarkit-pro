import React, { useMemo, useCallback } from 'react';
import { format, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, eachDayOfInterval, differenceInDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { getMonthGrid } from '../lib/date';
import { CalendarEvent } from '../types';
import { cn } from '../utils';
import { DraggableEvent } from '../components/dnd/DraggableEvent';
import { DroppableCell } from '../components/dnd/DroppableCell';
import { partitionEvents, computeAllDayLayout, isAllDayEvent } from '../lib/allDayLayout';
import { Locale } from 'date-fns';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  timezone?: string;
  locale?: Locale;
}

// Memoized Event Item Component for performance
const EventItem = React.memo(({ event, onEventClick }: { event: CalendarEvent, onEventClick?: (e: CalendarEvent) => void }) => (
    <DraggableEvent event={event}>
        <div
            className={cn(
              "text-xs px-2.5 py-1.5 rounded-lg truncate cursor-pointer shadow-sm transition-all duration-200",
              "hover:shadow-md hover:scale-[1.02] hover:z-10",
              !event.color && "bg-primary/10 text-primary hover:bg-primary/15 border-[0.5px] border-primary/20"
            )}
            style={event.color ? {
              backgroundColor: `${event.color}20`,
              color: event.color,
              borderLeft: `3px solid ${event.color}`,
            } : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick?.(event);
            }}
        >
            <span className="font-medium">{event.title}</span>
        </div>
    </DraggableEvent>
));

EventItem.displayName = 'EventItem';

// All-day spanning bar for month view
const AllDayBar = React.memo(({ segment, laneHeight, onEventClick }: {
  segment: { event: CalendarEvent; startCol: number; span: number; lane: number; isStart: boolean; isEnd: boolean };
  laneHeight: number;
  onEventClick?: (e: CalendarEvent) => void;
}) => {
  const { event } = segment;
  const totalDays = differenceInDays(event.end, event.start);
  const tooltip = totalDays > 0
    ? `${event.title} (${format(event.start, 'MMM d')} – ${format(event.end, 'MMM d')})`
    : event.title;

  return (
    <DraggableEvent event={event}>
      <div
        className={cn(
          "absolute text-[11px] font-semibold px-2 truncate cursor-pointer transition-all hover:shadow-md hover:brightness-95 z-10 flex items-center",
          segment.isStart && "rounded-l-md",
          segment.isEnd && "rounded-r-md"
        )}
        style={{
          top: segment.lane * laneHeight,
          left: `calc(${(segment.startCol / 7) * 100}% + 1px)`,
          width: `calc(${(segment.span / 7) * 100}% - 2px)`,
          height: laneHeight - 2,
          backgroundColor: `${event.color || 'var(--primary)'}30`,
          color: event.color || 'var(--primary)',
          borderLeft: segment.isStart ? `3px solid ${event.color || 'var(--primary)'}` : undefined,
        }}
        title={tooltip}
        aria-label={tooltip}
        role="button"
        onClick={(e) => {
          e.stopPropagation();
          onEventClick?.(event);
        }}
      >
        {segment.isStart && event.title}
      </div>
    </DraggableEvent>
  );
});

AllDayBar.displayName = 'AllDayBar';

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onDateClick,
  timezone,
  locale
}) => {
  const days = useMemo(() => getMonthGrid(currentDate), [currentDate]);

  // Dynamic week days generation (for header)
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Timezone adjustment helper
  const getZonedDate = useCallback((date: Date) => {
    return timezone ? toZonedTime(date, timezone) : date;
  }, [timezone]);

  // Partition events into all-day and timed
  const { allDayEvents, timedEvents } = useMemo(
    () => partitionEvents(events),
    [events]
  );

  // Split days into week chunks
  const weekRows = useMemo(() => {
    const rows: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(days.slice(i, i + 7));
    }
    return rows;
  }, [days]);

  // Pre-calculate timed event buckets for O(1) access during render
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

  // Compute all-day layout per week row
  const weekLayouts = useMemo(() => {
    return weekRows.map(week => computeAllDayLayout(week, allDayEvents, getZonedDate));
  }, [weekRows, allDayEvents, getZonedDate]);

  const allDayLaneHeight = 22; // px per lane in month view
  const maxVisibleLanes = 2;
  const dayCellHeight = 100; // px

  return (
    <div className="flex flex-col h-full bg-background border-[0.5px] scrollbar-hide border-border/50 rounded-2xl overflow-hidden min-w-[800px] md:min-w-0 shadow-sm">
      <div className="overflow-y-auto flex-1 relative">
        {/* Sticky Header */}
        <div className="grid grid-cols-7 border-b-[0.5px] border-border/50 bg-gradient-to-r from-muted/30 via-muted/40 to-muted/30 sticky top-0 z-20 backdrop-blur-sm">
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="py-3 text-center text-xs font-semibold text-muted-foreground border-r-[0.5px] border-border/30 last:border-r-0 uppercase tracking-wider"
            >
              {format(day, 'EEE', { locale })}
            </div>
          ))}
        </div>

        {/* Week Rows */}
        {weekRows.map((week, weekIndex) => {
          const layout = weekLayouts[weekIndex];
          const visibleLanes = Math.min(layout.laneCount, maxVisibleLanes);
          const hasOverflow = layout.laneCount > maxVisibleLanes;
          const allDaySectionHeight = visibleLanes > 0 ? visibleLanes * allDayLaneHeight + 2 : 0;

          return (
            <div key={week[0].toISOString()}>
              {/* All-Day Spanning Section */}
              {layout.laneCount > 0 && (
                <div
                  className="grid grid-cols-7 relative border-b-[0.5px] border-border/20"
                  style={{ height: allDaySectionHeight, overflow: 'hidden' }}
                >
                  {layout.segments
                    .filter(s => s.lane < maxVisibleLanes)
                    .map(segment => (
                      <AllDayBar
                        key={`${segment.event.id}-${segment.startCol}`}
                        segment={segment}
                        laneHeight={allDayLaneHeight}
                        onEventClick={onEventClick}
                      />
                    ))}
                  {/* Overflow indicators per day */}
                  {hasOverflow && week.map((day, colIdx) => {
                    const hiddenCount = layout.segments.filter(
                      s => s.lane >= maxVisibleLanes && colIdx >= s.startCol && colIdx < s.startCol + s.span
                    ).length;
                    if (hiddenCount === 0) return null;
                    const overflowLabel = `${hiddenCount} more all-day ${hiddenCount === 1 ? 'event' : 'events'}`;
                    return (
                      <div
                        key={`overflow-${colIdx}`}
                        className="absolute text-[9px] text-primary font-semibold cursor-pointer hover:underline"
                        style={{
                          left: `calc(${(colIdx / 7) * 100}% + 4px)`,
                          bottom: 0,
                        }}
                        title={overflowLabel}
                        aria-label={overflowLabel}
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDateClick?.(day);
                        }}
                      >
                        +{hiddenCount} more
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Day Cells (timed events only) */}
              <div className="grid grid-cols-7" style={{ gridAutoRows: `${dayCellHeight}px` }}>
                {week.map((day) => {
                  const dayKey = format(day, 'yyyy-MM-dd');
                  const dayTimedEvents = eventsByDay.get(dayKey) || [];
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const cellId = day.toISOString();

                  return (
                    <DroppableCell
                      key={cellId}
                      id={cellId}
                      date={day}
                      className={cn(
                        "p-2 border-b-[0.5px] border-r-[0.5px] border-border/30 last:border-r-0 relative transition-all duration-200 hover:bg-accent/5 flex flex-col gap-1 overflow-hidden group",
                        !isCurrentMonth && "bg-muted/5 text-muted-foreground/60",
                        isToday(day) && "bg-primary/5 ring-1 ring-inset ring-primary/20"
                      )}
                      style={{ height: `${dayCellHeight}px` }}
                      onClick={() => onDateClick?.(day)}
                    >
                      <div className="flex justify-between items-start">
                        <div className={cn(
                          "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200",
                          isToday(day)
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                            : "group-hover:bg-accent"
                        )}>
                          {format(day, 'd', { locale })}
                        </div>
                        {dayTimedEvents.length > 0 && (
                          <div
                            className="text-[10px] font-medium text-muted-foreground/60 bg-muted/50 px-1.5 py-0.5 rounded-full"
                            title={`${dayTimedEvents.length} ${dayTimedEvents.length === 1 ? 'event' : 'events'}`}
                            aria-label={`${dayTimedEvents.length} ${dayTimedEvents.length === 1 ? 'event' : 'events'}`}
                          >
                            {dayTimedEvents.length}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col gap-1 scrollbar-hide overflow-y-auto overflow-x-hidden">
                        {dayTimedEvents.slice(0, 3).map(event => (
                           <EventItem key={`${event.id}-${dayKey}`} event={event} onEventClick={onEventClick} />
                        ))}
                        {dayTimedEvents.length > 3 && (
                            <div
                              className="text-[10px] text-primary font-semibold text-center py-0.5 px-2 rounded-md bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors"
                              title={`${dayTimedEvents.length - 3} more ${dayTimedEvents.length - 3 === 1 ? 'event' : 'events'}`}
                              aria-label={`${dayTimedEvents.length - 3} more ${dayTimedEvents.length - 3 === 1 ? 'event' : 'events'}`}
                              role="button"
                            >
                                +{dayTimedEvents.length - 3} more
                            </div>
                        )}
                      </div>
                    </DroppableCell>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
