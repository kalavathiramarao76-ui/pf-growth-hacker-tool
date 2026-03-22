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

  const handleTrelloIntegration = async () => {
    if (trelloAccessToken) {
      const response = await fetch(`https://api.trello.com/1/members/me/boards?token=${trelloAccessToken}&key=YOUR_TRELLO_API_KEY`);
      const boards = await response.json();
      setTrelloBoardId(boards[0].id);
    }
  };

  const handleAsanaIntegration = async () => {
    if (asanaAccessToken) {
      const response = await fetch(`https://app.asana.com/api/1.0/workspaces?access_token=${asanaAccessToken}`);
      const workspaces = await response.json();
      setAsanaWorkspaceId(workspaces.data[0].id);
    }
  };

  const handleNotionIntegration = async () => {
    if (notionAccessToken) {
      const response = await fetch(`https://api.notion.com/v1/users/me?token=${notionAccessToken}`);
      const user = await response.json();
      setNotionPageId(user.results[0].id);
    }
  };

  const handleTrelloEventSync = async () => {
    if (trelloAccessToken && trelloBoardId) {
      const response = await fetch(`https://api.trello.com/1/boards/${trelloBoardId}/lists?token=${trelloAccessToken}&key=YOUR_TRELLO_API_KEY`);
      const lists = await response.json();
      const events: CalendarEvent[] = [];
      lists.forEach((list) => {
        list.cards.forEach((card) => {
          events.push({
            id: card.id,
            title: card.name,
            start: new Date(card.due),
            end: new Date(card.due),
          });
        });
      });
      setTrelloEvents(events);
    }
  };

  const handleAsanaEventSync = async () => {
    if (asanaAccessToken && asanaWorkspaceId) {
      const response = await fetch(`https://app.asana.com/api/1.0/tasks?workspace=${asanaWorkspaceId}&access_token=${asanaAccessToken}`);
      const tasks = await response.json();
      const events: CalendarEvent[] = [];
      tasks.data.forEach((task) => {
        events.push({
          id: task.id,
          title: task.name,
          start: new Date(task.due_on),
          end: new Date(task.due_on),
        });
      });
      setAsanaEvents(events);
    }
  };

  const handleNotionEventSync = async () => {
    if (notionAccessToken && notionPageId) {
      const response = await fetch(`https://api.notion.com/v1/pages/${notionPageId}?token=${notionAccessToken}`);
      const page = await response.json();
      const events: CalendarEvent[] = [];
      page.results.forEach((result) => {
        events.push({
          id: result.id,
          title: result.properties.title.title[0].text.content,
          start: new Date(result.properties.date.date.start),
          end: new Date(result.properties.date.date.end),
        });
      });
      setNotionEvents(events);
    }
  };

  useEffect(() => {
    handleTrelloIntegration();
    handleAsanaIntegration();
    handleNotionIntegration();
  }, [trelloAccessToken, asanaAccessToken, notionAccessToken]);

  useEffect(() => {
    handleTrelloEventSync();
    handleAsanaEventSync();
    handleNotionEventSync();
  }, [trelloAccessToken, trelloBoardId, asanaAccessToken, asanaWorkspaceId, notionAccessToken, notionPageId]);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date)}
          onEventDrop={(event) => setEvents((prevEvents) => prevEvents.map((prevEvent) => (prevEvent.id === event.id ? event : prevEvent)))}
        >
          <DroppableCalendar />
          {events.map((event) => (
            <DraggableEvent key={event.id} event={event} />
          ))}
        </Calendar>
        <GoogleCalendar
          isConnected={isGoogleCalendarConnected}
          onConnect={() => setIsGoogleCalendarConnected(true)}
          onDisconnect={() => setIsGoogleCalendarConnected(false)}
          accessToken={googleCalendarAccessToken}
          events={googleCalendarEvents}
          onEventSync={(events) => setGoogleCalendarEvents(events)}
        />
        <OutlookCalendar
          isConnected={isOutlookCalendarConnected}
          onConnect={() => setIsOutlookCalendarConnected(true)}
          onDisconnect={() => setIsOutlookCalendarConnected(false)}
          accessToken={outlookCalendarAccessToken}
          events={outlookCalendarEvents}
          onEventSync={(events) => setOutlookCalendarEvents(events)}
        />
        <AppleCalendar
          isConnected={isAppleCalendarConnected}
          onConnect={() => setIsAppleCalendarConnected(true)}
          onDisconnect={() => setIsAppleCalendarConnected(false)}
          accessToken={appleCalendarAccessToken}
          events={appleCalendarEvents}
          onEventSync={(events) => setAppleCalendarEvents(events)}
        />
        <MicrosoftExchangeCalendar
          isConnected={isMicrosoftExchangeCalendarConnected}
          onConnect={() => setIsMicrosoftExchangeCalendarConnected(true)}
          onDisconnect={() => setIsMicrosoftExchangeCalendarConnected(false)}
          accessToken={microsoftExchangeCalendarAccessToken}
          events={microsoftExchangeCalendarEvents}
          onEventSync={(events) => setMicrosoftExchangeCalendarEvents(events)}
        />
        <TrelloIntegration
          isConnected={isTrelloConnected}
          onConnect={() => setIsTrelloConnected(true)}
          onDisconnect={() => setIsTrelloConnected(false)}
          accessToken={trelloAccessToken}
          boardId={trelloBoardId}
          events={trelloEvents}
          onEventSync={(events) => setTrelloEvents(events)}
        />
        <AsanaIntegration
          isConnected={isAsanaConnected}
          onConnect={() => setIsAsanaConnected(true)}
          onDisconnect={() => setIsAsanaConnected(false)}
          accessToken={asanaAccessToken}
          workspaceId={asanaWorkspaceId}
          events={asanaEvents}
          onEventSync={(events) => setAsanaEvents(events)}
        />
        <NotionIntegration
          isConnected={isNotionConnected}
          onConnect={() => setIsNotionConnected(true)}
          onDisconnect={() => setIsNotionConnected(false)}
          accessToken={notionAccessToken}
          pageId={notionPageId}
          events={notionEvents}
          onEventSync={(events) => setNotionEvents(events)}
        />
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;