import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GoogleCalendar, OutlookCalendar, AppleCalendar } from '../components/CalendarIntegrations';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import { TrelloIntegration, AsanaIntegration, NotionIntegration } from '../components/ProjectManagementIntegrations';
import { DraggableEvent, DroppableCalendar } from '../components/DraggableEvent';
import { SlackIntegration, MicrosoftTeamsIntegration } from '../components/CommunicationIntegrations';

const ContentCalendarPage = () => {
  const pathname = usePathname();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<CalendarEvent[]>([]);
  const [outlookCalendarEvents, setOutlookCalendarEvents] = useState<CalendarEvent[]>([]);
  const [appleCalendarEvents, setAppleCalendarEvents] = useState<CalendarEvent[]>([]);
  const [trelloEvents, setTrelloEvents] = useState<CalendarEvent[]>([]);
  const [asanaEvents, setAsanaEvents] = useState<CalendarEvent[]>([]);
  const [notionEvents, setNotionEvents] = useState<CalendarEvent[]>([]);
  const [slackEvents, setSlackEvents] = useState<CalendarEvent[]>([]);
  const [microsoftTeamsEvents, setMicrosoftTeamsEvents] = useState<CalendarEvent[]>([]);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [isOutlookCalendarConnected, setIsOutlookCalendarConnected] = useState(false);
  const [isAppleCalendarConnected, setIsAppleCalendarConnected] = useState(false);
  const [isTrelloConnected, setIsTrelloConnected] = useState(false);
  const [isAsanaConnected, setIsAsanaConnected] = useState(false);
  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [isSlackConnected, setIsSlackConnected] = useState(false);
  const [isMicrosoftTeamsConnected, setIsMicrosoftTeamsConnected] = useState(false);
  const [googleCalendarAccessToken, setGoogleCalendarAccessToken] = useState<string | null>(null);
  const [outlookCalendarAccessToken, setOutlookCalendarAccessToken] = useState<string | null>(null);
  const [appleCalendarAccessToken, setAppleCalendarAccessToken] = useState<string | null>(null);
  const [slackAccessToken, setSlackAccessToken] = useState<string | null>(null);
  const [microsoftTeamsAccessToken, setMicrosoftTeamsAccessToken] = useState<string | null>(null);
  const [ssoToken, setSsoToken] = useState<string | null>(null);

  const calendarIntegrations = [
    {
      name: 'Google Calendar',
      component: <GoogleCalendar />,
      connect: () => connectToGoogleCalendar(),
      disconnect: () => disconnectFromGoogleCalendar(),
    },
    {
      name: 'Outlook Calendar',
      component: <OutlookCalendar />,
      connect: () => connectToOutlookCalendar(),
      disconnect: () => disconnectFromOutlookCalendar(),
    },
    {
      name: 'Apple Calendar',
      component: <AppleCalendar />,
      connect: () => connectToAppleCalendar(),
      disconnect: () => disconnectFromAppleCalendar(),
    },
  ];

  const connectToGoogleCalendar = async () => {
    const response = await fetch('/api/connect/google-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ssoToken }),
    });
    const data = await response.json();
    if (data.accessToken) {
      setGoogleCalendarAccessToken(data.accessToken);
      setIsGoogleCalendarConnected(true);
    }
  };

  const disconnectFromGoogleCalendar = async () => {
    const response = await fetch('/api/disconnect/google-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ssoToken }),
    });
    const data = await response.json();
    if (data.success) {
      setGoogleCalendarAccessToken(null);
      setIsGoogleCalendarConnected(false);
    }
  };

  const connectToOutlookCalendar = async () => {
    const response = await fetch('/api/connect/outlook-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ssoToken }),
    });
    const data = await response.json();
    if (data.accessToken) {
      setOutlookCalendarAccessToken(data.accessToken);
      setIsOutlookCalendarConnected(true);
    }
  };

  const disconnectFromOutlookCalendar = async () => {
    const response = await fetch('/api/disconnect/outlook-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ssoToken }),
    });
    const data = await response.json();
    if (data.success) {
      setOutlookCalendarAccessToken(null);
      setIsOutlookCalendarConnected(false);
    }
  };

  const connectToAppleCalendar = async () => {
    const response = await fetch('/api/connect/apple-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ssoToken }),
    });
    const data = await response.json();
    if (data.accessToken) {
      setAppleCalendarAccessToken(data.accessToken);
      setIsAppleCalendarConnected(true);
    }
  };

  const disconnectFromAppleCalendar = async () => {
    const response = await fetch('/api/disconnect/apple-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ssoToken }),
    });
    const data = await response.json();
    if (data.success) {
      setAppleCalendarAccessToken(null);
      setIsAppleCalendarConnected(false);
    }
  };

  const handleSSOLogin = async () => {
    const response = await fetch('/api/sso/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.ssoToken) {
      setSsoToken(data.ssoToken);
    }
  };

  useEffect(() => {
    handleSSOLogin();
  }, []);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date)}
          onEventDrop={(event) => setDraggedEvent(event)}
          onEventHover={(event) => setHoveredEvent(event)}
        />
        {calendarIntegrations.map((integration) => (
          <div key={integration.name}>
            {integration.component}
            {isGoogleCalendarConnected || isOutlookCalendarConnected || isAppleCalendarConnected ? (
              <button onClick={integration.disconnect}>Disconnect</button>
            ) : (
              <button onClick={integration.connect}>Connect</button>
            )}
          </div>
        ))}
        <TrelloIntegration />
        <AsanaIntegration />
        <NotionIntegration />
        <SlackIntegration />
        <MicrosoftTeamsIntegration />
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;