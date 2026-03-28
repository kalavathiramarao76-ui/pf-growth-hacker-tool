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
    icon: 'https://developers.google.com/identity/images/g-logo.png',
    description: 'Connect your Google Calendar to view and manage your events',
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
    onboardingSteps: [
      {
        title: 'Step 1: Connect your Google Calendar',
        description: 'Click the "Connect" button to authenticate with Google Calendar',
        action: () => {
          window.location.href = calendarIntegrations.GoogleCalendar.authUrl;
        },
      },
    ],
  },
  MicrosoftOutlook: {
    connect: (token: string) => {
      try {
        // Implement Microsoft Outlook connection logic
        localStorage.setItem('microsoftOutlookToken', token);
        // Automatically retrieve events after connecting
        calendarIntegrations.MicrosoftOutlook.getEvents().then((events) => {
          setEvents(events);
        });
      } catch (error) {
        console.error('Error connecting to Microsoft Outlook:', error);
      }
    },
    getEvents: async () => {
      try {
        // Implement Microsoft Outlook event retrieval logic
        const token = localStorage.getItem('microsoftOutlookToken');
        if (token) {
          const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Error fetching Microsoft Outlook events: ${response.status}`);
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
        console.error('Error fetching Microsoft Outlook events:', error);
        return [];
      }
    },
    disconnect: () => {
      try {
        // Implement Microsoft Outlook disconnection logic
        if (confirm('Are you sure you want to disconnect from Microsoft Outlook?')) {
          localStorage.removeItem('microsoftOutlookToken');
          // Automatically clear events after disconnecting
          setEvents([]);
          setConnected(false);
        }
      } catch (error) {
        console.error('Error disconnecting from Microsoft Outlook:', error);
      }
    },
    isAuthenticated: () => {
      return localStorage.getItem('microsoftOutlookToken') !== null;
    },
    name: 'Microsoft Outlook',
    icon: 'https://developer.microsoft.com/en-us/graph/images/microsoft-graph-logo.png',
    description: 'Connect your Microsoft Outlook to view and manage your events',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    onboardingSteps: [
      {
        title: 'Step 1: Connect your Microsoft Outlook',
        description: 'Click the "Connect" button to authenticate with Microsoft Outlook',
        action: () => {
          window.location.href = calendarIntegrations.MicrosoftOutlook.authUrl;
        },
      },
    ],
  },
  AppleCalendar: {
    connect: (token: string) => {
      try {
        // Implement Apple Calendar connection logic
        localStorage.setItem('appleCalendarToken', token);
        // Automatically retrieve events after connecting
        calendarIntegrations.AppleCalendar.getEvents().then((events) => {
          setEvents(events);
        });
      } catch (error) {
        console.error('Error connecting to Apple Calendar:', error);
      }
    },
    getEvents: async () => {
      try {
        // Implement Apple Calendar event retrieval logic
        const token = localStorage.getItem('appleCalendarToken');
        if (token) {
          const response = await fetch('https://api.apple.com/calendars/events', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Error fetching Apple Calendar events: ${response.status}`);
          }
          const data = await response.json();
          return data.events.map((event: any) => ({
            id: event.id,
            title: event.title,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
          }));
        }
        return [];
      } catch (error) {
        console.error('Error fetching Apple Calendar events:', error);
        return [];
      }
    },
    disconnect: () => {
      try {
        // Implement Apple Calendar disconnection logic
        if (confirm('Are you sure you want to disconnect from Apple Calendar?')) {
          localStorage.removeItem('appleCalendarToken');
          // Automatically clear events after disconnecting
          setEvents([]);
          setConnected(false);
        }
      } catch (error) {
        console.error('Error disconnecting from Apple Calendar:', error);
      }
    },
    isAuthenticated: () => {
      return localStorage.getItem('appleCalendarToken') !== null;
    },
    name: 'Apple Calendar',
    icon: 'https://developer.apple.com/assets/elements/icons/apple-logo/apple-logo.png',
    description: 'Connect your Apple Calendar to view and manage your events',
    authUrl: 'https://id.apple.com/auth/authorize',
    onboardingSteps: [
      {
        title: 'Step 1: Connect your Apple Calendar',
        description: 'Click the "Connect" button to authenticate with Apple Calendar',
        action: () => {
          window.location.href = calendarIntegrations.AppleCalendar.authUrl;
        },
      },
    ],
  },
};

const [events, setEvents] = useState<CalendarEvent[]>([]);
const [connected, setConnected] = useState(false);
const [selectedCalendar, setSelectedCalendar] = useState<CalendarIntegration | null>(null);

useEffect(() => {
  const storedToken = localStorage.getItem('googleCalendarToken');
  if (storedToken) {
    calendarIntegrations.GoogleCalendar.connect(storedToken);
  }
}, []);

const handleConnect = (calendar: CalendarIntegration) => {
  setSelectedCalendar(calendar);
  window.location.href = calendar.authUrl;
};

const handleDisconnect = () => {
  if (selectedCalendar) {
    selectedCalendar.disconnect();
  }
};

const handleGetEvents = () => {
  if (selectedCalendar) {
    selectedCalendar.getEvents().then((events) => {
      setEvents(events);
    });
  }
};

return (
  <Layout>
    <SEO title="Content Calendar" />
    <DndProvider backend={HTML5Backend}>
      <Calendar events={events} />
      <div>
        {Object.values(calendarIntegrations).map((calendar) => (
          <div key={calendar.name}>
            <Image src={calendar.icon} alt={calendar.name} />
            <p>{calendar.description}</p>
            {calendar.isAuthenticated() ? (
              <button onClick={handleDisconnect}>Disconnect</button>
            ) : (
              <button onClick={() => handleConnect(calendar)}>Connect</button>
            )}
          </div>
        ))}
      </div>
      <Tooltip>
        <p>Connect your calendar to view and manage your events</p>
      </Tooltip>
      <Socket />
      <StripeCheckout />
    </DndProvider>
  </Layout>
);