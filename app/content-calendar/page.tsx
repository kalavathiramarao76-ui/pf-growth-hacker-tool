import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GoogleCalendar, OutlookCalendar } from '../components/CalendarIntegrations';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';

const ContentCalendarPage = () => {
  const pathname = usePathname();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventCreate = (event: CalendarEvent) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    localStorage.setItem('events', JSON.stringify([...events, event]));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    localStorage.setItem('events', JSON.stringify(events.filter((event) => event.id !== eventId)));
  };

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDragEnd = (event: CalendarEvent, newDate: Date) => {
    if (draggedEvent) {
      const updatedEvents = events.map((e) => {
        if (e.id === draggedEvent.id) {
          return { ...e, startDate: newDate };
        }
        return e;
      });
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  };

  const handleDrop = (event: CalendarEvent, newDate: Date) => {
    if (draggedEvent) {
      const updatedEvents = events.map((e) => {
        if (e.id === draggedEvent.id) {
          return { ...e, startDate: newDate };
        }
        return e;
      });
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  };

  const handleMouseOver = (event: CalendarEvent) => {
    setHoveredEvent(event);
  };

  const handleMouseOut = () => {
    setHoveredEvent(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <SEO 
          title="Content Calendar" 
          description="Plan and organize your content with our intuitive calendar" 
          meta={[
            {
              name: 'keywords',
              content: 'content calendar, content planning, content organization',
            },
            {
              name: 'robots',
              content: 'index, follow',
            },
            {
              name: 'og:title',
              content: 'Content Calendar',
            },
          ]}
        />
        <div className="content-calendar-container">
          <Calendar
            events={events}
            onDateChange={handleDateChange}
            onEventCreate={handleEventCreate}
            onEventDelete={handleEventDelete}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          />
          <div className="calendar-integrations">
            <GoogleCalendar />
            <OutlookCalendar />
          </div>
          {hoveredEvent && (
            <Tooltip event={hoveredEvent} />
          )}
        </div>
      </Layout>
    </DndProvider>
  );
};

export default ContentCalendarPage;