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
import { Socket } from '../utils/socket';

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
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [realTimeEvents, setRealTimeEvents] = useState<CalendarEvent[]>([]);

  const socket = new Socket();

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      console.log('Connected to the server');
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
    socket.on('realTimeEvents', (events: CalendarEvent[]) => {
      setRealTimeEvents(events);
    });
    socket.on('collaborators', (collaborators: string[]) => {
      setCollaborators(collaborators);
    });
  }, []);

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
    socket.emit('dragStart', event);
  };

  const handleDragEnd = (event: CalendarEvent) => {
    setDraggedEvent(null);
    socket.emit('dragEnd', event);
  };

  const handleDrop = (event: CalendarEvent) => {
    socket.emit('drop', event);
  };

  const handleIntegrationConnect = (integration: string, token: string) => {
    setIntegrationTokens((prevTokens) => ({ ...prevTokens, [integration]: token }));
    socket.emit('integrationConnect', integration, token);
  };

  const handleIntegrationDisconnect = (integration: string) => {
    setIntegrationTokens((prevTokens) => ({ ...prevTokens, [integration]: null }));
    socket.emit('integrationDisconnect', integration);
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <DroppableCalendar
          events={events}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        >
          {events.map((event) => (
            <DraggableEvent key={event.id} event={event} />
          ))}
        </DroppableCalendar>
      </DndProvider>
      <GoogleCalendar
        isConnected={isGoogleCalendarConnected}
        onConnect={() => handleIntegrationConnect('googleCalendar', integrationTokens.googleCalendar)}
        onDisconnect={() => handleIntegrationDisconnect('googleCalendar')}
      />
      <OutlookCalendar
        isConnected={isOutlookCalendarConnected}
        onConnect={() => handleIntegrationConnect('outlookCalendar', integrationTokens.outlookCalendar)}
        onDisconnect={() => handleIntegrationDisconnect('outlookCalendar')}
      />
      <AppleCalendar
        isConnected={isAppleCalendarConnected}
        onConnect={() => handleIntegrationConnect('appleCalendar', integrationTokens.appleCalendar)}
        onDisconnect={() => handleIntegrationDisconnect('appleCalendar')}
      />
      <TrelloIntegration
        isConnected={isTrelloConnected}
        onConnect={() => handleIntegrationConnect('trello', integrationTokens.trello)}
        onDisconnect={() => handleIntegrationDisconnect('trello')}
      />
      <AsanaIntegration
        isConnected={isAsanaConnected}
        onConnect={() => handleIntegrationConnect('asana', integrationTokens.asana)}
        onDisconnect={() => handleIntegrationDisconnect('asana')}
      />
      <NotionIntegration
        isConnected={isNotionConnected}
        onConnect={() => handleIntegrationConnect('notion', integrationTokens.notion)}
        onDisconnect={() => handleIntegrationDisconnect('notion')}
      />
      <SlackIntegration
        isConnected={isSlackConnected}
        onConnect={() => handleIntegrationConnect('slack', integrationTokens.slack)}
        onDisconnect={() => handleIntegrationDisconnect('slack')}
      />
      <MicrosoftTeamsIntegration
        isConnected={isMicrosoftTeamsConnected}
        onConnect={() => handleIntegrationConnect('microsoftTeams', integrationTokens.microsoftTeams)}
        onDisconnect={() => handleIntegrationDisconnect('microsoftTeams')}
      />
      <div>
        <h2>Collaborators:</h2>
        <ul>
          {collaborators.map((collaborator) => (
            <li key={collaborator}>{collaborator}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Real-time Events:</h2>
        <ul>
          {realTimeEvents.map((event) => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default ContentCalendarPage;