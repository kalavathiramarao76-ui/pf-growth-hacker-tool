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
};

const CalendarPage = () => {
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (calendar: string) => {
    setIsConnecting(true);
    try {
      const token = await getAuthorizationToken(calendar);
      calendarIntegrations[calendar].connect(token);
      const events = await calendarIntegrations[calendar].getEvents();
      setEvents(events);
      setSelectedCalendar(calendar);
    } catch (error) {
      setError('Error connecting to calendar');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    calendarIntegrations[selectedCalendar as string].disconnect();
    setSelectedCalendar(null);
    setEvents([]);
  };

  const getAuthorizationToken = async (calendar: string) => {
    const authUrl = calendarIntegrations[calendar].authUrl;
    const response = await fetch(authUrl, {
      method: 'GET',
      redirect: 'follow',
    });
    const url = new URL(response.url);
    const token = url.searchParams.get('token');
    return token as string;
  };

  useEffect(() => {
    if (selectedCalendar) {
      const intervalId = setInterval(async () => {
        try {
          const events = await calendarIntegrations[selectedCalendar].getEvents();
          setEvents(events);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [selectedCalendar]);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="container">
          <h1>Content Calendar</h1>
          <div className="calendar-integrations">
            {Object.keys(calendarIntegrations).map((calendar) => (
              <div key={calendar} className="calendar-integration">
                <Image src={calendarIntegrations[calendar].icon} alt={calendarIntegrations[calendar].name} />
                <h2>{calendarIntegrations[calendar].name}</h2>
                <p>{calendarIntegrations[calendar].description}</p>
                {calendarIntegrations[calendar].isAuthenticated() ? (
                  <button onClick={handleDisconnect}>Disconnect</button>
                ) : (
                  <button onClick={() => handleConnect(calendar)}>Connect</button>
                )}
              </div>
            ))}
          </div>
          {selectedCalendar && (
            <div className="calendar-events">
              <h2>Events</h2>
              <Calendar events={events} />
            </div>
          )}
          {isConnecting && <p>Connecting to calendar...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </DndProvider>
    </Layout>
  );
};

export default CalendarPage;