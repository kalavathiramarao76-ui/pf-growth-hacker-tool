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
  const [trelloBoardId, setTrelloBoardId] = useState<string | null>(null);
  const [asanaWorkspaceId, setAsanaWorkspaceId] = useState<string | null>(null);
  const [notionPageId, setNotionPageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoogleWorkspaceCalendarEvents = async () => {
      if (isGoogleWorkspaceCalendarConnected && googleWorkspaceCalendarAccessToken) {
        const response = await fetch('/api/google-workspace-calendar-events', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${googleWorkspaceCalendarAccessToken}`,
          },
        });
        const events = await response.json();
        setGoogleWorkspaceCalendarEvents(events);
      }
    };
    fetchGoogleWorkspaceCalendarEvents();
  }, [isGoogleWorkspaceCalendarConnected, googleWorkspaceCalendarAccessToken]);

  useEffect(() => {
    const fetchMicrosoftTeamsCalendarEvents = async () => {
      if (isMicrosoftTeamsCalendarConnected && microsoftTeamsCalendarAccessToken) {
        const response = await fetch('/api/microsoft-teams-calendar-events', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${microsoftTeamsCalendarAccessToken}`,
          },
        });
        const events = await response.json();
        setMicrosoftTeamsCalendarEvents(events);
      }
    };
    fetchMicrosoftTeamsCalendarEvents();
  }, [isMicrosoftTeamsCalendarConnected, microsoftTeamsCalendarAccessToken]);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <DroppableCalendar
          events={events}
          onEventDrop={(event) => setEvents((prevEvents) => [...prevEvents, event])}
        >
          <Calendar
            events={events}
            selectedDate={selectedDate}
            onDateChange={(date) => setSelectedDate(date)}
          />
          <GoogleCalendar
            isConnected={isGoogleCalendarConnected}
            onConnect={() => setIsGoogleCalendarConnected(true)}
            onDisconnect={() => setIsGoogleCalendarConnected(false)}
            accessToken={googleCalendarAccessToken}
            events={googleCalendarEvents}
          />
          <OutlookCalendar
            isConnected={isOutlookCalendarConnected}
            onConnect={() => setIsOutlookCalendarConnected(true)}
            onDisconnect={() => setIsOutlookCalendarConnected(false)}
            accessToken={outlookCalendarAccessToken}
            events={outlookCalendarEvents}
          />
          <AppleCalendar
            isConnected={isAppleCalendarConnected}
            onConnect={() => setIsAppleCalendarConnected(true)}
            onDisconnect={() => setIsAppleCalendarConnected(false)}
            accessToken={appleCalendarAccessToken}
            events={appleCalendarEvents}
          />
          <MicrosoftExchangeCalendar
            isConnected={isMicrosoftExchangeCalendarConnected}
            onConnect={() => setIsMicrosoftExchangeCalendarConnected(true)}
            onDisconnect={() => setIsMicrosoftExchangeCalendarConnected(false)}
            accessToken={microsoftExchangeCalendarAccessToken}
            events={microsoftExchangeCalendarEvents}
          />
          <GoogleWorkspaceCalendar
            isConnected={isGoogleWorkspaceCalendarConnected}
            onConnect={() => setIsGoogleWorkspaceCalendarConnected(true)}
            onDisconnect={() => setIsGoogleWorkspaceCalendarConnected(false)}
            accessToken={googleWorkspaceCalendarAccessToken}
            events={googleWorkspaceCalendarEvents}
          />
          <MicrosoftTeamsCalendar
            isConnected={isMicrosoftTeamsCalendarConnected}
            onConnect={() => setIsMicrosoftTeamsCalendarConnected(true)}
            onDisconnect={() => setIsMicrosoftTeamsCalendarConnected(false)}
            accessToken={microsoftTeamsCalendarAccessToken}
            events={microsoftTeamsCalendarEvents}
          />
          <TrelloIntegration
            isConnected={isTrelloConnected}
            onConnect={() => setIsTrelloConnected(true)}
            onDisconnect={() => setIsTrelloConnected(false)}
            accessToken={trelloAccessToken}
            boardId={trelloBoardId}
            events={trelloEvents}
          />
          <AsanaIntegration
            isConnected={isAsanaConnected}
            onConnect={() => setIsAsanaConnected(true)}
            onDisconnect={() => setIsAsanaConnected(false)}
            accessToken={asanaAccessToken}
            workspaceId={asanaWorkspaceId}
            events={asanaEvents}
          />
          <NotionIntegration
            isConnected={isNotionConnected}
            onConnect={() => setIsNotionConnected(true)}
            onDisconnect={() => setIsNotionConnected(false)}
            accessToken={notionAccessToken}
            pageId={notionPageId}
            events={notionEvents}
          />
          <GoogleWorkspaceIntegration
            isConnected={isGoogleWorkspaceCalendarConnected}
            onConnect={() => setIsGoogleWorkspaceCalendarConnected(true)}
            onDisconnect={() => setIsGoogleWorkspaceCalendarConnected(false)}
            accessToken={googleWorkspaceCalendarAccessToken}
          />
          <MicrosoftTeamsIntegration
            isConnected={isMicrosoftTeamsCalendarConnected}
            onConnect={() => setIsMicrosoftTeamsCalendarConnected(true)}
            onDisconnect={() => setIsMicrosoftTeamsCalendarConnected(false)}
            accessToken={microsoftTeamsCalendarAccessToken}
          />
        </DroppableCalendar>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;