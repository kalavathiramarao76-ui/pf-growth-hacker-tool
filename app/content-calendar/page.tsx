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
      // Implement Yahoo Calendar connection logic
      localStorage.setItem('yahooCalendarToken', token);
    },
    getEvents: async () => {
      // Implement Yahoo Calendar event retrieval logic
      const token = localStorage.getItem('yahooCalendarToken');
      if (token) {
        const response = await fetch('https://api.login.yahoo.com/oauth2/get_token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        return data.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
      }
      return [];
    },
    disconnect: () => {
      // Implement Yahoo Calendar disconnection logic
      localStorage.removeItem('yahooCalendarToken');
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
        setIsAuthenticated(true);
      }
    }
  };

  const handleDisconnect = (calendar: string) => {
    const integration = calendarIntegrations[calendar];
    if (integration) {
      integration.disconnect();
      setIsAuthenticated(false);
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
    const calendar = localStorage.getItem('selectedCalendar');
    if (calendar) {
      setSelectedCalendar(calendar);
    }
  }, []);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-screen">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold">Content Calendar</h1>
            <div className="flex items-center">
              {Object.keys(calendarIntegrations).map((calendar) => (
                <div key={calendar} className="mr-4">
                  <Image src={calendarIntegrations[calendar].icon} width={24} height={24} />
                  <span className="ml-2">{calendarIntegrations[calendar].name}</span>
                  {calendarIntegrations[calendar].isAuthenticated() ? (
                    <button
                      className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDisconnect(calendar)}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleConnect(calendar)}
                    >
                      Connect
                    </button>
                  )}
                  <button
                    className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleGetEvents(calendar)}
                  >
                    Get Events
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Calendar events={events} />
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default Page;