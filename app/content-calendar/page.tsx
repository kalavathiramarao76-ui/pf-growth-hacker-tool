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
import StripeCheckout from 'react-stripe-checkout';

// Unified Calendar API
interface CalendarIntegration {
  connect: (token: string) => void;
  getEvents: () => Promise<CalendarEvent[]>;
  disconnect: () => void;
  name: string;
  icon: string;
  description: string;
  authUrl: string;
  isAuthenticated: () => boolean;
}

// Calendar Integrations
const calendarIntegrations: { [key: string]: CalendarIntegration } = {
  GoogleCalendar: {
    connect: (token: string) => {
      try {
        // Implement Google Calendar connection logic
        localStorage.setItem('googleCalendarToken', token);
      } catch (error) {
        console.error('Error connecting to Google Calendar:', error);
      }
    },
    getEvents: async () => {
      try {
        // Implement Google Calendar event retrieval logic
        const token = localStorage.getItem('googleCalendarToken');
        if (token) {
          const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/events', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Error fetching Google Calendar events: ${response.status}`);
          }
          const data = await response.json();
          return data.items.map((event: any) => ({
            id: event.id,
            title: event.summary,
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
          }));
        }
        return [];
      } catch (error) {
        console.error('Error fetching Google Calendar events:', error);
        return [];
      }
    },
    disconnect: () => {
      try {
        // Implement Google Calendar disconnection logic
        localStorage.removeItem('googleCalendarToken');
      } catch (error) {
        console.error('Error disconnecting from Google Calendar:', error);
      }
    },
    isAuthenticated: () => {
      return localStorage.getItem('googleCalendarToken') !== null;
    },
    name: 'Google Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281764.png',
    description: 'Connect your Google Calendar to view and manage your events',
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
  },
  OutlookCalendar: {
    connect: (token: string) => {
      try {
        // Implement Outlook Calendar connection logic
        localStorage.setItem('outlookCalendarToken', token);
      } catch (error) {
        console.error('Error connecting to Outlook Calendar:', error);
      }
    },
    getEvents: async () => {
      try {
        // Implement Outlook Calendar event retrieval logic
        const token = localStorage.getItem('outlookCalendarToken');
        if (token) {
          const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Error fetching Outlook Calendar events: ${response.status}`);
          }
          const data = await response.json();
          return data.value.map((event: any) => ({
            id: event.id,
            title: event.subject,
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
          }));
        }
        return [];
      } catch (error) {
        console.error('Error fetching Outlook Calendar events:', error);
        return [];
      }
    },
    disconnect: () => {
      try {
        // Implement Outlook Calendar disconnection logic
        localStorage.removeItem('outlookCalendarToken');
      } catch (error) {
        console.error('Error disconnecting from Outlook Calendar:', error);
      }
    },
    isAuthenticated: () => {
      return localStorage.getItem('outlookCalendarToken') !== null;
    },
    name: 'Outlook Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281765.png',
    description: 'Connect your Outlook Calendar to view and manage your events',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  },
  AppleCalendar: {
    connect: (token: string) => {
      try {
        // Implement Apple Calendar connection logic
        localStorage.setItem('appleCalendarToken', token);
      } catch (error) {
        console.error('Error connecting to Apple Calendar:', error);
      }
    },
    getEvents: async () => {
      try {
        // Implement Apple Calendar event retrieval logic
        const token = localStorage.getItem('appleCalendarToken');
        if (token) {
          const response = await fetch('https://api.apple.com/calendars/events', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Error fetching Apple Calendar events: ${response.status}`);
          }
          const data = await response.json();
          return data.events.map((event: any) => ({
            id: event.id,
            title: event.title,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
          }));
        }
        return [];
      } catch (error) {
        console.error('Error fetching Apple Calendar events:', error);
        return [];
      }
    },
    disconnect: () => {
      try {
        // Implement Apple Calendar disconnection logic
        localStorage.removeItem('appleCalendarToken');
      } catch (error) {
        console.error('Error disconnecting from Apple Calendar:', error);
      }
    },
    isAuthenticated: () => {
      return localStorage.getItem('appleCalendarToken') !== null;
    },
    name: 'Apple Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281766.png',
    description: 'Connect your Apple Calendar to view and manage your events',
    authUrl: 'https://id.apple.com/auth/authorize',
  },
  YahooCalendar: {
    connect: (token: string) => {
      try {
        // Implement Yahoo Calendar connection logic
        localStorage.setItem('yahooCalendarToken', token);
      } catch (error) {
        console.error('Error connecting to Yahoo Calendar:', error);
      }
    },
    getEvents: async () => {
      try {
        // Implement Yahoo Calendar event retrieval logic
        const token = localStorage.getItem('yahooCalendarToken');
        if (token) {
          const response = await fetch('https://api.login.yahoo.com/oauth2/get_token', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Error fetching Yahoo Calendar events: ${response.status}`);
          }
          const data = await response.json();
          return data.events.map((event: any) => ({
            id: event.id,
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
          }));
        }
        return [];
      } catch (error) {
        console.error('Error fetching Yahoo Calendar events:', error);
        return [];
      }
    },
    disconnect: () => {
      try {
        // Implement Yahoo Calendar disconnection logic
        localStorage.removeItem('yahooCalendarToken');
      } catch (error) {
        console.error('Error disconnecting from Yahoo Calendar:', error);
      }
    },
    isAuthenticated: () => {
      return localStorage.getItem('yahooCalendarToken') !== null;
    },
    name: 'Yahoo Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281767.png',
    description: 'Connect your Yahoo Calendar to view and manage your events',
    authUrl: 'https://api.login.yahoo.com/oauth2/request_auth',
  },
};

const Page = () => {
  const [selectedCalendar, setSelectedCalendar] = useState<string>('');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleConnect = (calendar: string) => {
    const integration = calendarIntegrations[calendar];
    if (integration) {
      const token = prompt('Enter your token:');
      if (token) {
        integration.connect(token);
        setIsAuthenticated(integration.isAuthenticated());
      }
    }
  };

  const handleDisconnect = (calendar: string) => {
    const integration = calendarIntegrations[calendar];
    if (integration) {
      integration.disconnect();
      setIsAuthenticated(integration.isAuthenticated());
    }
  };

  const handleGetEvents = async (calendar: string) => {
    const integration = calendarIntegrations[calendar];
    if (integration) {
      const events = await integration.getEvents();
      setEvents(events);
    }
  };

  useEffect(() => {
    const pathname = usePathname();
    if (pathname) {
      const calendar = pathname.split('/').pop();
      if (calendar) {
        setSelectedCalendar(calendar);
      }
    }
  }, []);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          onConnect={(calendar) => handleConnect(calendar)}
          onDisconnect={(calendar) => handleDisconnect(calendar)}
          onGetEvents={(calendar) => handleGetEvents(calendar)}
          isAuthenticated={isAuthenticated}
          selectedCalendar={selectedCalendar}
          calendarIntegrations={calendarIntegrations}
        />
      </DndProvider>
      <Tooltip>
        <Image src="/tooltip-icon.png" alt="Tooltip icon" />
      </Tooltip>
      <Socket />
      <StripeCheckout />
    </Layout>
  );
};

export default Page;