use client;

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';

const ContentCalendarPage = () => {
  const pathname = usePathname();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  return (
    <Layout>
      <SEO title="Content Calendar" description="Plan and organize your content with our intuitive calendar" />
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
        <h1 className="text-3xl font-bold mb-4">Content Calendar</h1>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onEventCreate={handleEventCreate}
          onEventDelete={handleEventDelete}
        />
      </div>
    </Layout>
  );
};

export default ContentCalendarPage;