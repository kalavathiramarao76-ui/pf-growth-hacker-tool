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
  }, []);

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
  };

  const handleDrop = (event: CalendarEvent) => {
    if (draggedEvent) {
      const updatedEvents = events.map((e) => {
        if (e.id === draggedEvent.id) {
          return { ...e, date: event.date };
        }
        return e;
      });
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  };

  const handleGoogleCalendarConnect = () => {
    // Implement Google Calendar connection logic
    setIsGoogleCalendarConnected(true);
    localStorage.setItem('isGoogleCalendarConnected', 'true');
  };

  const handleOutlookCalendarConnect = () => {
    // Implement Outlook Calendar connection logic
    setIsOutlookCalendarConnected(true);
    localStorage.setItem('isOutlookCalendarConnected', 'true');
  };

  const handleTrelloConnect = () => {
    // Implement Trello connection logic
    setIsTrelloConnected(true);
    localStorage.setItem('isTrelloConnected', 'true');
  };

  const handleAsanaConnect = () => {
    // Implement Asana connection logic
    setIsAsanaConnected(true);
    localStorage.setItem('isAsanaConnected', 'true');
  };

  const handleNotionConnect = () => {
    // Implement Notion connection logic
    setIsNotionConnected(true);
    localStorage.setItem('isNotionConnected', 'true');
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      </DndProvider>
      <div>
        <h2>Calendar Integrations</h2>
        <button onClick={handleGoogleCalendarConnect}>
          Connect Google Calendar
        </button>
        {isGoogleCalendarConnected && (
          <GoogleCalendar
            accessToken={googleCalendarAccessToken}
            events={googleCalendarEvents}
          />
        )}
        <button onClick={handleOutlookCalendarConnect}>
          Connect Outlook Calendar
        </button>
        {isOutlookCalendarConnected && (
          <OutlookCalendar
            accessToken={outlookCalendarAccessToken}
            events={outlookCalendarEvents}
          />
        )}
      </div>
      <div>
        <h2>Project Management Integrations</h2>
        <button onClick={handleTrelloConnect}>
          Connect Trello
        </button>
        {isTrelloConnected && (
          <TrelloIntegration
            accessToken={trelloAccessToken}
            events={trelloEvents}
          />
        )}
        <button onClick={handleAsanaConnect}>
          Connect Asana
        </button>
        {isAsanaConnected && (
          <AsanaIntegration
            accessToken={asanaAccessToken}
            events={asanaEvents}
          />
        )}
        <button onClick={handleNotionConnect}>
          Connect Notion
        </button>
        {isNotionConnected && (
          <NotionIntegration
            accessToken={notionAccessToken}
            events={notionEvents}
          />
        )}
      </div>
    </Layout>
  );
};

export default ContentCalendarPage;