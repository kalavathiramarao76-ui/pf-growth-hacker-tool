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
    const storedGoogleCalendarAccessToken = localStorage.getItem('googleCalendarAccessToken');
    if (storedGoogleCalendarAccessToken) {
      setGoogleCalendarAccessToken(storedGoogleCalendarAccessToken);
    }
    const storedOutlookCalendarAccessToken = localStorage.getItem('outlookCalendarAccessToken');
    if (storedOutlookCalendarAccessToken) {
      setOutlookCalendarAccessToken(storedOutlookCalendarAccessToken);
    }
    const storedTrelloAccessToken = localStorage.getItem('trelloAccessToken');
    if (storedTrelloAccessToken) {
      setTrelloAccessToken(storedTrelloAccessToken);
    }
    const storedAsanaAccessToken = localStorage.getItem('asanaAccessToken');
    if (storedAsanaAccessToken) {
      setAsanaAccessToken(storedAsanaAccessToken);
    }
    const storedNotionAccessToken = localStorage.getItem('notionAccessToken');
    if (storedNotionAccessToken) {
      setNotionAccessToken(storedNotionAccessToken);
    }
  }, []);

  useEffect(() => {
    if (isGoogleCalendarConnected && googleCalendarAccessToken) {
      fetchGoogleCalendarEvents();
    }
    if (isOutlookCalendarConnected && outlookCalendarAccessToken) {
      fetchOutlookCalendarEvents();
    }
    if (isTrelloConnected && trelloAccessToken) {
      fetchTrelloEvents();
    }
    if (isAsanaConnected && asanaAccessToken) {
      fetchAsanaEvents();
    }
    if (isNotionConnected && notionAccessToken) {
      fetchNotionEvents();
    }
  }, [isGoogleCalendarConnected, googleCalendarAccessToken, isOutlookCalendarConnected, outlookCalendarAccessToken, isTrelloConnected, trelloAccessToken, isAsanaConnected, asanaAccessToken, isNotionConnected, notionAccessToken]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventCreate = (event: CalendarEvent) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const fetchGoogleCalendarEvents = async () => {
    const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/events', {
      headers: {
        Authorization: `Bearer ${googleCalendarAccessToken}`,
      },
    });
    const data = await response.json();
    setGoogleCalendarEvents(data.items);
  };

  const fetchOutlookCalendarEvents = async () => {
    const response = await fetch('https://outlook.office.com/api/v2.0/me/events', {
      headers: {
        Authorization: `Bearer ${outlookCalendarAccessToken}`,
      },
    });
    const data = await response.json();
    setOutlookCalendarEvents(data.value);
  };

  const fetchTrelloEvents = async () => {
    const response = await fetch(`https://api.trello.com/1/members/me/cards?key=${process.env.TRELLO_API_KEY}&token=${trelloAccessToken}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setTrelloEvents(data.map((card: any) => ({ title: card.name, date: new Date(card.due ) })));
  };

  const fetchAsanaEvents = async () => {
    const response = await fetch(`https://app.asana.com/api/1.0/tasks?workspace=${process.env.ASANA_WORKSPACE_ID}&assignee=${process.env.ASANA_ASSIGNEE_ID}&api_key=${asanaAccessToken}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setAsanaEvents(data.data.map((task: any) => ({ title: task.name, date: new Date(task.due_date ) })));
  };

  const fetchNotionEvents = async () => {
    const response = await fetch(`https://api.notion.com/v1/pages?database_id=${process.env.NOTION_DATABASE_ID}&api_key=${notionAccessToken}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setNotionEvents(data.results.map((page: any) => ({ title: page.properties.Name.title[0].plain_text, date: new Date(page.properties.Date.date.start ) })));
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onEventCreate={handleEventCreate}
        />
        <GoogleCalendar
          isConnected={isGoogleCalendarConnected}
          onConnect={() => {
            // Implement Google Calendar connection logic
          }}
        />
        <OutlookCalendar
          isConnected={isOutlookCalendarConnected}
          onConnect={() => {
            // Implement Outlook Calendar connection logic
          }}
        />
        <TrelloIntegration
          isConnected={isTrelloConnected}
          onConnect={() => {
            // Implement Trello connection logic
          }}
        />
        <AsanaIntegration
          isConnected={isAsanaConnected}
          onConnect={() => {
            // Implement Asana connection logic
          }}
        />
        <NotionIntegration
          isConnected={isNotionConnected}
          onConnect={() => {
            // Implement Notion connection logic
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