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
    isAuthenticated: () => {
      return localStorage.getItem('outlookCalendarToken') !== null;
    },
    name: 'Outlook Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281765.png',
    description: 'Connect your Outlook Calendar to view and manage your events',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  },
};

const Page = () => {
  const pathname = usePathname();

  return (
    <Layout>
      <SEO
        title="AI-Powered Content Optimizer - Content Calendar"
        description="Optimize your content with our AI-powered content optimizer and manage your events with our integrated calendar"
        keywords={[
          'content optimizer',
          'ai-powered',
          'content calendar',
          'google calendar',
          'outlook calendar',
        ]}
        meta={[
          {
            name: 'robots',
            content: 'index, follow',
          },
          {
            name: 'og:title',
            content: 'AI-Powered Content Optimizer - Content Calendar',
          },
          {
            name: 'og:description',
            content: 'Optimize your content with our AI-powered content optimizer and manage your events with our integrated calendar',
          },
          {
            name: 'og:url',
            content: pathname,
          },
          {
            name: 'og:image',
            content: 'https://example.com/image.jpg',
          },
          {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
          {
            name: 'twitter:title',
            content: 'AI-Powered Content Optimizer - Content Calendar',
          },
          {
            name: 'twitter:description',
            content: 'Optimize your content with our AI-powered content optimizer and manage your events with our integrated calendar',
          },
          {
            name: 'twitter:image',
            content: 'https://example.com/image.jpg',
          },
        ]}
      />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={[]}
          onEventDrop={(event: CalendarEvent) => console.log(event)}
          onEventResize={(event: CalendarEvent) => console.log(event)}
        />
      </DndProvider>
      <Tooltip />
      <Image src="/image.jpg" alt="Image" width={100} height={100} />
      <Socket />
      <StripeCheckout />
    </Layout>
  );
};

export default Page;