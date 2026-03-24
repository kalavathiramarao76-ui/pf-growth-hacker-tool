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
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const integrations = [
    { name: 'Google Calendar', isConnected: isGoogleCalendarConnected, component: <GoogleCalendar /> },
    { name: 'Outlook Calendar', isConnected: isOutlookCalendarConnected, component: <OutlookCalendar /> },
    { name: 'Apple Calendar', isConnected: isAppleCalendarConnected, component: <AppleCalendar /> },
    { name: 'Trello', isConnected: isTrelloConnected, component: <TrelloIntegration /> },
    { name: 'Asana', isConnected: isAsanaConnected, component: <AsanaIntegration /> },
    { name: 'Notion', isConnected: isNotionConnected, component: <NotionIntegration /> },
    { name: 'Slack', isConnected: isSlackConnected, component: <SlackIntegration /> },
    { name: 'Microsoft Teams', isConnected: isMicrosoftTeamsConnected, component: <MicrosoftTeamsIntegration /> },
  ];

  const handleIntegrationConnect = (integration: string) => {
    switch (integration) {
      case 'Google Calendar':
        setIsGoogleCalendarConnected(true);
        break;
      case 'Outlook Calendar':
        setIsOutlookCalendarConnected(true);
        break;
      case 'Apple Calendar':
        setIsAppleCalendarConnected(true);
        break;
      case 'Trello':
        setIsTrelloConnected(true);
        break;
      case 'Asana':
        setIsAsanaConnected(true);
        break;
      case 'Notion':
        setIsNotionConnected(true);
        break;
      case 'Slack':
        setIsSlackConnected(true);
        break;
      case 'Microsoft Teams':
        setIsMicrosoftTeamsConnected(true);
        break;
      default:
        break;
    }
  };

  const handleIntegrationDisconnect = (integration: string) => {
    switch (integration) {
      case 'Google Calendar':
        setIsGoogleCalendarConnected(false);
        break;
      case 'Outlook Calendar':
        setIsOutlookCalendarConnected(false);
        break;
      case 'Apple Calendar':
        setIsAppleCalendarConnected(false);
        break;
      case 'Trello':
        setIsTrelloConnected(false);
        break;
      case 'Asana':
        setIsAsanaConnected(false);
        break;
      case 'Notion':
        setIsNotionConnected(false);
        break;
      case 'Slack':
        setIsSlackConnected(false);
        break;
      case 'Microsoft Teams':
        setIsMicrosoftTeamsConnected(false);
        break;
      default:
        break;
    }
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date)}
          onEventDrop={(event) => setDraggedEvent(event)}
          onEventHover={(event) => setHoveredEvent(event)}
        />
        <div>
          {integrations.map((integration) => (
            <div key={integration.name}>
              <Tooltip title={integration.name}>
                {integration.component}
              </Tooltip>
              {integration.isConnected ? (
                <button onClick={() => handleIntegrationDisconnect(integration.name)}>Disconnect</button>
              ) : (
                <button onClick={() => handleIntegrationConnect(integration.name)}>Connect</button>
              )}
            </div>
          ))}
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;