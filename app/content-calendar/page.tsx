import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GoogleCalendar, OutlookCalendar, AppleCalendar, MicrosoftExchangeCalendar, GoogleWorkspaceCalendar, MicrosoftTeamsCalendar } from '../components/CalendarIntegrations';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import { TrelloIntegration, AsanaIntegration, NotionIntegration, GoogleWorkspaceIntegration, MicrosoftTeamsIntegration } from '../components/ProjectManagementIntegrations';
import { DraggableEvent, DroppableCalendar } from '../components/DraggableEvent';

const ContentCalendarPage = () => {
  const pathname = usePathname();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<CalendarEvent[]>([]);
  const [outlookCalendarEvents, setOutlookCalendarEvents] = useState<CalendarEvent[]>([]);
  const [appleCalendarEvents, setAppleCalendarEvents] = useState<CalendarEvent[]>([]);
  const [microsoftExchangeCalendarEvents, setMicrosoftExchangeCalendarEvents] = useState<CalendarEvent[]>([]);
  const [googleWorkspaceCalendarEvents, setGoogleWorkspaceCalendarEvents] = useState<CalendarEvent[]>([]);
  const [microsoftTeamsCalendarEvents, setMicrosoftTeamsCalendarEvents] = useState<CalendarEvent[]>([]);
  const [trelloEvents, setTrelloEvents] = useState<CalendarEvent[]>([]);
  const [asanaEvents, setAsanaEvents] = useState<CalendarEvent[]>([]);
  const [notionEvents, setNotionEvents] = useState<CalendarEvent[]>([]);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [isOutlookCalendarConnected, setIsOutlookCalendarConnected] = useState(false);
  const [isAppleCalendarConnected, setIsAppleCalendarConnected] = useState(false);
  const [isMicrosoftExchangeCalendarConnected, setIsMicrosoftExchangeCalendarConnected] = useState(false);
  const [isGoogleWorkspaceCalendarConnected, setIsGoogleWorkspaceCalendarConnected] = useState(false);
  const [isMicrosoftTeamsCalendarConnected, setIsMicrosoftTeamsCalendarConnected] = useState(false);
  const [isTrelloConnected, setIsTrelloConnected] = useState(false);
  const [isAsanaConnected, setIsAsanaConnected] = useState(false);
  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [googleCalendarAccessToken, setGoogleCalendarAccessToken] = useState<string | null>(null);
  const [outlookCalendarAccessToken, setOutlookCalendarAccessToken] = useState<string | null>(null);
  const [appleCalendarAccessToken, setAppleCalendarAccessToken] = useState<string | null>(null);
  const [microsoftExchangeCalendarAccessToken, setMicrosoftExchangeCalendarAccessToken] = useState<string | null>(null);
  const [googleWorkspaceCalendarAccessToken, setGoogleWorkspaceCalendarAccessToken] = useState<string | null>(null);
  const [microsoftTeamsCalendarAccessToken, setMicrosoftTeamsCalendarAccessToken] = useState<string | null>(null);
  const [trelloAccessToken, setTrelloAccessToken] = useState<string | null>(null);
  const [asanaAccessToken, setAsanaAccessToken] = useState<string | null>(null);
  const [notionAccessToken, setNotionAccessToken] = useState<string | null>(null);

  const connectGoogleCalendar = async () => {
    const response = await fetch('/api/connect-google-calendar');
    const data = await response.json();
    setGoogleCalendarAccessToken(data.accessToken);
    setIsGoogleCalendarConnected(true);
  };

  const connectOutlookCalendar = async () => {
    const response = await fetch('/api/connect-outlook-calendar');
    const data = await response.json();
    setOutlookCalendarAccessToken(data.accessToken);
    setIsOutlookCalendarConnected(true);
  };

  const connectAppleCalendar = async () => {
    const response = await fetch('/api/connect-apple-calendar');
    const data = await response.json();
    setAppleCalendarAccessToken(data.accessToken);
    setIsAppleCalendarConnected(true);
  };

  const connectMicrosoftExchangeCalendar = async () => {
    const response = await fetch('/api/connect-microsoft-exchange-calendar');
    const data = await response.json();
    setMicrosoftExchangeCalendarAccessToken(data.accessToken);
    setIsMicrosoftExchangeCalendarConnected(true);
  };

  const connectGoogleWorkspaceCalendar = async () => {
    const response = await fetch('/api/connect-google-workspace-calendar');
    const data = await response.json();
    setGoogleWorkspaceCalendarAccessToken(data.accessToken);
    setIsGoogleWorkspaceCalendarConnected(true);
  };

  const connectMicrosoftTeamsCalendar = async () => {
    const response = await fetch('/api/connect-microsoft-teams-calendar');
    const data = await response.json();
    setMicrosoftTeamsCalendarAccessToken(data.accessToken);
    setIsMicrosoftTeamsCalendarConnected(true);
  };

  const connectTrello = async () => {
    const response = await fetch('/api/connect-trello');
    const data = await response.json();
    setTrelloAccessToken(data.accessToken);
    setIsTrelloConnected(true);
  };

  const connectAsana = async () => {
    const response = await fetch('/api/connect-asana');
    const data = await response.json();
    setAsanaAccessToken(data.accessToken);
    setIsAsanaConnected(true);
  };

  const connectNotion = async () => {
    const response = await fetch('/api/connect-notion');
    const data = await response.json();
    setNotionAccessToken(data.accessToken);
    setIsNotionConnected(true);
  };

  const getGoogleCalendarEvents = async () => {
    if (googleCalendarAccessToken) {
      const response = await fetch('/api/get-google-calendar-events', {
        headers: {
          Authorization: `Bearer ${googleCalendarAccessToken}`,
        },
      });
      const data = await response.json();
      setGoogleCalendarEvents(data.events);
    }
  };

  const getOutlookCalendarEvents = async () => {
    if (outlookCalendarAccessToken) {
      const response = await fetch('/api/get-outlook-calendar-events', {
        headers: {
          Authorization: `Bearer ${outlookCalendarAccessToken}`,
        },
      });
      const data = await response.json();
      setOutlookCalendarEvents(data.events);
    }
  };

  const getAppleCalendarEvents = async () => {
    if (appleCalendarAccessToken) {
      const response = await fetch('/api/get-apple-calendar-events', {
        headers: {
          Authorization: `Bearer ${appleCalendarAccessToken}`,
        },
      });
      const data = await response.json();
      setAppleCalendarEvents(data.events);
    }
  };

  const getMicrosoftExchangeCalendarEvents = async () => {
    if (microsoftExchangeCalendarAccessToken) {
      const response = await fetch('/api/get-microsoft-exchange-calendar-events', {
        headers: {
          Authorization: `Bearer ${microsoftExchangeCalendarAccessToken}`,
        },
      });
      const data = await response.json();
      setMicrosoftExchangeCalendarEvents(data.events);
    }
  };

  const getGoogleWorkspaceCalendarEvents = async () => {
    if (googleWorkspaceCalendarAccessToken) {
      const response = await fetch('/api/get-google-workspace-calendar-events', {
        headers: {
          Authorization: `Bearer ${googleWorkspaceCalendarAccessToken}`,
        },
      });
      const data = await response.json();
      setGoogleWorkspaceCalendarEvents(data.events);
    }
  };

  const getMicrosoftTeamsCalendarEvents = async () => {
    if (microsoftTeamsCalendarAccessToken) {
      const response = await fetch('/api/get-microsoft-teams-calendar-events', {
        headers: {
          Authorization: `Bearer ${microsoftTeamsCalendarAccessToken}`,
        },
      });
      const data = await response.json();
      setMicrosoftTeamsCalendarEvents(data.events);
    }
  };

  const getTrelloEvents = async () => {
    if (trelloAccessToken) {
      const response = await fetch('/api/get-trello-events', {
        headers: {
          Authorization: `Bearer ${trelloAccessToken}`,
        },
      });
      const data = await response.json();
      setTrelloEvents(data.events);
    }
  };

  const getAsanaEvents = async () => {
    if (asanaAccessToken) {
      const response = await fetch('/api/get-asana-events', {
        headers: {
          Authorization: `Bearer ${asanaAccessToken}`,
        },
      });
      const data = await response.json();
      setAsanaEvents(data.events);
    }
  };

  const getNotionEvents = async () => {
    if (notionAccessToken) {
      const response = await fetch('/api/get-notion-events', {
        headers: {
          Authorization: `Bearer ${notionAccessToken}`,
        },
      });
      const data = await response.json();
      setNotionEvents(data.events);
    }
  };

  useEffect(() => {
    if (isGoogleCalendarConnected) {
      getGoogleCalendarEvents();
    }
    if (isOutlookCalendarConnected) {
      getOutlookCalendarEvents();
    }
    if (isAppleCalendarConnected) {
      getAppleCalendarEvents();
    }
    if (isMicrosoftExchangeCalendarConnected) {
      getMicrosoftExchangeCalendarEvents();
    }
    if (isGoogleWorkspaceCalendarConnected) {
      getGoogleWorkspaceCalendarEvents();
    }
    if (isMicrosoftTeamsCalendarConnected) {
      getMicrosoftTeamsCalendarEvents();
    }
    if (isTrelloConnected) {
      getTrelloEvents();
    }
    if (isAsanaConnected) {
      getAsanaEvents();
    }
    if (isNotionConnected) {
      getNotionEvents();
    }
  }, [
    isGoogleCalendarConnected,
    isOutlookCalendarConnected,
    isAppleCalendarConnected,
    isMicrosoftExchangeCalendarConnected,
    isGoogleWorkspaceCalendarConnected,
    isMicrosoftTeamsCalendarConnected,
    isTrelloConnected,
    isAsanaConnected,
    isNotionConnected,
  ]);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={[
            ...googleCalendarEvents,
            ...outlookCalendarEvents,
            ...appleCalendarEvents,
            ...microsoftExchangeCalendarEvents,
            ...googleWorkspaceCalendarEvents,
            ...microsoftTeamsCalendarEvents,
            ...trelloEvents,
            ...asanaEvents,
            ...notionEvents,
          ]}
          onEventDrop={(event) => {
            setEvents((prevEvents) => {
              const newEvents = [...prevEvents];
              const index = newEvents.findIndex((e) => e.id === event.id);
              if (index !== -1) {
                newEvents[index] = event;
              } else {
                newEvents.push(event);
              }
              return newEvents;
            });
          }}
        />
        <div>
          <button onClick={connectGoogleCalendar}>Connect Google Calendar</button>
          <button onClick={connectOutlookCalendar}>Connect Outlook Calendar</button>
          <button onClick={connectAppleCalendar}>Connect Apple Calendar</button>
          <button onClick={connectMicrosoftExchangeCalendar}>Connect Microsoft Exchange Calendar</button>
          <button onClick={connectGoogleWorkspaceCalendar}>Connect Google Workspace Calendar</button>
          <button onClick={connectMicrosoftTeamsCalendar}>Connect Microsoft Teams Calendar</button>
          <button onClick={connectTrello}>Connect Trello</button>
          <button onClick={connectAsana}>Connect Asana</button>
          <button onClick={connectNotion}>Connect Notion</button>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;