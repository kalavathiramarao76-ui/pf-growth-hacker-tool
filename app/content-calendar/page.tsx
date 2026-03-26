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
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281766.png',
    description: 'Connect your Outlook Calendar to view and manage your events',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  },
  AppleCalendar: {
    connect: (token: string) => {
      // Implement Apple Calendar connection logic
      localStorage.setItem('appleCalendarToken', token);
    },
    getEvents: async () => {
      // Implement Apple Calendar event retrieval logic
      const token = localStorage.getItem('appleCalendarToken');
      if (token) {
        const response = await fetch('https://api.apple.com/calendars/v1/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        return data.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
        }));
      }
      return [];
    },
    disconnect: () => {
      // Implement Apple Calendar disconnection logic
      localStorage.removeItem('appleCalendarToken');
    },
    name: 'Apple Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281765.png',
    description: 'Connect your Apple Calendar to view and manage your events',
    authUrl: 'https://id.apple.com/auth/authorize',
  },
  MicrosoftExchange: {
    connect: (token: string) => {
      // Implement Microsoft Exchange connection logic
      localStorage.setItem('microsoftExchangeToken', token);
    },
    getEvents: async () => {
      // Implement Microsoft Exchange event retrieval logic
      const token = localStorage.getItem('microsoftExchangeToken');
      if (token) {
        const response = await fetch('https://outlook.office365.com/api/v2.0/me/events', {
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
      // Implement Microsoft Exchange disconnection logic
      localStorage.removeItem('microsoftExchangeToken');
    },
    name: 'Microsoft Exchange',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281767.png',
    description: 'Connect your Microsoft Exchange to view and manage your events',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  },
};

const Page = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<string>('GoogleCalendar');
  const pathname = usePathname();

  useEffect(() => {
    const fetchEvents = async () => {
      const calendar = calendarIntegrations[selectedCalendar];
      if (calendar) {
        const events = await calendar.getEvents();
        setEvents(events);
      }
    };
    fetchEvents();
  }, [selectedCalendar]);

  const handleCalendarChange = (calendar: string) => {
    setSelectedCalendar(calendar);
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar events={events} />
        <div>
          {Object.keys(calendarIntegrations).map((calendar) => (
            <button key={calendar} onClick={() => handleCalendarChange(calendar)}>
              <Image src={calendarIntegrations[calendar].icon} width={20} height={20} />
              {calendarIntegrations[calendar].name}
            </button>
          ))}
        </div>
      </DndProvider>
      <Socket />
    </Layout>
  );
};

export default Page;