import { startOfDay, isSameDay, isBefore, isAfter, differenceInCalendarDays } from 'date-fns';
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
