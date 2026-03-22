import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GoogleCalendar, OutlookCalendar } from '../components/CalendarIntegrations';
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
  const [trelloEvents, setTrelloEvents] = useState<CalendarEvent[]>([]);
  const [asanaEvents, setAsanaEvents] = useState<CalendarEvent[]>([]);
  const [notionEvents, setNotionEvents] = useState<CalendarEvent[]>([]);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [isOutlookCalendarConnected, setIsOutlookCalendarConnected] = useState(false);
  const [isTrelloConnected, setIsTrelloConnected] = useState(false);
  const [isAsanaConnected, setIsAsanaConnected] = useState(false);
  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [googleCalendarAccessToken, setGoogleCalendarAccessToken] = useState<string | null>(null);
  const [outlookCalendarAccessToken, setOutlookCalendarAccessToken] = useState<string | null>(null);
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
    const storedTrelloConnected = localStorage.getItem('isTrelloConnected');
    if (storedTrelloConnected) {
      setIsTrelloConnected(JSON.parse(storedTrelloConnected));
    }
    const storedAsanaConnected = localStorage.getItem('isAsanaConnected');
    if (storedAsanaConnected) {
      setIsAsanaConnected(JSON.parse(storedAsanaConnected));
    }
    const storedNotionConnected = localStorage.getItem('isNotionConnected');
    if (storedNotionConnected) {
      setIsNotionConnected(JSON.parse(storedNotionConnected));
    }
  }, []);

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
  };

  const handleDrop = (date: Date) => {
    if (draggedEvent) {
      const newEvent = { ...draggedEvent, date };
      setEvents((prevEvents) => prevEvents.map((event) => (event.id === draggedEvent.id ? newEvent : event)));
      setDraggedEvent(null);
    }
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <DroppableCalendar onDrop={handleDrop}>
          {events.map((event) => (
            <DraggableEvent
              key={event.id}
              event={event}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </DroppableCalendar>
      </DndProvider>
      <GoogleCalendar
        isConnected={isGoogleCalendarConnected}
        accessToken={googleCalendarAccessToken}
        events={googleCalendarEvents}
        onConnect={() => {
          // handle Google Calendar connection
        }}
      />
      <OutlookCalendar
        isConnected={isOutlookCalendarConnected}
        accessToken={outlookCalendarAccessToken}
        events={outlookCalendarEvents}
        onConnect={() => {
          // handle Outlook Calendar connection
        }}
      />
      <TrelloIntegration
        isConnected={isTrelloConnected}
        accessToken={trelloAccessToken}
        boardId={trelloBoardId}
        events={trelloEvents}
        onConnect={() => {
          // handle Trello connection
        }}
      />
      <AsanaIntegration
        isConnected={isAsanaConnected}
        accessToken={asanaAccessToken}
        workspaceId={asanaWorkspaceId}
        events={asanaEvents}
        onConnect={() => {
          // handle Asana connection
        }}
      />
      <NotionIntegration
        isConnected={isNotionConnected}
        accessToken={notionAccessToken}
        pageId={notionPageId}
        events={notionEvents}
        onConnect={() => {
          // handle Notion connection
        }}
      />
    </Layout>
  );
};

export default ContentCalendarPage;