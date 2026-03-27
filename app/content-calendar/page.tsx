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

const App = () => {
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async (calendarName: string) => {
    setIsConnecting(true);
    const token = await getToken(calendarName);
    if (token) {
      calendarIntegrations[calendarName].connect(token);
      setConnectedCalendars([...connectedCalendars, calendarName]);
    }
    setIsConnecting(false);
  };

  const handleDisconnect = async (calendarName: string) => {
    setIsDisconnecting(true);
    calendarIntegrations[calendarName].disconnect();
    setConnectedCalendars(connectedCalendars.filter((calendar) => calendar !== calendarName));
    setIsDisconnecting(false);
  };

  const getToken = async (calendarName: string) => {
    const authUrl = calendarIntegrations[calendarName].authUrl;
    const response = await fetch(authUrl, {
      method: 'GET',
      redirect: 'follow',
    });
    const url = new URL(response.url);
    const token = url.searchParams.get('token');
    return token;
  };

  const fetchEvents = async () => {
    const allEvents: CalendarEvent[] = [];
    for (const calendarName of connectedCalendars) {
      const events = await calendarIntegrations[calendarName].getEvents();
      allEvents.push(...events);
    }
    setEvents(allEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, [connectedCalendars]);

  return (
    <Layout>
      <SEO title="AI-Powered Content Optimizer" />
      <DndProvider backend={HTML5Backend}>
        <Calendar events={events} />
        {Object.keys(calendarIntegrations).map((calendarName) => (
          <div key={calendarName}>
            <Image src={calendarIntegrations[calendarName].icon} alt={calendarIntegrations[calendarName].name} />
            <span>{calendarIntegrations[calendarName].name}</span>
            {connectedCalendars.includes(calendarName) ? (
              <button onClick={() => handleDisconnect(calendarName)} disabled={isDisconnecting}>
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            ) : (
              <button onClick={() => handleConnect(calendarName)} disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
            )}
            <Tooltip description={calendarIntegrations[calendarName].description} />
          </div>
        ))}
      </DndProvider>
      <Socket />
      <StripeCheckout />
    </Layout>
  );
};

export default App;