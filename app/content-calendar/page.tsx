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
    { name: 'Google Calendar', component: <GoogleCalendar />, isConnected: isGoogleCalendarConnected },
    { name: 'Outlook Calendar', component: <OutlookCalendar />, isConnected: isOutlookCalendarConnected },
    { name: 'Apple Calendar', component: <AppleCalendar />, isConnected: isAppleCalendarConnected },
    { name: 'Trello', component: <TrelloIntegration />, isConnected: isTrelloConnected },
    { name: 'Asana', component: <AsanaIntegration />, isConnected: isAsanaConnected },
    { name: 'Notion', component: <NotionIntegration />, isConnected: isNotionConnected },
    { name: 'Slack', component: <SlackIntegration />, isConnected: isSlackConnected },
    { name: 'Microsoft Teams', component: <MicrosoftTeamsIntegration />, isConnected: isMicrosoftTeamsConnected },
  ];

  const handleIntegrationClick = (integration: string) => {
    setSelectedIntegration(integration);
  };

  const handleConnectClick = (integration: string) => {
    // Handle connection logic for each integration
    if (integration === 'Google Calendar') {
      setIsGoogleCalendarConnected(true);
    } else if (integration === 'Outlook Calendar') {
      setIsOutlookCalendarConnected(true);
    } else if (integration === 'Apple Calendar') {
      setIsAppleCalendarConnected(true);
    } else if (integration === 'Trello') {
      setIsTrelloConnected(true);
    } else if (integration === 'Asana') {
      setIsAsanaConnected(true);
    } else if (integration === 'Notion') {
      setIsNotionConnected(true);
    } else if (integration === 'Slack') {
      setIsSlackConnected(true);
    } else if (integration === 'Microsoft Teams') {
      setIsMicrosoftTeamsConnected(true);
    }
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-screen">
          <div className="flex flex-row justify-between items-center p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Content Calendar</h1>
            <div className="flex flex-row space-x-4">
              {integrations.map((integration) => (
                <button
                  key={integration.name}
                  className={`px-4 py-2 rounded-lg ${integration.isConnected ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                  onClick={() => handleIntegrationClick(integration.name)}
                >
                  {integration.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-row flex-grow p-4">
            <div className="w-1/3">
              {integrations.map((integration) => (
                <div key={integration.name}>
                  {integration.component}
                  {!integration.isConnected && (
                    <button
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                      onClick={() => handleConnectClick(integration.name)}
                    >
                      Connect
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="w-2/3">
              <Calendar
                events={events}
                selectedDate={selectedDate}
                onDateChange={(date) => setSelectedDate(date)}
                onEventDrop={(event) => setDraggedEvent(event)}
                onEventHover={(event) => setHoveredEvent(event)}
              />
            </div>
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;