import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GoogleCalendar, OutlookCalendar, AppleCalendar } from '../components/CalendarIntegrations';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import { TrelloIntegration, AsanaIntegration, NotionIntegration } from '../components/ProjectManagementIntegrations';
import { DraggableEvent, DroppableCalendar } from '../components/DraggableEvent';
import { SlackIntegration, MicrosoftTeamsIntegration } from '../components/CommunicationIntegrations';

const ContentCalendarPage = () => {
  const pathname = usePathname();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<CalendarEvent[]>([]);
  const [outlookCalendarEvents, setOutlookCalendarEvents] = useState<CalendarEvent[]>([]);
  const [appleCalendarEvents, setAppleCalendarEvents] = useState<CalendarEvent[]>([]);
  const [trelloEvents, setTrelloEvents] = useState<CalendarEvent[]>([]);
  const [asanaEvents, setAsanaEvents] = useState<CalendarEvent[]>([]);
  const [notionEvents, setNotionEvents] = useState<CalendarEvent[]>([]);
  const [slackEvents, setSlackEvents] = useState<CalendarEvent[]>([]);
  const [microsoftTeamsEvents, setMicrosoftTeamsEvents] = useState<CalendarEvent[]>([]);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [isOutlookCalendarConnected, setIsOutlookCalendarConnected] = useState(false);
  const [isAppleCalendarConnected, setIsAppleCalendarConnected] = useState(false);
  const [isTrelloConnected, setIsTrelloConnected] = useState(false);
  const [isAsanaConnected, setIsAsanaConnected] = useState(false);
  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [isSlackConnected, setIsSlackConnected] = useState(false);
  const [isMicrosoftTeamsConnected, setIsMicrosoftTeamsConnected] = useState(false);
  const [googleCalendarAccessToken, setGoogleCalendarAccessToken] = useState<string | null>(null);
  const [outlookCalendarAccessToken, setOutlookCalendarAccessToken] = useState<string | null>(null);
  const [appleCalendarAccessToken, setAppleCalendarAccessToken] = useState<string | null>(null);
  const [slackAccessToken, setSlackAccessToken] = useState<string | null>(null);
  const [microsoftTeamsAccessToken, setMicrosoftTeamsAccessToken] = useState<string | null>(null);
  const [ssoToken, setSsoToken] = useState<string | null>(null);

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
  };

  const handleDrop = (event: CalendarEvent, date: Date) => {
    const updatedEvents = events.map((e) => {
      if (e.id === event.id) {
        return { ...e, startDate: date };
      }
      return e;
    });
    setEvents(updatedEvents);
  };

  const handleHover = (event: CalendarEvent) => {
    setHoveredEvent(event);
  };

  const handleUnhover = () => {
    setHoveredEvent(null);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      // Fetch events from API or database
      const fetchedEvents = await fetch('/api/events')
        .then((response) => response.json())
        .catch((error) => console.error(error));
      setEvents(fetchedEvents);
    };
    fetchEvents();
  }, []);

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <DroppableCalendar
          events={events}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onHover={handleHover}
          onUnhover={handleUnhover}
        >
          {events.map((event) => (
            <DraggableEvent key={event.id} event={event} />
          ))}
        </DroppableCalendar>
      </DndProvider>
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
      <TrelloIntegration
        isConnected={isTrelloConnected}
        events={trelloEvents}
      />
      <AsanaIntegration
        isConnected={isAsanaConnected}
        events={asanaEvents}
      />
      <NotionIntegration
        isConnected={isNotionConnected}
        events={notionEvents}
      />
      <SlackIntegration
        isConnected={isSlackConnected}
        accessToken={slackAccessToken}
        events={slackEvents}
      />
      <MicrosoftTeamsIntegration
        isConnected={isMicrosoftTeamsConnected}
        accessToken={microsoftTeamsAccessToken}
        events={microsoftTeamsEvents}
      />
    </Layout>
  );
};

export default ContentCalendarPage;