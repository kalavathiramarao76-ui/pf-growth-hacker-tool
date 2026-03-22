import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GoogleCalendar, OutlookCalendar, AppleCalendar, MicrosoftExchangeCalendar } from '../components/CalendarIntegrations';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import { TrelloIntegration, AsanaIntegration, NotionIntegration } from '../components/ProjectManagementIntegrations';
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
  const [trelloEvents, setTrelloEvents] = useState<CalendarEvent[]>([]);
  const [asanaEvents, setAsanaEvents] = useState<CalendarEvent[]>([]);
  const [notionEvents, setNotionEvents] = useState<CalendarEvent[]>([]);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [isOutlookCalendarConnected, setIsOutlookCalendarConnected] = useState(false);
  const [isAppleCalendarConnected, setIsAppleCalendarConnected] = useState(false);
  const [isMicrosoftExchangeCalendarConnected, setIsMicrosoftExchangeCalendarConnected] = useState(false);
  const [isTrelloConnected, setIsTrelloConnected] = useState(false);
  const [isAsanaConnected, setIsAsanaConnected] = useState(false);
  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [googleCalendarAccessToken, setGoogleCalendarAccessToken] = useState<string | null>(null);
  const [outlookCalendarAccessToken, setOutlookCalendarAccessToken] = useState<string | null>(null);
  const [appleCalendarAccessToken, setAppleCalendarAccessToken] = useState<string | null>(null);
  const [microsoftExchangeCalendarAccessToken, setMicrosoftExchangeCalendarAccessToken] = useState<string | null>(null);
  const [trelloAccessToken, setTrelloAccessToken] = useState<string | null>(null);
  const [asanaAccessToken, setAsanaAccessToken] = useState<string | null>(null);
  const [notionAccessToken, setNotionAccessToken] = useState<string | null>(null);
  const [trelloBoardId, setTrelloBoardId] = useState<string | null>(null);
  const [asanaWorkspaceId, setAsanaWorkspaceId] = useState<string | null>(null);
  const [notionPageId, setNotionPageId] = useState<string | null>(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    const storedGoogleCalendarConnected = localStorage.getItem('isGoogleCalendarConnected');
    if (storedGoogleCalendarConnected) {
      setIsGoogleCalendarConnected(JSON.parse(storedGoogleCalendarConnected));
    }
    const storedOutlookCalendarConnected = localStorage.getItem('isOutlookCalendarConnected');
    if (storedOutlookCalendarConnected) {
      setIsOutlookCalendarConnected(JSON.parse(storedOutlookCalendarConnected));
    }
    const storedAppleCalendarConnected = localStorage.getItem('isAppleCalendarConnected');
    if (storedAppleCalendarConnected) {
      setIsAppleCalendarConnected(JSON.parse(storedAppleCalendarConnected));
    }
    const storedMicrosoftExchangeCalendarConnected = localStorage.getItem('isMicrosoftExchangeCalendarConnected');
    if (storedMicrosoftExchangeCalendarConnected) {
      setIsMicrosoftExchangeCalendarConnected(JSON.parse(storedMicrosoftExchangeCalendarConnected));
    }
  }, []);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <DroppableCalendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date)}
          onEventDrop={(event) => setEvents((prevEvents) => [...prevEvents, event])}
        >
          {isGoogleCalendarConnected && (
            <GoogleCalendar
              accessToken={googleCalendarAccessToken}
              onEventsFetched={(events) => setGoogleCalendarEvents(events)}
            />
          )}
          {isOutlookCalendarConnected && (
            <OutlookCalendar
              accessToken={outlookCalendarAccessToken}
              onEventsFetched={(events) => setOutlookCalendarEvents(events)}
            />
          )}
          {isAppleCalendarConnected && (
            <AppleCalendar
              accessToken={appleCalendarAccessToken}
              onEventsFetched={(events) => setAppleCalendarEvents(events)}
            />
          )}
          {isMicrosoftExchangeCalendarConnected && (
            <MicrosoftExchangeCalendar
              accessToken={microsoftExchangeCalendarAccessToken}
              onEventsFetched={(events) => setMicrosoftExchangeCalendarEvents(events)}
            />
          )}
          {isTrelloConnected && (
            <TrelloIntegration
              accessToken={trelloAccessToken}
              boardId={trelloBoardId}
              onEventsFetched={(events) => setTrelloEvents(events)}
            />
          )}
          {isAsanaConnected && (
            <AsanaIntegration
              accessToken={asanaAccessToken}
              workspaceId={asanaWorkspaceId}
              onEventsFetched={(events) => setAsanaEvents(events)}
            />
          )}
          {isNotionConnected && (
            <NotionIntegration
              accessToken={notionAccessToken}
              pageId={notionPageId}
              onEventsFetched={(events) => setNotionEvents(events)}
            />
          )}
        </DroppableCalendar>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;