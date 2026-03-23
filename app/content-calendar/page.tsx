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
  const [integrationTokens, setIntegrationTokens] = useState({
    googleCalendar: null,
    outlookCalendar: null,
    appleCalendar: null,
    slack: null,
    microsoftTeams: null,
  });
  const [ssoToken, setSsoToken] = useState<string | null>(null);

  const handleDragStart = () => {
    // existing functionality
  };

  const handleIntegrationConnect = (integration: string, token: string) => {
    setIntegrationTokens((prevTokens) => ({ ...prevTokens, [integration]: token }));
  };

  const handleIntegrationDisconnect = (integration: string) => {
    setIntegrationTokens((prevTokens) => ({ ...prevTokens, [integration]: null }));
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date)}
          onEventDragStart={(event) => setDraggedEvent(event)}
          onEventDragEnd={(event) => setDraggedEvent(null)}
          onEventHover={(event) => setHoveredEvent(event)}
          onEventHoverEnd={(event) => setHoveredEvent(null)}
        >
          <DroppableCalendar />
        </Calendar>
        <GoogleCalendar
          isConnected={isGoogleCalendarConnected}
          onConnect={() => handleIntegrationConnect('googleCalendar', 'token')}
          onDisconnect={() => handleIntegrationDisconnect('googleCalendar')}
        />
        <OutlookCalendar
          isConnected={isOutlookCalendarConnected}
          onConnect={() => handleIntegrationConnect('outlookCalendar', 'token')}
          onDisconnect={() => handleIntegrationDisconnect('outlookCalendar')}
        />
        <AppleCalendar
          isConnected={isAppleCalendarConnected}
          onConnect={() => handleIntegrationConnect('appleCalendar', 'token')}
          onDisconnect={() => handleIntegrationDisconnect('appleCalendar')}
        />
        <TrelloIntegration
          isConnected={isTrelloConnected}
          onConnect={() => handleIntegrationConnect('trello', 'token')}
          onDisconnect={() => handleIntegrationDisconnect('trello')}
        />
        <AsanaIntegration
          isConnected={isAsanaConnected}
          onConnect={() => handleIntegrationConnect('asana', 'token')}
          onDisconnect={() => handleIntegrationDisconnect('asana')}
        />
        <NotionIntegration
          isConnected={isNotionConnected}
          onConnect={() => handleIntegrationConnect('notion', 'token')}
          onDisconnect={() => handleIntegrationDisconnect('notion')}
        />
        <SlackIntegration
          isConnected={isSlackConnected}
          onConnect={() => handleIntegrationConnect('slack', 'token')}
          onDisconnect={() => handleIntegrationDisconnect('slack')}
        />
        <MicrosoftTeamsIntegration
          isConnected={isMicrosoftTeamsConnected}
          onConnect={() => handleIntegrationConnect('microsoftTeams', 'token')}
          onDisconnect={() => handleIntegrationDisconnect('microsoftTeams')}
        />
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;