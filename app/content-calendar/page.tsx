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
    }
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <DroppableCalendar onDrop={handleDrop}>
          <Calendar
            events={events}
            selectedDate={selectedDate}
            onDateChange={(date) => setSelectedDate(date)}
            onEventDragStart={handleDragStart}
            onEventDragEnd={handleDragEnd}
          >
            {events.map((event) => (
              <DraggableEvent key={event.id} event={event} />
            ))}
          </Calendar>
        </DroppableCalendar>
        <GoogleCalendar
          isConnected={isGoogleCalendarConnected}
          onConnect={() => setIsGoogleCalendarConnected(true)}
          accessToken={googleCalendarAccessToken}
          events={googleCalendarEvents}
          onEventsChange={(events) => setGoogleCalendarEvents(events)}
        />
        <OutlookCalendar
          isConnected={isOutlookCalendarConnected}
          onConnect={() => setIsOutlookCalendarConnected(true)}
          accessToken={outlookCalendarAccessToken}
          events={outlookCalendarEvents}
          onEventsChange={(events) => setOutlookCalendarEvents(events)}
        />
        <AppleCalendar
          isConnected={isAppleCalendarConnected}
          onConnect={() => setIsAppleCalendarConnected(true)}
          accessToken={appleCalendarAccessToken}
          events={appleCalendarEvents}
          onEventsChange={(events) => setAppleCalendarEvents(events)}
        />
        <MicrosoftExchangeCalendar
          isConnected={isMicrosoftExchangeCalendarConnected}
          onConnect={() => setIsMicrosoftExchangeCalendarConnected(true)}
          accessToken={microsoftExchangeCalendarAccessToken}
          events={microsoftExchangeCalendarEvents}
          onEventsChange={(events) => setMicrosoftExchangeCalendarEvents(events)}
        />
        <TrelloIntegration
          isConnected={isTrelloConnected}
          onConnect={() => setIsTrelloConnected(true)}
          accessToken={trelloAccessToken}
          boardId={trelloBoardId}
          events={trelloEvents}
          onEventsChange={(events) => setTrelloEvents(events)}
        />
        <AsanaIntegration
          isConnected={isAsanaConnected}
          onConnect={() => setIsAsanaConnected(true)}
          accessToken={asanaAccessToken}
          events={asanaEvents}
          onEventsChange={(events) => setAsanaEvents(events)}
        />
        <NotionIntegration
          isConnected={isNotionConnected}
          onConnect={() => setIsNotionConnected(true)}
          accessToken={notionAccessToken}
          events={notionEvents}
          onEventsChange={(events) => setNotionEvents(events)}
        />
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;