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

  const handleGoogleCalendarConnect = () => {
    // Implement Google Calendar connection logic here
    setIsGoogleCalendarConnected(true);
    localStorage.setItem('isGoogleCalendarConnected', JSON.stringify(true));
    // Fetch Google Calendar events and update state
    const googleCalendarEvents = [
      { id: 'google-event-1', title: 'Google Event 1', startDate: new Date('2024-01-01'), endDate: new Date('2024-01-02') },
      { id: 'google-event-2', title: 'Google Event 2', startDate: new Date('2024-01-15'), endDate: new Date('2024-01-16') },
    ];
    setGoogleCalendarEvents(googleCalendarEvents);
  };

  const handleOutlookCalendarConnect = () => {
    // Implement Outlook Calendar connection logic here
    setIsOutlookCalendarConnected(true);
    localStorage.setItem('isOutlookCalendarConnected', JSON.stringify(true));
    // Fetch Outlook Calendar events and update state
    const outlookCalendarEvents = [
      { id: 'outlook-event-1', title: 'Outlook Event 1', startDate: new Date('2024-02-01'), endDate: new Date('2024-02-02') },
      { id: 'outlook-event-2', title: 'Outlook Event 2', startDate: new Date('2024-02-15'), endDate: new Date('2024-02-16') },
    ];
    setOutlookCalendarEvents(outlookCalendarEvents);
  };

  const handleGoogleCalendarDisconnect = () => {
    setIsGoogleCalendarConnected(false);
    localStorage.setItem('isGoogleCalendarConnected', JSON.stringify(false));
    setGoogleCalendarEvents([]);
  };

  const handleOutlookCalendarDisconnect = () => {
    setIsOutlookCalendarConnected(false);
    localStorage.setItem('isOutlookCalendarConnected', JSON.stringify(false));
    setOutlookCalendarEvents([]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <SEO 
          title="AI-Powered Content Calendar | Plan and Organize Your Content" 
          description="Discover the ultimate AI-powered content calendar to plan, organize, and optimize your content strategy. Get started today and boost your online presence!" 
          meta={[
            {
              name: 'keywords',
              content: 'content calendar, content planning, content organization',
            },
          ]}
        />
        <div className="calendar-container">
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
          <div className="calendar-integrations">
            <GoogleCalendar
              isConnected={isGoogleCalendarConnected}
              onConnect={handleGoogleCalendarConnect}
              onDisconnect={handleGoogleCalendarDisconnect}
              events={googleCalendarEvents}
            />
            <OutlookCalendar
              isConnected={isOutlookCalendarConnected}
              onConnect={handleOutlookCalendarConnect}
              onDisconnect={handleOutlookCalendarDisconnect}
              events={outlookCalendarEvents}
            />
          </div>
        </div>
      </Layout>
    </DndProvider>
  );
};

export default ContentCalendarPage;