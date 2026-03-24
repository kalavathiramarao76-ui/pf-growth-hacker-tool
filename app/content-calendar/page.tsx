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
    { name: 'Google Calendar', component: GoogleCalendar, isConnected: isGoogleCalendarConnected },
    { name: 'Outlook Calendar', component: OutlookCalendar, isConnected: isOutlookCalendarConnected },
    { name: 'Apple Calendar', component: AppleCalendar, isConnected: isAppleCalendarConnected },
    { name: 'Trello', component: TrelloIntegration, isConnected: isTrelloConnected },
    { name: 'Asana', component: AsanaIntegration, isConnected: isAsanaConnected },
    { name: 'Notion', component: NotionIntegration, isConnected: isNotionConnected },
    { name: 'Slack', component: SlackIntegration, isConnected: isSlackConnected },
    { name: 'Microsoft Teams', component: MicrosoftTeamsIntegration, isConnected: isMicrosoftTeamsConnected },
  ];

  const handleIntegrationConnect = (integration: string) => {
    setSelectedIntegration(integration);
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

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          draggedEvent={draggedEvent}
          hoveredEvent={hoveredEvent}
          onDateChange={(date) => setSelectedDate(date)}
          onEventDrag={(event) => setDraggedEvent(event)}
          onEventHover={(event) => setHoveredEvent(event)}
        />
        <div>
          {integrations.map((integration) => (
            <div key={integration.name}>
              <Tooltip text={integration.name}>
                <Image src={`/icons/${integration.name.toLowerCase().replace(' ', '-')}.svg`} width={24} height={24} />
              </Tooltip>
              {integration.isConnected ? (
                <button onClick={() => handleIntegrationConnect(integration.name)}>Connected</button>
              ) : (
                <button onClick={() => handleIntegrationConnect(integration.name)}>Connect</button>
              )}
            </div>
          ))}
        </div>
        {selectedIntegration && (
          <div>
            <selectedIntegration.component />
          </div>
        )}
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;