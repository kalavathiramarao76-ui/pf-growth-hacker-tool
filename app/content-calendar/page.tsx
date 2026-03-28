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

const App = () => {
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarIntegration | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleConnect = (calendar: CalendarIntegration) => {
    const token = prompt('Enter your token');
    if (token) {
      calendar.connect(token);
      setSelectedCalendar(calendar);
      setIsAuthenticated(calendar.isAuthenticated());
    }
  };

  const handleDisconnect = () => {
    if (selectedCalendar) {
      selectedCalendar.disconnect();
      setSelectedCalendar(null);
      setIsAuthenticated(false);
    }
  };

  const handleGetEvents = async () => {
    if (selectedCalendar) {
      const events = await selectedCalendar.getEvents();
      setEvents(events);
    }
  };

  useEffect(() => {
    const storedCalendar = localStorage.getItem('selectedCalendar');
    if (storedCalendar) {
      const calendar = calendarIntegrations[storedCalendar];
      if (calendar) {
        setSelectedCalendar(calendar);
        setIsAuthenticated(calendar.isAuthenticated());
      }
    }
  }, []);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-screen">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Content Calendar</h1>
            <div className="flex items-center">
              {Object.values(calendarIntegrations).map((calendar) => (
                <button
                  key={calendar.name}
                  className={`mr-4 ${selectedCalendar === calendar ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                  onClick={() => handleConnect(calendar)}
                >
                  <Image src={calendar.icon} width={24} height={24} alt={calendar.name} />
                  {calendar.name}
                </button>
              ))}
              {selectedCalendar && (
                <button className="bg-red-500 text-white" onClick={handleDisconnect}>
                  Disconnect
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 p-4">
            {selectedCalendar && (
              <div>
                <h2 className="text-xl font-bold">{selectedCalendar.name}</h2>
                <p>{selectedCalendar.description}</p>
                <button className="bg-blue-500 text-white" onClick={handleGetEvents}>
                  Get Events
                </button>
                <Calendar events={events} />
              </div>
            )}
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default App;