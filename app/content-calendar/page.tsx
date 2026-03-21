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
          {
            name: 'og:description',
            content: 'Plan and organize your content with our intuitive calendar',
          },
          {
            name: 'og:image',
            content: '/images/content-calendar-og-image.jpg',
          },
          {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
          {
            name: 'twitter:title',
            content: 'Content Calendar',
          },
          {
            name: 'twitter:description',
            content: 'Plan and organize your content with our intuitive calendar',
          },
          {
            name: 'twitter:image',
            content: '/images/content-calendar-twitter-image.jpg',
          },
        ]}
      />
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
        <h1 className="text-3xl font-bold mb-4">Content Calendar</h1>
        <Image 
          src="/images/content-calendar-header-image.jpg" 
          alt="Content Calendar Header Image" 
          width={1200} 
          height={400} 
          priority={true} 
          loading="eager"
        />
        <DndProvider backend={HTML5Backend}>
          <Calendar
            events={events}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onEventCreate={handleEventCreate}
            onEventDelete={handleEventDelete}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          />
        </DndProvider>
      </div>
    </Layout>
  );
};

export default ContentCalendarPage;