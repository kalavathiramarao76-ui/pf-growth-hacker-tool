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

const App = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const handleConnect = async (integration: string) => {
    const token = await getAccessToken(integration);
    if (token) {
      calendarIntegrations[integration].connect(token);
      setIsConnected(true);
      setSelectedIntegration(integration);
    }
  };

  const handleDisconnect = () => {
    calendarIntegrations[selectedIntegration].disconnect();
    setIsConnected(false);
    setSelectedIntegration('');
  };

  const getAccessToken = async (integration: string) => {
    const authUrl = calendarIntegrations[integration].authUrl;
    const response = await fetch(authUrl, {
      method: 'GET',
      redirect: 'follow',
    });
    const url = new URL(response.url);
    const token = url.searchParams.get('token');
    return token;
  };

  const getEvents = async () => {
    if (isConnected) {
      const events = await calendarIntegrations[selectedIntegration].getEvents();
      setEvents(events);
    }
  };

  useEffect(() => {
    getEvents();
  }, [isConnected, selectedIntegration]);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-screen">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Content Calendar</h1>
            <div className="flex items-center space-x-4">
              {Object.keys(calendarIntegrations).map((integration) => (
                <button
                  key={integration}
                  className={`px-4 py-2 rounded-lg ${
                    isConnected && selectedIntegration === integration
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  onClick={() => handleConnect(integration)}
                >
                  {calendarIntegrations[integration].name}
                </button>
              ))}
              {isConnected && (
                <button
                  className="px-4 py-2 rounded-lg bg-red-500 text-white"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 p-4">
            <Calendar events={events} />
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default App;