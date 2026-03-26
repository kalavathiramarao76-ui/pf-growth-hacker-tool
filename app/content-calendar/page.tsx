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
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281764.png',
    description: 'Connect your Outlook Calendar to view and manage your events',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  },
};

const Plan = {
  FREE: 'free',
  PREMIUM: 'premium',
};

const Pricing = {
  [Plan.FREE]: 0,
  [Plan.PREMIUM]: 9.99,
};

const onToken = (token: any) => {
  // Send token to server to charge customer
  fetch('/api/charge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Update user plan to premium
        localStorage.setItem('plan', Plan.PREMIUM);
        window.location.reload();
      } else {
        alert('Payment failed');
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const UpgradeButton = () => {
  const [plan, setPlan] = useState(Plan.FREE);

  useEffect(() => {
    const storedPlan = localStorage.getItem('plan');
    if (storedPlan) {
      setPlan(storedPlan);
    }
  }, []);

  if (plan === Plan.PREMIUM) {
    return <p>You are on the premium plan</p>;
  }

  return (
    <StripeCheckout
      token={onToken}
      stripeKey="YOUR_STRIPE_PUBLIC_KEY"
      name="AI-Powered Content Optimizer"
      description="Upgrade to premium plan"
      amount={Pricing[Plan.PREMIUM] * 100}
      currency="USD"
    >
      <button>Upgrade to Premium ($9.99/month)</button>
    </StripeCheckout>
  );
};

const Page = () => {
  const pathname = usePathname();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (selectedCalendar) {
        const calendar = calendarIntegrations[selectedCalendar];
        const events = await calendar.getEvents();
        setEvents(events);
      }
    };
    fetchEvents();
  }, [selectedCalendar]);

  const handleCalendarSelect = (calendar: string) => {
    setSelectedCalendar(calendar);
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar events={events} />
        <div>
          {Object.keys(calendarIntegrations).map((calendar) => (
            <button key={calendar} onClick={() => handleCalendarSelect(calendar)}>
              {calendarIntegrations[calendar].name}
            </button>
          ))}
        </div>
        <UpgradeButton />
      </DndProvider>
    </Layout>
  );
};

export default Page;