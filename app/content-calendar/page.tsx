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
      const trelloEventsResponse = await fetch(`https://api.trello.com/1/lists/${trelloBoardId}/cards`, {
        headers: {
          'Authorization': `Bearer ${trelloAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const trelloEventsData = await trelloEventsResponse.json();
      const trelloEvents = trelloEventsData.map((event: any) => ({
        id: event.id,
        title: event.name,
        description: event.desc,
        startDate: new Date(event.due),
        endDate: new Date(event.due)
      }));
      setTrelloEvents(trelloEvents);
    }
  };

  const handleAsanaIntegration = async () => {
    if (isAsanaConnected) {
      const asanaEventsResponse = await fetch(`https://app.asana.com/api/1.0/workspaces/${asanaWorkspaceId}/tasks`, {
        headers: {
          'Authorization': `Bearer ${asanaAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const asanaEventsData = await asanaEventsResponse.json();
      const asanaEvents = asanaEventsData.data.map((event: any) => ({
        id: event.id,
        title: event.name,
        description: event.notes,
        startDate: new Date(event.due_on),
        endDate: new Date(event.due_on)
      }));
      setAsanaEvents(asanaEvents);
    }
  };

  const handleNotionIntegration = async () => {
    if (isNotionConnected) {
      const notionEventsResponse = await fetch(`https://api.notion.com/v1/pages/${notionPageId}`, {
        headers: {
          'Authorization': `Bearer ${notionAccessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const notionEventsData = await notionEventsResponse.json();
      const notionEvents = notionEventsData.results.map((event: any) => ({
        id: event.id,
        title: event.properties.title.title[0].plain_text,
        description: event.properties.description.rich_text[0].plain_text,
        startDate: new Date(event.properties.start_date.date.start),
        endDate: new Date(event.properties.end_date.date.end)
      }));
      setNotionEvents(notionEvents);
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
            <DraggableEvent key={event.id} event={event} />
          ))}
        </Calendar>
        <GoogleCalendar
          isConnected={isGoogleCalendarConnected}
          onConnect={() => {
            // handle Google Calendar connection
          }}
          onDisconnect={() => {
            // handle Google Calendar disconnection
          }}
        />
        <OutlookCalendar
          isConnected={isOutlookCalendarConnected}
          onConnect={() => {
            // handle Outlook Calendar connection
          }}
          onDisconnect={() => {
            // handle Outlook Calendar disconnection
          }}
        />
        <TrelloIntegration
          isConnected={isTrelloConnected}
          onConnect={() => {
            // handle Trello connection
          }}
          onDisconnect={() => {
            // handle Trello disconnection
          }}
        />
        <AsanaIntegration
          isConnected={isAsanaConnected}
          onConnect={() => {
            // handle Asana connection
          }}
          onDisconnect={() => {
            // handle Asana disconnection
          }}
        />
        <NotionIntegration
          isConnected={isNotionConnected}
          onConnect={() => {
            // handle Notion connection
          }}
          onDisconnect={() => {
            // handle Notion disconnection
          }}
        />
        <Tooltip>
          <Image src="/calendar-icon.png" alt="Calendar Icon" width={20} height={20} />
        </Tooltip>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;