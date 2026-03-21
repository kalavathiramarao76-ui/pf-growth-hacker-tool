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
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<CalendarEvent[]>([]);
  const [outlookCalendarEvents, setOutlookCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [isOutlookCalendarConnected, setIsOutlookCalendarConnected] = useState(false);
  const [googleCalendarAccessToken, setGoogleCalendarAccessToken] = useState<string | null>(null);
  const [outlookCalendarAccessToken, setOutlookCalendarAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    const storedGoogleCalendarConnected = localStorage.getItem('isGoogleCalendarConnected');
    if (storedGoogleCalendarConnected) {
      setIsGoogleCalendarConnected(JSON.parse(storedGoogleCalendarConnected));
    }
    const storedOutlookCalendarConnected = localStorage.getItem('isOutlookCalendarConnected');
    if (storedOutlookCalendarConnected) {
      setIsOutlookCalendarConnected(JSON.parse(storedOutlookCalendarConnected));
    }
    const storedGoogleCalendarAccessToken = localStorage.getItem('googleCalendarAccessToken');
    if (storedGoogleCalendarAccessToken) {
      setGoogleCalendarAccessToken(storedGoogleCalendarAccessToken);
    }
    const storedOutlookCalendarAccessToken = localStorage.getItem('outlookCalendarAccessToken');
    if (storedOutlookCalendarAccessToken) {
      setOutlookCalendarAccessToken(storedOutlookCalendarAccessToken);
    }
  }, []);

  useEffect(() => {
    if (isGoogleCalendarConnected && googleCalendarAccessToken) {
      fetchGoogleCalendarEvents();
    }
    if (isOutlookCalendarConnected && outlookCalendarAccessToken) {
      fetchOutlookCalendarEvents();
    }
  }, [isGoogleCalendarConnected, googleCalendarAccessToken, isOutlookCalendarConnected, outlookCalendarAccessToken]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventCreate = (event: CalendarEvent) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    localStorage.setItem('events', JSON.stringify([...events, event]));
  };

  const handleEventUpdate = (event: CalendarEvent) => {
    setEvents((prevEvents) => prevEvents.map((e) => (e.id === event.id ? event : e)));
    localStorage.setItem('events', JSON.stringify(events.map((e) => (e.id === event.id ? event : e))));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    localStorage.setItem('events', JSON.stringify(events.filter((event) => event.id !== eventId)));
  };

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
  };

  const handleDrop = (date: Date) => {
    if (draggedEvent) {
      const updatedEvent = { ...draggedEvent, startDate: date, endDate: new Date(date.getTime() + 60 * 60 * 1000) };
      handleEventUpdate(updatedEvent);
    }
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      </DndProvider>
      {isGoogleCalendarConnected && (
        <GoogleCalendar
          accessToken={googleCalendarAccessToken}
          events={googleCalendarEvents}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
        />
      )}
      {isOutlookCalendarConnected && (
        <OutlookCalendar
          accessToken={outlookCalendarAccessToken}
          events={outlookCalendarEvents}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
        />
      )}
      <Tooltip>
        <Image src="/calendar-icon.png" alt="Calendar Icon" width={20} height={20} />
      </Tooltip>
    </Layout>
  );
};

export default ContentCalendarPage;