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
    const storedTrelloBoardId = localStorage.getItem('trelloBoardId');
    if (storedTrelloBoardId) {
      setTrelloBoardId(storedTrelloBoardId);
    }
    const storedAsanaWorkspaceId = localStorage.getItem('asanaWorkspaceId');
    if (storedAsanaWorkspaceId) {
      setAsanaWorkspaceId(storedAsanaWorkspaceId);
    }
    const storedNotionPageId = localStorage.getItem('notionPageId');
    if (storedNotionPageId) {
      setNotionPageId(storedNotionPageId);
    }
  }, []);

  const handleTrelloConnect = async () => {
    if (!trelloAccessToken) {
      const response = await fetch('/api/trello-auth');
      const data = await response.json();
      window.location.href = data.url;
    } else {
      const response = await fetch('/api/trello-board', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${trelloAccessToken}`,
        },
      });
      const data = await response.json();
      setTrelloBoardId(data.id);
      localStorage.setItem('trelloBoardId', data.id);
    }
  };

  const handleAsanaConnect = async () => {
    if (!asanaAccessToken) {
      const response = await fetch('/api/asana-auth');
      const data = await response.json();
      window.location.href = data.url;
    } else {
      const response = await fetch('/api/asana-workspace', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${asanaAccessToken}`,
        },
      });
      const data = await response.json();
      setAsanaWorkspaceId(data.id);
      localStorage.setItem('asanaWorkspaceId', data.id);
    }
  };

  const handleNotionConnect = async () => {
    if (!notionAccessToken) {
      const response = await fetch('/api/notion-auth');
      const data = await response.json();
      window.location.href = data.url;
    } else {
      const response = await fetch('/api/notion-page', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${notionAccessToken}`,
        },
      });
      const data = await response.json();
      setNotionPageId(data.id);
      localStorage.setItem('notionPageId', data.id);
    }
  };

  const handleTrelloSync = async () => {
    if (trelloAccessToken && trelloBoardId) {
      const response = await fetch('/api/trello-sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${trelloAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardId: trelloBoardId,
        }),
      });
      const data = await response.json();
      setTrelloEvents(data.events);
    }
  };

  const handleAsanaSync = async () => {
    if (asanaAccessToken && asanaWorkspaceId) {
      const response = await fetch('/api/asana-sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${asanaAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: asanaWorkspaceId,
        }),
      });
      const data = await response.json();
      setAsanaEvents(data.events);
    }
  };

  const handleNotionSync = async () => {
    if (notionAccessToken && notionPageId) {
      const response = await fetch('/api/notion-sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: notionPageId,
        }),
      });
      const data = await response.json();
      setNotionEvents(data.events);
    }
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date)}
          onEventDrop={(event) => setEvents((prevEvents) => [...prevEvents, event])}
        />
        <div>
          <h2>Integrations</h2>
          <GoogleCalendar
            isConnected={isGoogleCalendarConnected}
            onConnect={() => {
              // handle google calendar connect
            }}
          />
          <OutlookCalendar
            isConnected={isOutlookCalendarConnected}
            onConnect={() => {
              // handle outlook calendar connect
            }}
          />
          <TrelloIntegration
            isConnected={isTrelloConnected}
            onConnect={handleTrelloConnect}
            onSync={handleTrelloSync}
          />
          <AsanaIntegration
            isConnected={isAsanaConnected}
            onConnect={handleAsanaConnect}
            onSync={handleAsanaSync}
          />
          <NotionIntegration
            isConnected={isNotionConnected}
            onConnect={handleNotionConnect}
            onSync={handleNotionSync}
          />
        </div>
        <div>
          <h2>Events</h2>
          <ul>
            {events.map((event) => (
              <li key={event.id}>{event.title}</li>
            ))}
          </ul>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;