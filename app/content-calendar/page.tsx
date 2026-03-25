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

// Unified Calendar API
interface CalendarIntegration {
  connect: (token: string) => void;
  getEvents: () => Promise<CalendarEvent[]>;
  disconnect: () => void;
  name: string;
  icon: string;
  description: string;
}

// Calendar Integrations
const calendarIntegrations: { [key: string]: CalendarIntegration } = {
  GoogleCalendar: {
    connect: (token: string) => {
      // Implement Google Calendar connection logic
    },
    getEvents: async () => {
      // Implement Google Calendar event retrieval logic
      return [];
    },
    disconnect: () => {
      // Implement Google Calendar disconnection logic
    },
    name: 'Google Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281764.png',
    description: 'Connect your Google Calendar to view and manage your events',
  },
  OutlookCalendar: {
    connect: (token: string) => {
      // Implement Outlook Calendar connection logic
    },
    getEvents: async () => {
      // Implement Outlook Calendar event retrieval logic
      return [];
    },
    disconnect: () => {
      // Implement Outlook Calendar disconnection logic
    },
    name: 'Outlook Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281765.png',
    description: 'Connect your Outlook Calendar to view and manage your events',
  },
  AppleCalendar: {
    connect: (token: string) => {
      // Implement Apple Calendar connection logic
    },
    getEvents: async () => {
      // Implement Apple Calendar event retrieval logic
      return [];
    },
    disconnect: () => {
      // Implement Apple Calendar disconnection logic
    },
    name: 'Apple Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281766.png',
    description: 'Connect your Apple Calendar to view and manage your events',
  },
  ICalCalendar: {
    connect: (token: string) => {
      // Implement ICal Calendar connection logic
    },
    getEvents: async () => {
      // Implement ICal Calendar event retrieval logic
      return [];
    },
    disconnect: () => {
      // Implement ICal Calendar disconnection logic
    },
    name: 'iCal Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281767.png',
    description: 'Connect your iCal Calendar to view and manage your events',
  },
  ExchangeCalendar: {
    connect: (token: string) => {
      // Implement Exchange Calendar connection logic
    },
    getEvents: async () => {
      // Implement Exchange Calendar event retrieval logic
      return [];
    },
    disconnect: () => {
      // Implement Exchange Calendar disconnection logic
    },
    name: 'Exchange Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281768.png',
    description: 'Connect your Exchange Calendar to view and manage your events',
  },
  YahooCalendar: {
    connect: (token: string) => {
      // Implement Yahoo Calendar connection logic
    },
    getEvents: async () => {
      // Implement Yahoo Calendar event retrieval logic
      return [];
    },
    disconnect: () => {
      // Implement Yahoo Calendar disconnection logic
    },
    name: 'Yahoo Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281769.png',
    description: 'Connect your Yahoo Calendar to view and manage your events',
  },
};

const CalendarPage = () => {
  const [selectedCalendar, setSelectedCalendar] = useState<string>('');
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchEvents = async () => {
      if (selectedCalendar) {
        const calendarIntegration = calendarIntegrations[selectedCalendar];
        if (calendarIntegration) {
          const fetchedEvents = await calendarIntegration.getEvents();
          setEvents(fetchedEvents);
        }
      }
    };
    fetchEvents();
  }, [selectedCalendar]);

  const handleConnectCalendar = (calendar: string) => {
    const calendarIntegration = calendarIntegrations[calendar];
    if (calendarIntegration) {
      calendarIntegration.connect('token');
      setConnectedCalendars((prevCalendars) => [...prevCalendars, calendar]);
    }
  };

  const handleDisconnectCalendar = (calendar: string) => {
    const calendarIntegration = calendarIntegrations[calendar];
    if (calendarIntegration) {
      calendarIntegration.disconnect();
      setConnectedCalendars((prevCalendars) => prevCalendars.filter((c) => c !== calendar));
    }
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-screen">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">Content Calendar</h1>
            <div className="flex space-x-4">
              {Object.keys(calendarIntegrations).map((calendar) => (
                <div key={calendar} className="flex flex-col items-center">
                  <Image src={calendarIntegrations[calendar].icon} width={30} height={30} />
                  <p className="text-sm">{calendarIntegrations[calendar].name}</p>
                  {connectedCalendars.includes(calendar) ? (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDisconnectCalendar(calendar)}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleConnectCalendar(calendar)}
                    >
                      Connect
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Calendar events={events} />
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default CalendarPage;