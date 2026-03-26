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
        const response = await fetch('https://api.login.yahoo.com/oauth2/request_auth', {
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
    name: 'Yahoo Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281767.png',
    description: 'Connect your Yahoo Calendar to view and manage your events',
    authUrl: 'https://api.login.yahoo.com/oauth2/request_auth',
  },
};

const App = () => {
  const [selectedCalendar, setSelectedCalendar] = useState<string>('');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  const handleConnect = async (calendar: string) => {
    const authUrl = calendarIntegrations[calendar].authUrl;
    const response = await fetch(authUrl, {
      method: 'GET',
      redirect: 'follow',
    });
    const url = response.url;
    window.location.href = url;
  };

  const handleGetEvents = async () => {
    if (selectedCalendar) {
      const events = await calendarIntegrations[selectedCalendar].getEvents();
      setEvents(events);
    }
  };

  const handleDisconnect = () => {
    if (selectedCalendar) {
      calendarIntegrations[selectedCalendar].disconnect();
      setConnected(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(`${selectedCalendar}Token`);
    if (token) {
      setConnected(true);
    }
  }, [selectedCalendar]);

  return (
    <Layout>
      <SEO title="AI-Powered Content Optimizer" />
      <DndProvider backend={HTML5Backend}>
        <div>
          <h1>Calendar Integrations</h1>
          <ul>
            {Object.keys(calendarIntegrations).map((calendar) => (
              <li key={calendar}>
                <Image src={calendarIntegrations[calendar].icon} width={20} height={20} />
                <span>{calendarIntegrations[calendar].name}</span>
                <button onClick={() => handleConnect(calendar)}>Connect</button>
              </li>
            ))}
          </ul>
          <select value={selectedCalendar} onChange={(e) => setSelectedCalendar(e.target.value)}>
            <option value="">Select a calendar</option>
            {Object.keys(calendarIntegrations).map((calendar) => (
              <option key={calendar} value={calendar}>
                {calendarIntegrations[calendar].name}
              </option>
            ))}
          </select>
          <button onClick={handleGetEvents}>Get Events</button>
          <button onClick={handleDisconnect}>Disconnect</button>
          {connected && (
            <Calendar events={events} />
          )}
        </div>
      </DndProvider>
      <Socket />
      <StripeCheckout />
      <Tooltip />
    </Layout>
  );
};

export default App;