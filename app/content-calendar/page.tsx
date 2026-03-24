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
  const [integrationStep, setIntegrationStep] = useState(0);
  const [selectedIntegration, setSelectedIntegration] = useState('');

  const socket = new Socket();

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      console.log('Connected to socket');
    });
  }, []);

  const handleIntegration = (integration: string) => {
    setSelectedIntegration(integration);
    setIntegrationStep(1);
  };

  const handleConnectIntegration = () => {
    switch (selectedIntegration) {
      case 'googleCalendar':
        setIsGoogleCalendarConnected(true);
        break;
      case 'outlookCalendar':
        setIsOutlookCalendarConnected(true);
        break;
      case 'appleCalendar':
        setIsAppleCalendarConnected(true);
        break;
      case 'trello':
        setIsTrelloConnected(true);
        break;
      case 'asana':
        setIsAsanaConnected(true);
        break;
      case 'notion':
        setIsNotionConnected(true);
        break;
      case 'slack':
        setIsSlackConnected(true);
        break;
      case 'microsoftTeams':
        setIsMicrosoftTeamsConnected(true);
        break;
      default:
        break;
    }
    setIntegrationStep(0);
  };

  const handleDisconnectIntegration = () => {
    switch (selectedIntegration) {
      case 'googleCalendar':
        setIsGoogleCalendarConnected(false);
        break;
      case 'outlookCalendar':
        setIsOutlookCalendarConnected(false);
        break;
      case 'appleCalendar':
        setIsAppleCalendarConnected(false);
        break;
      case 'trello':
        setIsTrelloConnected(false);
        break;
      case 'asana':
        setIsAsanaConnected(false);
        break;
      case 'notion':
        setIsNotionConnected(false);
        break;
      case 'slack':
        setIsSlackConnected(false);
        break;
      case 'microsoftTeams':
        setIsMicrosoftTeamsConnected(false);
        break;
      default:
        break;
    }
    setIntegrationStep(0);
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          draggedEvent={draggedEvent}
          hoveredEvent={hoveredEvent}
          onEventDrop={(event: CalendarEvent) => {
            setEvents((prevEvents) => [...prevEvents, event]);
          }}
        />
        <div>
          <h2>Integrations</h2>
          <ul>
            <li>
              <button onClick={() => handleIntegration('googleCalendar')}>Google Calendar</button>
              {isGoogleCalendarConnected ? (
                <button onClick={handleDisconnectIntegration}>Disconnect</button>
              ) : (
                <button onClick={handleConnectIntegration}>Connect</button>
              )}
            </li>
            <li>
              <button onClick={() => handleIntegration('outlookCalendar')}>Outlook Calendar</button>
              {isOutlookCalendarConnected ? (
                <button onClick={handleDisconnectIntegration}>Disconnect</button>
              ) : (
                <button onClick={handleConnectIntegration}>Connect</button>
              )}
            </li>
            <li>
              <button onClick={() => handleIntegration('appleCalendar')}>Apple Calendar</button>
              {isAppleCalendarConnected ? (
                <button onClick={handleDisconnectIntegration}>Disconnect</button>
              ) : (
                <button onClick={handleConnectIntegration}>Connect</button>
              )}
            </li>
            <li>
              <button onClick={() => handleIntegration('trello')}>Trello</button>
              {isTrelloConnected ? (
                <button onClick={handleDisconnectIntegration}>Disconnect</button>
              ) : (
                <button onClick={handleConnectIntegration}>Connect</button>
              )}
            </li>
            <li>
              <button onClick={() => handleIntegration('asana')}>Asana</button>
              {isAsanaConnected ? (
                <button onClick={handleDisconnectIntegration}>Disconnect</button>
              ) : (
                <button onClick={handleConnectIntegration}>Connect</button>
              )}
            </li>
            <li>
              <button onClick={() => handleIntegration('notion')}>Notion</button>
              {isNotionConnected ? (
                <button onClick={handleDisconnectIntegration}>Disconnect</button>
              ) : (
                <button onClick={handleConnectIntegration}>Connect</button>
              )}
            </li>
            <li>
              <button onClick={() => handleIntegration('slack')}>Slack</button>
              {isSlackConnected ? (
                <button onClick={handleDisconnectIntegration}>Disconnect</button>
              ) : (
                <button onClick={handleConnectIntegration}>Connect</button>
              )}
            </li>
            <li>
              <button onClick={() => handleIntegration('microsoftTeams')}>Microsoft Teams</button>
              {isMicrosoftTeamsConnected ? (
                <button onClick={handleDisconnectIntegration}>Disconnect</button>
              ) : (
                <button onClick={handleConnectIntegration}>Connect</button>
              )}
            </li>
          </ul>
          {integrationStep === 1 && (
            <div>
              <h3>Connect {selectedIntegration}</h3>
              <button onClick={handleConnectIntegration}>Connect</button>
            </div>
          )}
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;