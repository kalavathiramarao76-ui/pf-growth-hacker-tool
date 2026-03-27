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
  const [connectedCalendars, setConnectedCalendars] = useState(
    Object.keys(calendarIntegrations).filter((integration) =>
      localStorage.getItem(`${integration}Token`)
    )
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleConnect = async (integration: string) => {
    setConnecting(true);
    const token = await authenticate(integration);
    if (token) {
      calendarIntegrations[integration].connect(token);
      setConnectedCalendars((prevCalendars) => [...prevCalendars, integration]);
    }
    setConnecting(false);
  };

  const handleDisconnect = (integration: string) => {
    setDisconnecting(true);
    calendarIntegrations[integration].disconnect();
    setConnectedCalendars((prevCalendars) =>
      prevCalendars.filter((calendar) => calendar !== integration)
    );
    setDisconnecting(false);
  };

  const authenticate = async (integration: string) => {
    const authUrl = calendarIntegrations[integration].authUrl;
    const clientId = 'YOUR_CLIENT_ID';
    const redirectUri = 'YOUR_REDIRECT_URI';
    const scope = 'YOUR_SCOPE';
    const url = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });
    const token = await response.text();
    return token;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const allEvents: CalendarEvent[] = [];
      for (const integration of connectedCalendars) {
        const events = await calendarIntegrations[integration].getEvents();
        allEvents.push(...events);
      }
      setEvents(allEvents);
    };
    fetchEvents();
  }, [connectedCalendars]);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar events={events} />
        {Object.keys(calendarIntegrations).map((integration) => (
          <div key={integration}>
            <Image src={calendarIntegrations[integration].icon} alt={integration} />
            <span>{calendarIntegrations[integration].name}</span>
            {connectedCalendars.includes(integration) ? (
              <button onClick={() => handleDisconnect(integration)} disabled={disconnecting}>
                {disconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            ) : (
              <button onClick={() => handleConnect(integration)} disabled={connecting}>
                {connecting ? 'Connecting...' : 'Connect'}
              </button>
            )}
          </div>
        ))}
      </DndProvider>
    </Layout>
  );
};

export default App;