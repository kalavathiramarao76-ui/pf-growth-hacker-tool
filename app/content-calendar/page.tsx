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
        if (confirm('Are you sure you want to disconnect from Google Calendar?')) {
          localStorage.removeItem('googleCalendarToken');
          // Automatically clear events after disconnecting
          setEvents([]);
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
    icon: 'https://www.google.com/calendar/images/favicon_v2016.ico',
    description: 'Connect your Google Calendar to view and manage your events',
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
    onboardingSteps: [
      {
        title: 'Step 1: Connect your Google Calendar',
        description: 'Click the "Connect" button to authenticate with Google Calendar',
        action: () => {
          window.open(calendarIntegrations.GoogleCalendar.authUrl, '_blank');
        },
      },
      {
        title: 'Step 2: Authorize access',
        description: 'Grant permission for our app to access your Google Calendar',
        action: () => {
          // Implement authorization logic
        },
      },
      {
        title: 'Step 3: Verify connection',
        description: 'Verify that your Google Calendar is connected and events are being retrieved',
        action: () => {
          calendarIntegrations.GoogleCalendar.getEvents().then((events) => {
            setEvents(events);
          });
        },
      },
    ],
  },
};

const [connected, setConnected] = useState(false);
const [events, setEvents] = useState<CalendarEvent[]>([]);

useEffect(() => {
  if (calendarIntegrations.GoogleCalendar.isAuthenticated()) {
    setConnected(true);
    calendarIntegrations.GoogleCalendar.getEvents().then((events) => {
      setEvents(events);
    });
  }
}, []);

const handleConnect = () => {
  calendarIntegrations.GoogleCalendar.onboardingSteps[0].action();
};

const handleDisconnect = () => {
  calendarIntegrations.GoogleCalendar.disconnect();
};

const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);

const handleDisconnectModalOpen = () => {
  setDisconnectModalOpen(true);
};

const handleDisconnectModalClose = () => {
  setDisconnectModalOpen(false);
};

const handleConfirmDisconnect = () => {
  calendarIntegrations.GoogleCalendar.disconnect();
  setDisconnectModalOpen(false);
};

return (
  <Layout>
    <SEO title="Content Calendar" />
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <h1>Content Calendar</h1>
        <div className="calendar-container">
          <Calendar events={events} />
        </div>
        <div className="connection-status">
          {connected ? (
            <div>
              <p>Connected to Google Calendar</p>
              <button onClick={handleDisconnectModalOpen}>Disconnect</button>
            </div>
          ) : (
            <div>
              <p>Not connected to Google Calendar</p>
              <button onClick={handleConnect}>Connect</button>
            </div>
          )}
        </div>
        {disconnectModalOpen && (
          <div className="disconnect-modal">
            <h2>Disconnect from Google Calendar</h2>
            <p>Are you sure you want to disconnect from Google Calendar?</p>
            <button onClick={handleConfirmDisconnect}>Confirm</button>
            <button onClick={handleDisconnectModalClose}>Cancel</button>
          </div>
        )}
      </div>
    </DndProvider>
  </Layout>
);