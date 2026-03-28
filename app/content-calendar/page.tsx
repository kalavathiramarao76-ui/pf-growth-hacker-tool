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
          const response = await fetch('https://outlook.office.com/api/v2.0/me/events', {
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

const ContentCalendarPage = () => {
  const pathname = usePathname();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<string>('');

  useEffect(() => {
    const fetchEvents = async () => {
      if (selectedCalendar) {
        const calendarIntegration = calendarIntegrations[selectedCalendar];
        if (calendarIntegration) {
          const events = await calendarIntegration.getEvents();
          setEvents(events);
        }
      }
    };
    fetchEvents();
  }, [selectedCalendar]);

  return (
    <Layout>
      <SEO
        title="AI-Powered Content Optimizer - Content Calendar"
        description="Optimize your content calendar with AI-powered insights and recommendations"
        keywords="content calendar, ai-powered, optimization, seo"
        canonicalUrl="https://example.com/content-calendar"
        openGraph={{
          type: 'website',
          url: 'https://example.com/content-calendar',
          title: 'AI-Powered Content Optimizer - Content Calendar',
          description: 'Optimize your content calendar with AI-powered insights and recommendations',
          images: [
            {
              url: 'https://example.com/image.jpg',
              width: 800,
              height: 600,
              alt: 'Content Calendar Image',
            },
          ],
        }}
        twitter={{
          card: 'summary_large_image',
          site: '@example',
          title: 'AI-Powered Content Optimizer - Content Calendar',
          description: 'Optimize your content calendar with AI-powered insights and recommendations',
          images: ['https://example.com/image.jpg'],
        }}
      />
      <DndProvider backend={HTML5Backend}>
        <Calendar events={events} />
      </DndProvider>
      <div>
        {Object.keys(calendarIntegrations).map((calendar) => (
          <button key={calendar} onClick={() => setSelectedCalendar(calendar)}>
            {calendarIntegrations[calendar].name}
          </button>
        ))}
      </div>
      <Tooltip>
        <Image src={calendarIntegrations[selectedCalendar]?.icon} alt={calendarIntegrations[selectedCalendar]?.name} />
      </Tooltip>
      <Socket />
      <StripeCheckout />
    </Layout>
  );
};

export default ContentCalendarPage;