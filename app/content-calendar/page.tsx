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
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
    setDragging(false);
  };

  const handleDrop = (event: CalendarEvent, date: Date) => {
    if (draggedEvent) {
      const updatedEvents = events.map((e) => {
        if (e.id === draggedEvent.id) {
          return { ...e, startDate: date };
        }
        return e;
      });
      setEvents(updatedEvents);
    }
  };

  const handleViewChange = (view: 'day' | 'week' | 'month') => {
    setView(view);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      // fetch events from API or database
      const fetchedEvents = await fetch('/api/events');
      const data = await fetchedEvents.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="content-calendar">
          <div className="calendar-header">
            <button onClick={() => handleViewChange('day')}>Day</button>
            <button onClick={() => handleViewChange('week')}>Week</button>
            <button onClick={() => handleViewChange('month')}>Month</button>
          </div>
          <DroppableCalendar
            events={events}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            view={view}
          >
            {events.map((event) => (
              <DraggableEvent key={event.id} event={event} />
            ))}
          </DroppableCalendar>
          <div className="calendar-integrations">
            <GoogleCalendar
              isConnected={isGoogleCalendarConnected}
              accessToken={googleCalendarAccessToken}
              events={googleCalendarEvents}
            />
            <OutlookCalendar
              isConnected={isOutlookCalendarConnected}
              accessToken={outlookCalendarAccessToken}
              events={outlookCalendarEvents}
            />
            <AppleCalendar
              isConnected={isAppleCalendarConnected}
              accessToken={appleCalendarAccessToken}
              events={appleCalendarEvents}
            />
            <MicrosoftExchangeCalendar
              isConnected={isMicrosoftExchangeCalendarConnected}
              accessToken={microsoftExchangeCalendarAccessToken}
              events={microsoftExchangeCalendarEvents}
            />
            <GoogleWorkspaceCalendar
              isConnected={isGoogleWorkspaceCalendarConnected}
              accessToken={googleWorkspaceCalendarAccessToken}
              events={googleWorkspaceCalendarEvents}
            />
            <MicrosoftTeamsCalendar
              isConnected={isMicrosoftTeamsCalendarConnected}
              accessToken={microsoftTeamsCalendarAccessToken}
              events={microsoftTeamsCalendarEvents}
            />
          </div>
          <div className="project-management-integrations">
            <TrelloIntegration
              isConnected={isTrelloConnected}
              accessToken={trelloAccessToken}
              events={trelloEvents}
            />
            <AsanaIntegration
              isConnected={isAsanaConnected}
              accessToken={asanaAccessToken}
              events={asanaEvents}
            />
            <NotionIntegration
              isConnected={isNotionConnected}
              accessToken={notionAccessToken}
              events={notionEvents}
            />
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;