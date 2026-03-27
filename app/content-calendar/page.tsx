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

const ContentCalendarPage = () => {
  const pathname = usePathname();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (selectedIntegration) {
        const integration = calendarIntegrations[selectedIntegration];
        const fetchedEvents = await integration.getEvents();
        setEvents(fetchedEvents);
      }
    };
    fetchEvents();
  }, [selectedIntegration]);

  return (
    <Layout>
      <SEO
        title="AI-Powered Content Optimizer - Content Calendar"
        description="Optimize your content with our AI-powered content optimizer and manage your events with our integrated calendar"
        keywords="content optimizer, ai-powered, content calendar, event management"
        canonicalUrl="https://example.com/content-calendar"
        openGraph={{
          type: 'website',
          url: 'https://example.com/content-calendar',
          title: 'AI-Powered Content Optimizer - Content Calendar',
          description: 'Optimize your content with our AI-powered content optimizer and manage your events with our integrated calendar',
          images: [
            {
              url: 'https://example.com/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'AI-Powered Content Optimizer - Content Calendar',
            },
          ],
        }}
        twitter={{
          handle: '@example',
          site: '@example',
          cardType: 'summary_large_image',
        }}
      />
      <DndProvider backend={HTML5Backend}>
        <Calendar events={events} />
      </DndProvider>
      <div>
        {Object.keys(calendarIntegrations).map((integration) => (
          <div key={integration}>
            <Image src={calendarIntegrations[integration].icon} alt={calendarIntegrations[integration].name} />
            <span>{calendarIntegrations[integration].name}</span>
            <button onClick={() => setSelectedIntegration(integration)}>Connect</button>
          </div>
        ))}
      </div>
      <Tooltip>
        <span>Connect your calendar to view and manage your events</span>
      </Tooltip>
      <Socket />
      <StripeCheckout />
    </Layout>
  );
};

export default ContentCalendarPage;