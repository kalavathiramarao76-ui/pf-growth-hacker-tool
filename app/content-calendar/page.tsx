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
  AppleCalendar: {
    connect: (token: string) => {
      // Implement Apple Calendar connection logic
      localStorage.setItem('appleCalendarToken', token);
    },
    getEvents: async () => {
      // Implement Apple Calendar event retrieval logic
      const token = localStorage.getItem('appleCalendarToken');
      if (token) {
        const response = await fetch('https://api.apple.com/calendars/events', {
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
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281766.png',
    description: 'Connect your Apple Calendar to view and manage your events',
    authUrl: 'https://id.apple.com/auth/authorize',
  },
  ICalCalendar: {
    connect: (token: string) => {
      // Implement ICal Calendar connection logic
      localStorage.setItem('iCalCalendarToken', token);
    },
    getEvents: async () => {
      // Implement ICal Calendar event retrieval logic
      const token = localStorage.getItem('iCalCalendarToken');
      if (token) {
        const response = await fetch('https://api.icloud.com/calendars/events', {
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
      // Implement ICal Calendar disconnection logic
      localStorage.removeItem('iCalCalendarToken');
    },
    name: 'iCal Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281767.png',
    description: 'Connect your iCal Calendar to view and manage your events',
    authUrl: 'https://id.apple.com/auth/authorize',
  },
  ExchangeCalendar: {
    connect: (token: string) => {
      // Implement Exchange Calendar connection logic
      localStorage.setItem('exchangeCalendarToken', token);
    },
    getEvents: async () => {
      // Implement Exchange Calendar event retrieval logic
      const token = localStorage.getItem('exchangeCalendarToken');
      if (token) {
        const response = await fetch('https://outlook.office.com/api/v2.0/me/events', {
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
      // Implement Exchange Calendar disconnection logic
      localStorage.removeItem('exchangeCalendarToken');
    },
    name: 'Exchange Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281768.png',
    description: 'Connect your Exchange Calendar to view and manage your events',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  },
};

const ContentCalendarPage = () => {
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>([]);

  const handleConnectCalendar = (calendar: string) => {
    const authUrl = calendarIntegrations[calendar].authUrl;
    window.open(authUrl, '_blank');
  };

  const handleDisconnectCalendar = (calendar: string) => {
    calendarIntegrations[calendar].disconnect();
    setConnectedCalendars(connectedCalendars.filter((c) => c !== calendar));
  };

  const handleGetEvents = async () => {
    if (selectedCalendar) {
      const events = await calendarIntegrations[selectedCalendar].getEvents();
      setEvents(events);
    }
  };

  useEffect(() => {
    const storedConnectedCalendars = localStorage.getItem('connectedCalendars');
    if (storedConnectedCalendars) {
      setConnectedCalendars(JSON.parse(storedConnectedCalendars));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('connectedCalendars', JSON.stringify(connectedCalendars));
  }, [connectedCalendars]);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-screen">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Content Calendar</h1>
            <div className="flex items-center">
              {Object.keys(calendarIntegrations).map((calendar) => (
                <div key={calendar} className="mr-4">
                  <Image src={calendarIntegrations[calendar].icon} width={24} height={24} />
                  <span className="ml-2">{calendarIntegrations[calendar].name}</span>
                  {connectedCalendars.includes(calendar) ? (
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleDisconnectCalendar(calendar)}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      onClick={() => handleConnectCalendar(calendar)}
                    >
                      Connect
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 p-4">
            <Calendar
              events={events}
              onEventClick={(event) => console.log(event)}
              onSelectCalendar={(calendar) => setSelectedCalendar(calendar)}
            />
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleGetEvents}
            >
              Get Events
            </button>
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;