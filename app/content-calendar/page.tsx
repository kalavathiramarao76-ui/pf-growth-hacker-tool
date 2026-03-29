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
          // Provide feedback to the user
          alert('You have been connected to Google Calendar. Your events are being synced.');
          setConnectionStatus('Connected to Google Calendar');
        });
      } catch (error) {
        console.error('Error connecting to Google Calendar:', error);
        // Provide feedback to the user
        alert('Error connecting to Google Calendar. Please try again.');
        setConnectionStatus('Error connecting to Google Calendar');
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
        // Provide feedback to the user
        alert('Error fetching Google Calendar events. Please try again.');
        setConnectionStatus('Error fetching Google Calendar events');
        return [];
      }
    },
    disconnect: () => {
      try {
        // Confirm disconnection before proceeding
        if (confirm('Are you sure you want to disconnect from Google Calendar?')) {
          // Implement Google Calendar disconnection logic
          localStorage.removeItem('googleCalendarToken');
          setEvents([]);
          setConnectionStatus('Disconnected from Google Calendar');
          alert('You have been disconnected from Google Calendar.');
        }
      } catch (error) {
        console.error('Error disconnecting from Google Calendar:', error);
        // Provide feedback to the user
        alert('Error disconnecting from Google Calendar. Please try again.');
        setConnectionStatus('Error disconnecting from Google Calendar');
      }
    },
    name: 'Google Calendar',
    icon: 'https://developers.google.com/calendar/images/logo-googlecalendar-32px.png',
    description: 'Connect your Google Calendar account to sync events',
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
    isAuthenticated: () => {
      const token = localStorage.getItem('googleCalendarToken');
      return token !== null;
    },
    onboardingSteps: [
      {
        title: 'Step 1: Connect your Google Calendar account',
        description: 'Click the "Connect" button to authenticate with Google Calendar',
        action: () => {
          // Redirect to Google Calendar authentication page
          window.location.href = calendarIntegrations.GoogleCalendar.authUrl;
        },
      },
      {
        title: 'Step 2: Authorize access to your Google Calendar account',
        description: 'Grant permission for our application to access your Google Calendar account',
        action: () => {
          // Redirect to Google Calendar authorization page
          window.location.href = calendarIntegrations.GoogleCalendar.authUrl;
        },
      },
      {
        title: 'Step 3: Sync your Google Calendar events',
        description: 'Our application will automatically sync your Google Calendar events',
        action: () => {
          // Sync Google Calendar events
          calendarIntegrations.GoogleCalendar.getEvents().then((events) => {
            setEvents(events);
          });
        },
      },
    ],
  },
};

const [events, setEvents] = useState<CalendarEvent[]>([]);
const [connectionStatus, setConnectionStatus] = useState<string>('');

function Page() {
  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar events={events} />
      </DndProvider>
      <Tooltip>
        <Image src={calendarIntegrations.GoogleCalendar.icon} alt="Google Calendar" />
        {connectionStatus}
      </Tooltip>
      <button onClick={() => calendarIntegrations.GoogleCalendar.connect('token')}>
        Connect to Google Calendar
      </button>
      <button onClick={calendarIntegrations.GoogleCalendar.disconnect}>
        Disconnect from Google Calendar
      </button>
    </Layout>
  );
}

export default Page;