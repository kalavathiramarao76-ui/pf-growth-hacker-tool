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
  onboardingSteps: {
    title: string;
    description: string;
    action: () => void;
  }[];
}

// Calendar Integrations
const calendarIntegrations: { [key: string]: CalendarIntegration } = {
  GoogleCalendar: {
    connect: (token: string) => {
      try {
        // Implement Google Calendar connection logic
        localStorage.setItem('googleCalendarToken', token);
        // Automatically retrieve events after connecting
        calendarIntegrations.GoogleCalendar.getEvents().then((events) => {
          setEvents(events);
        });
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
        // Automatically clear events after disconnecting
        setEvents([]);
        // Prompt user to confirm disconnection
        if (confirm('Are you sure you want to disconnect from Google Calendar?')) {
          // Disconnect and clear events
          setConnected(false);
        }
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
    onboardingSteps: [
      {
        title: 'Step 1: Connect your Google Calendar',
        description: 'Click the "Connect" button to authorize access to your Google Calendar',
        action: () => {
          window.open(calendarIntegrations.GoogleCalendar.authUrl, '_blank');
        },
      },
      {
        title: 'Step 2: Authenticate with Google',
        description: 'Enter your Google account credentials to authenticate',
        action: () => {
          // Handle authentication logic
        },
      },
      {
        title: 'Step 3: Authorize access to your Google Calendar',
        description: 'Click "Allow" to grant access to your Google Calendar',
        action: () => {
          // Handle authorization logic
        },
      },
    ],
  },
};

const [events, setEvents] = useState<CalendarEvent[]>([]);
const [connected, setConnected] = useState(false);

useEffect(() => {
  if (calendarIntegrations.GoogleCalendar.isAuthenticated()) {
    setConnected(true);
    calendarIntegrations.GoogleCalendar.getEvents().then((events) => {
      setEvents(events);
    });
  }
}, []);

const handleConnect = () => {
  // Prompt user to confirm connection
  if (confirm('Are you sure you want to connect to Google Calendar?')) {
    // Connect and retrieve events
    calendarIntegrations.GoogleCalendar.connect('');
    setConnected(true);
  }
};

const handleDisconnect = () => {
  calendarIntegrations.GoogleCalendar.disconnect();
};

const App = () => {
  return (
    <Layout>
      <SEO title="AI-Powered Content Optimizer" />
      <DndProvider backend={HTML5Backend}>
        <Calendar events={events} />
        {connected ? (
          <button onClick={handleDisconnect}>Disconnect from Google Calendar</button>
        ) : (
          <button onClick={handleConnect}>Connect to Google Calendar</button>
        )}
        <Tooltip>
          <Image src={calendarIntegrations.GoogleCalendar.icon} alt={calendarIntegrations.GoogleCalendar.name} />
        </Tooltip>
      </DndProvider>
    </Layout>
  );
};

export default App;