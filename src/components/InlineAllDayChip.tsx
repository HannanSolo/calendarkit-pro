import React from 'react';
import { CalendarEvent } from '../types';
import { cn } from '../utils';
import { DraggableEvent } from './dnd/DraggableEvent';
import { InlineDayEvent } from '../lib/allDayLayout';

interface InlineAllDayChipProps {
  event: CalendarEvent;
  position: InlineDayEvent['position'];
  onEventClick?: (event: CalendarEvent) => void;
}

export const InlineAllDayChip = React.memo(({ event, position, onEventClick }: InlineAllDayChipProps) => {
  const showTitle = position !== 'middle';
  const color = event.color || 'var(--primary)';

  return (
    <DraggableEvent event={event}>
      <div
        className={cn(
          "text-[11px] font-semibold px-2 py-1 truncate cursor-pointer transition-all hover:shadow-md hover:brightness-95 flex items-center h-[22px]",
          position === 'single' && "rounded-lg",
          position === 'start' && "rounded-l-lg -mr-2 pr-3",
          position === 'middle' && "-mx-2 px-3",
          position === 'end' && "rounded-r-lg -ml-2 pl-3",
        )}
        style={{
          backgroundColor: `${color}${position === 'middle' ? '18' : '25'}`,
          color: showTitle ? color : 'transparent',
          borderLeft: (position === 'start' || position === 'single') ? `3px solid ${color}` : undefined,
          minHeight: '22px',
        }}
        title={event.title}
        aria-label={event.title}
        role="button"
        onClick={(e) => {
          e.stopPropagation();
          onEventClick?.(event);
        }}
      >
        {showTitle && <span className="truncate">{event.title}</span>}
      </div>
    </DraggableEvent>
  );
});

InlineAllDayChip.displayName = 'InlineAllDayChip';
