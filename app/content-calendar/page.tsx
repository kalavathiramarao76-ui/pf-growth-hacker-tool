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
  },
  ZohoCalendar: {
    connect: (token: string) => {
      // Implement Zoho Calendar connection logic
    },
    getEvents: async () => {
      // Implement Zoho Calendar event retrieval logic
      return [];
    },
    disconnect: () => {
      // Implement Zoho Calendar disconnection logic
    },
    name: 'Zoho Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281770.png',
  },
  AnyDoCalendar: {
    connect: (token: string) => {
      // Implement AnyDo Calendar connection logic
    },
    getEvents: async () => {
      // Implement AnyDo Calendar event retrieval logic
      return [];
    },
    disconnect: () => {
      // Implement AnyDo Calendar disconnection logic
    },
    name: 'AnyDo Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281771.png',
  },
};

const Page = () => {
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarIntegration | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [connected, setConnected] = useState(false);

  const handleConnect = (calendar: CalendarIntegration) => {
    calendar.connect('token');
    setSelectedCalendar(calendar);
    setConnected(true);
  };

  const handleDisconnect = () => {
    if (selectedCalendar) {
      selectedCalendar.disconnect();
      setSelectedCalendar(null);
      setConnected(false);
    }
  };

  const handleGetEvents = async () => {
    if (selectedCalendar) {
      const events = await selectedCalendar.getEvents();
      setEvents(events);
    }
  };

  useEffect(() => {
    if (connected) {
      handleGetEvents();
    }
  }, [connected]);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-screen">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Content Calendar</h1>
            <div className="flex items-center">
              {connected ? (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </button>
              ) : (
                <div className="flex flex-wrap">
                  {Object.values(calendarIntegrations).map((calendar) => (
                    <button
                      key={calendar.name}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2"
                      onClick={() => handleConnect(calendar)}
                    >
                      <Image src={calendar.icon} width={20} height={20} alt={calendar.name} />
                      {calendar.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 p-4">
            {connected ? (
              <Calendar events={events} />
            ) : (
              <div className="text-center text-gray-500">
                Please connect to a calendar to view events
              </div>
            )}
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default Page;