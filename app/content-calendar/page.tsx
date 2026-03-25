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
};

const CalendarIntegrationCard = ({ integration }: { integration: CalendarIntegration }) => {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    integration.connect('token');
    setConnected(true);
  };

  const handleDisconnect = () => {
    integration.disconnect();
    setConnected(false);
  };

  return (
    <div className="calendar-integration-card">
      <Image src={integration.icon} alt={integration.name} />
      <h3>{integration.name}</h3>
      {connected ? (
        <button onClick={handleDisconnect}>Disconnect</button>
      ) : (
        <button onClick={handleConnect}>Connect</button>
      )}
    </div>
  );
};

const CalendarIntegrationList = () => {
  return (
    <div className="calendar-integration-list">
      {Object.values(calendarIntegrations).map((integration) => (
        <CalendarIntegrationCard key={integration.name} integration={integration} />
      ))}
    </div>
  );
};

const Page = () => {
  const pathname = usePathname();

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="content-calendar-page">
          <h1>Content Calendar</h1>
          <CalendarIntegrationList />
          <Calendar />
        </div>
      </DndProvider>
    </Layout>
  );
};

export default Page;