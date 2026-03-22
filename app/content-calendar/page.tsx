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

  const handleTrelloIntegration = async () => {
    if (isTrelloConnected) {
      const response = await fetch(`https://api.trello.com/1/members/me/boards?key=${process.env.TRELLO_API_KEY}&token=${trelloAccessToken}`);
      const boards = await response.json();
      const board = boards.find((board: any) => board.id === trelloBoardId);
      if (board) {
        const response = await fetch(`https://api.trello.com/1/boards/${board.id}/lists?key=${process.env.TRELLO_API_KEY}&token=${trelloAccessToken}`);
        const lists = await response.json();
        const list = lists.find((list: any) => list.id === 'list-id');
        if (list) {
          const response = await fetch(`https://api.trello.com/1/lists/${list.id}/cards?key=${process.env.TRELLO_API_KEY}&token=${trelloAccessToken}`);
          const cards = await response.json();
          setTrelloEvents(cards.map((card: any) => ({ title: card.name, date: new Date(card.due) })));
        }
      }
    }
  };

  const handleAsanaIntegration = async () => {
    if (isAsanaConnected) {
      const response = await fetch(`https://app.asana.com/api/1.0/workspaces/${asanaWorkspaceId}/tasks?opt_fields=name,due_on&limit=100&offset=0`, {
        headers: {
          'Authorization': `Bearer ${asanaAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const tasks = await response.json();
      setAsanaEvents(tasks.data.map((task: any) => ({ title: task.name, date: new Date(task.due_on) })));
    }
  };

  const handleNotionIntegration = async () => {
    if (isNotionConnected) {
      const response = await fetch(`https://api.notion.com/v1/pages/${notionPageId}`, {
        headers: {
          'Authorization': `Bearer ${notionAccessToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        }
      });
      const page = await response.json();
      const blocks = page.result.block.children;
      setNotionEvents(blocks.map((block: any) => ({ title: block.text.content, date: new Date(block.created_time) })));
    }
  };

  useEffect(() => {
    handleTrelloIntegration();
    handleAsanaIntegration();
    handleNotionIntegration();
  }, [isTrelloConnected, isAsanaConnected, isNotionConnected]);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={(date: Date) => setSelectedDate(date)}
          onEventDrop={(event: CalendarEvent) => setEvents((prevEvents: CalendarEvent[]) => [...prevEvents, event])}
        >
          {events.map((event: CalendarEvent) => (
            <DraggableEvent
              key={event.title}
              event={event}
              onDragStart={() => setDraggedEvent(event)}
              onDragEnd={() => setDraggedEvent(null)}
            />
          ))}
        </Calendar>
        <GoogleCalendar
          isConnected={isGoogleCalendarConnected}
          accessToken={googleCalendarAccessToken}
          onConnect={() => {
            // handle Google Calendar connection
          }}
        />
        <OutlookCalendar
          isConnected={isOutlookCalendarConnected}
          accessToken={outlookCalendarAccessToken}
          onConnect={() => {
            // handle Outlook Calendar connection
          }}
        />
        <TrelloIntegration
          isConnected={isTrelloConnected}
          accessToken={trelloAccessToken}
          boardId={trelloBoardId}
          onConnect={() => {
            // handle Trello connection
          }}
        />
        <AsanaIntegration
          isConnected={isAsanaConnected}
          accessToken={asanaAccessToken}
          workspaceId={asanaWorkspaceId}
          onConnect={() => {
            // handle Asana connection
          }}
        />
        <NotionIntegration
          isConnected={isNotionConnected}
          accessToken={notionAccessToken}
          pageId={notionPageId}
          onConnect={() => {
            // handle Notion connection
          }}
        />
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;