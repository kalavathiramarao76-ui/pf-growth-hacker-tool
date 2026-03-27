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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleConnect = async (calendar: string) => {
    const authUrl = calendarIntegrations[calendar].authUrl;
    const clientId = 'YOUR_CLIENT_ID';
    const redirectUri = 'YOUR_REDIRECT_URI';
    const scope = 'YOUR_SCOPE';
    const url = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    window.open(url, '_blank');
  };

  const handleDisconnect = () => {
    calendarIntegrations[connectedCalendar as string].disconnect();
    setConnectedCalendar(null);
    setEvents([]);
  };

  const handleGetEvents = async () => {
    if (connectedCalendar) {
      const events = await calendarIntegrations[connectedCalendar].getEvents();
      setEvents(events);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('googleCalendarToken') || localStorage.getItem('outlookCalendarToken');
    if (token) {
      setIsAuthenticated(true);
      if (localStorage.getItem('googleCalendarToken')) {
        setConnectedCalendar('GoogleCalendar');
      } else {
        setConnectedCalendar('OutlookCalendar');
      }
    }
  }, []);

  return (
    <Layout>
      <SEO title="AI-Powered Content Optimizer" />
      <DndProvider backend={HTML5Backend}>
        <Calendar events={events} />
        {connectedCalendar ? (
          <div>
            <button onClick={handleDisconnect}>Disconnect {connectedCalendar}</button>
            <button onClick={handleGetEvents}>Get Events</button>
          </div>
        ) : (
          <div>
            {Object.keys(calendarIntegrations).map((calendar) => (
              <div key={calendar}>
                <Image src={calendarIntegrations[calendar].icon} width={20} height={20} />
                <span>{calendarIntegrations[calendar].name}</span>
                <button onClick={() => handleConnect(calendar)}>Connect</button>
              </div>
            ))}
          </div>
        )}
        <Tooltip />
      </DndProvider>
      <Socket />
      <StripeCheckout />
    </Layout>
  );
};

export default App;