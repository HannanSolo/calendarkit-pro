import { startOfDay, isSameDay, isBefore, isAfter, differenceInCalendarDays, format } from 'date-fns';
import { CalendarEvent } from '../types';

export interface EventSegment {
  event: CalendarEvent;
  startCol: number;
  span: number;
  lane: number;
  isStart: boolean;
  isEnd: boolean;
}

export interface AllDayLayout {
  segments: EventSegment[];
  laneCount: number;
}

/**
 * Returns true if the event should render in the all-day section.
 */
export function isAllDayEvent(event: CalendarEvent): boolean {
  return event.allDay === true;
}

/**
 * Splits events into allDay and timed buckets.
 */
export function partitionEvents(
  events: CalendarEvent[],
): { allDayEvents: CalendarEvent[]; timedEvents: CalendarEvent[] } {
  const allDayEvents: CalendarEvent[] = [];
  const timedEvents: CalendarEvent[] = [];

  for (const event of events) {
    if (isAllDayEvent(event)) {
      allDayEvents.push(event);
    } else {
      timedEvents.push(event);
    }
  }

  return { allDayEvents, timedEvents };
}

/**
 * Compute lane-packed layout for all-day events within a row of days.
 *
 * @param rowDays - Array of Date objects representing the visible days (e.g. 7 for a week)
 * @param allDayEvents - Only allDay events (pre-filtered)
 * @param getZonedDate - Timezone conversion helper
 */
export function computeAllDayLayout(
  rowDays: Date[],
  allDayEvents: CalendarEvent[],
  getZonedDate: (d: Date) => Date
): AllDayLayout {
  const cols = rowDays.length;
  if (cols === 0) return { segments: [], laneCount: 0 };

  const rowStart = startOfDay(rowDays[0]);
  const rowEnd = startOfDay(rowDays[cols - 1]);

  // Build segments for events that overlap this row
  const unsorted: Omit<EventSegment, 'lane'>[] = [];

  for (const event of allDayEvents) {
    const evStart = startOfDay(getZonedDate(event.start));
    const evEnd = startOfDay(getZonedDate(event.end));

    // Skip if event doesn't overlap this row at all
    if (isAfter(evStart, rowEnd) || isBefore(evEnd, rowStart)) {
      continue;
    }

    // Clamp to row boundaries
    const clampedStart = isBefore(evStart, rowStart) ? rowStart : evStart;
    const clampedEnd = isAfter(evEnd, rowEnd) ? rowEnd : evEnd;

    // Find column indices
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
      isEnd: isSameDay(evEnd, clampedEnd),
    });
  }

  // Sort: earlier start first, then longer span first for stable packing
  unsorted.sort((a, b) => a.startCol - b.startCol || b.span - a.span);

  // Greedy lane packing
  // occupied[lane][col] = true if that column is taken
  const occupied: boolean[][] = [];
  const segments: EventSegment[] = [];

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
      // Create new lane
      assignedLane = occupied.length;
      occupied.push(new Array(cols).fill(false));
    }

    // Mark columns occupied
    for (let c = seg.startCol; c < seg.startCol + seg.span; c++) {
      occupied[assignedLane][c] = true;
    }

    segments.push({ ...seg, lane: assignedLane });
  }

  return {
    segments,
    laneCount: occupied.length,
  };
}

// --- Inline per-day expansion for rendering all-day events inside day cells ---

export interface InlineDayEvent {
  event: CalendarEvent;
  position: 'start' | 'middle' | 'end' | 'single';
}

/**
 * Expands all-day events into per-day entries for inline rendering inside day cells.
 * Each day a multi-day event spans gets its own InlineDayEvent with a position indicator.
 */
export function expandAllDayIntoDays(
  allDayEvents: CalendarEvent[],
  visibleDays: Date[],
  getZonedDate: (d: Date) => Date
): Map<string, InlineDayEvent[]> {
  const map = new Map<string, InlineDayEvent[]>();
  if (visibleDays.length === 0) return map;

  const firstDay = startOfDay(visibleDays[0]);
  const lastDay = startOfDay(visibleDays[visibleDays.length - 1]);

  // Pre-compute sort keys once per event (js-cache-function-results)
  const keyed = allDayEvents.map(event => {
    const evStart = startOfDay(getZonedDate(event.start));
    const evEnd = startOfDay(getZonedDate(event.end));
    return { event, evStart, evEnd, startTime: evStart.getTime(), span: differenceInCalendarDays(evEnd, evStart) };
  });

  // Sort by start date then by span (longer first) for stable ordering
  keyed.sort((a, b) => {
    if (a.startTime !== b.startTime) return a.startTime - b.startTime;
    return b.span - a.span;
  });

  for (const { event, evStart, evEnd } of keyed) {

    // Skip if event doesn't overlap visible range
    if (isAfter(evStart, lastDay) || isBefore(evEnd, firstDay)) continue;

    const isSingleDay = isSameDay(evStart, evEnd);

    // Iterate through each visible day
    for (const day of visibleDays) {
      const dayStart = startOfDay(day);
      // Check if this day falls within the event's range
      if (isBefore(dayStart, evStart) || isAfter(dayStart, evEnd)) continue;

      const key = format(dayStart, 'yyyy-MM-dd');
      let position: InlineDayEvent['position'];

      if (isSingleDay) {
        position = 'single';
      } else if (isSameDay(dayStart, evStart)) {
        position = 'start';
      } else if (isSameDay(dayStart, evEnd)) {
        position = 'end';
      } else {
        position = 'middle';
      }

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push({ event, position });
    }
  }

  return map;
}
