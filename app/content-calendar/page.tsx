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
  const [connectedCalendar, setConnectedCalendar] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async (calendarName: string) => {
    setIsConnecting(true);
    const calendar = calendarIntegrations[calendarName];
    if (calendar) {
      const token = await getToken(calendar.authUrl);
      calendar.connect(token);
      setConnectedCalendar(calendarName);
    }
    setIsConnecting(false);
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    if (connectedCalendar) {
      const calendar = calendarIntegrations[connectedCalendar];
      if (calendar) {
        calendar.disconnect();
        setConnectedCalendar(null);
      }
    }
    setIsDisconnecting(false);
  };

  const getToken = async (authUrl: string) => {
    const response = await fetch(authUrl);
    const data = await response.json();
    return data.access_token;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (connectedCalendar) {
        const calendar = calendarIntegrations[connectedCalendar];
        if (calendar) {
          const events = await calendar.getEvents();
          setEvents(events);
        }
      }
    };
    fetchEvents();
  }, [connectedCalendar]);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar events={events} />
        {connectedCalendar ? (
          <div>
            <p>Connected to {connectedCalendar}</p>
            <button onClick={handleDisconnect} disabled={isDisconnecting}>
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
            </button>
          </div>
        ) : (
          <div>
            <h2>Connect a calendar</h2>
            {Object.keys(calendarIntegrations).map((calendarName) => (
              <div key={calendarName}>
                <Image src={calendarIntegrations[calendarName].icon} width={20} height={20} />
                <span>{calendarIntegrations[calendarName].name}</span>
                <button onClick={() => handleConnect(calendarName)} disabled={isConnecting}>
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        )}
      </DndProvider>
    </Layout>
  );
};

export default App;