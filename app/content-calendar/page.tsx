import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import { Socket } from '../utils/socket';

// Unified Calendar API
interface CalendarIntegration {
  connect: (token: string) => void;
  getEvents: () => Promise<CalendarEvent[]>;
  disconnect: () => void;
  name: string;
  icon: string;
  description: string;
  authUrl: string;
}

// Calendar Integrations
const calendarIntegrations: { [key: string]: CalendarIntegration } = {
  GoogleCalendar: {
    connect: (token: string) => {
      // Implement Google Calendar connection logic
      localStorage.setItem('googleCalendarToken', token);
    },
    getEvents: async () => {
      // Implement Google Calendar event retrieval logic
      const token = localStorage.getItem('googleCalendarToken');
      if (token) {
        const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        return data.items.map((event: any) => ({
          id: event.id,
          title: event.summary,
          start: new Date(event.start.dateTime),
          end: new Date(event.end.dateTime),
        }));
      }
      return [];
    },
    disconnect: () => {
      // Implement Google Calendar disconnection logic
      localStorage.removeItem('googleCalendarToken');
    },
    name: 'Google Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281764.png',
    description: 'Connect your Google Calendar to view and manage your events',
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
  },
  OutlookCalendar: {
    connect: (token: string) => {
      // Implement Outlook Calendar connection logic
      localStorage.setItem('outlookCalendarToken', token);
    },
    getEvents: async () => {
      // Implement Outlook Calendar event retrieval logic
      const token = localStorage.getItem('outlookCalendarToken');
      if (token) {
        const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        return data.value.map((event: any) => ({
          id: event.id,
          title: event.subject,
          start: new Date(event.start.dateTime),
          end: new Date(event.end.dateTime),
        }));
      }
      return [];
    },
    disconnect: () => {
      // Implement Outlook Calendar disconnection logic
      localStorage.removeItem('outlookCalendarToken');
    },
    name: 'Outlook Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281765.png',
    description: 'Connect your Outlook Calendar to view and manage your events',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  },
};

const Page = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day');
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const googleCalendarEvents = await calendarIntegrations.GoogleCalendar.getEvents();
      const outlookCalendarEvents = await calendarIntegrations.OutlookCalendar.getEvents();
      setEvents([...googleCalendarEvents, ...outlookCalendarEvents]);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const socket = new Socket();
    socket.on('connect', () => {
      setSocketConnected(true);
    });
    socket.on('disconnect', () => {
      setSocketConnected(false);
    });
    socket.on('eventUpdated', (event: CalendarEvent) => {
      setEvents((prevEvents) => prevEvents.map((prevEvent) => (prevEvent.id === event.id ? event : prevEvent)));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDragEnd = (event: CalendarEvent) => {
    setDraggedEvent(null);
  };

  const handleDrop = (event: CalendarEvent) => {
    if (draggedEvent) {
      const updatedEvents = events.map((prevEvent) => {
        if (prevEvent.id === draggedEvent.id) {
          return { ...prevEvent, start: event.start, end: event.end };
        }
        return prevEvent;
      });
      setEvents(updatedEvents);
      socketConnected && socket.emit('eventUpdated', { ...draggedEvent, start: event.start, end: event.end });
    }
  };

  const handleCalendarViewChange = (view: 'day' | 'week' | 'month') => {
    setCalendarView(view);
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          view={calendarView}
          onViewChange={handleCalendarViewChange}
        />
      </DndProvider>
      {events.map((event) => (
        <Tooltip key={event.id} title={event.title}>
          <Image src={calendarIntegrations.GoogleCalendar.icon} alt={calendarIntegrations.GoogleCalendar.name} />
        </Tooltip>
      ))}
    </Layout>
  );
};

export default Page;