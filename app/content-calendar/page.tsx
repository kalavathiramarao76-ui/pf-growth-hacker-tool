import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GoogleCalendar, OutlookCalendar, AppleCalendar, ICalCalendar, ExchangeCalendar, YahooCalendar, ZohoCalendar } from '../components/CalendarIntegrations';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import { TrelloIntegration, AsanaIntegration, NotionIntegration, JiraIntegration, BasecampIntegration, WrikeIntegration } from '../components/ProjectManagementIntegrations';
import { DraggableEvent, DroppableCalendar } from '../components/DraggableEvent';
import { SlackIntegration, MicrosoftTeamsIntegration, DiscordIntegration, ZoomIntegration } from '../components/CommunicationIntegrations';
import { Socket } from '../utils/socket';

interface IntegrationState {
  events: CalendarEvent[];
  isConnected: boolean;
  token: string | null;
}

interface Integration {
  name: string;
  key: string;
  component: any;
}

const integrations: Integration[] = [
  { name: 'Google Calendar', key: 'googleCalendar', component: GoogleCalendar },
  { name: 'Outlook Calendar', key: 'outlookCalendar', component: OutlookCalendar },
  { name: 'Apple Calendar', key: 'appleCalendar', component: AppleCalendar },
  { name: 'iCal Calendar', key: 'iCalCalendar', component: ICalCalendar },
  { name: 'Exchange Calendar', key: 'exchangeCalendar', component: ExchangeCalendar },
  { name: 'Yahoo Calendar', key: 'yahooCalendar', component: YahooCalendar },
  { name: 'Zoho Calendar', key: 'zohoCalendar', component: ZohoCalendar },
  { name: 'Trello', key: 'trello', component: TrelloIntegration },
  { name: 'Asana', key: 'asana', component: AsanaIntegration },
  { name: 'Notion', key: 'notion', component: NotionIntegration },
  { name: 'Jira', key: 'jira', component: JiraIntegration },
  { name: 'Basecamp', key: 'basecamp', component: BasecampIntegration },
  { name: 'Wrike', key: 'wrike', component: WrikeIntegration },
  { name: 'Slack', key: 'slack', component: SlackIntegration },
  { name: 'Microsoft Teams', key: 'microsoftTeams', component: MicrosoftTeamsIntegration },
  { name: 'Discord', key: 'discord', component: DiscordIntegration },
  { name: 'Zoom', key: 'zoom', component: ZoomIntegration },
];

const ContentCalendarPage = () => {
  const pathname = usePathname();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);
  const [integrationsState, setIntegrationsState] = useState({
    googleCalendar: { events: [], isConnected: false, token: null },
    outlookCalendar: { events: [], isConnected: false, token: null },
    appleCalendar: { events: [], isConnected: false, token: null },
    iCalCalendar: { events: [], isConnected: false, token: null },
    exchangeCalendar: { events: [], isConnected: false, token: null },
    yahooCalendar: { events: [], isConnected: false, token: null },
    zohoCalendar: { events: [], isConnected: false, token: null },
    trello: { events: [], isConnected: false, token: null },
    asana: { events: [], isConnected: false, token: null },
    notion: { events: [], isConnected: false, token: null },
    jira: { events: [], isConnected: false, token: null },
    basecamp: { events: [], isConnected: false, token: null },
    wrike: { events: [], isConnected: false, token: null },
    slack: { events: [], isConnected: false, token: null },
    microsoftTeams: { events: [], isConnected: false, token: null },
    discord: { events: [], isConnected: false, token: null },
    zoom: { events: [], isConnected: false, token: null },
  });
  const [ssoToken, setSsoToken] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [realTimeEvents, setRealTimeEvents] = useState<CalendarEvent[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const handleIntegrationConnect = (integration: Integration) => {
    const component = integration.component;
    // Connect to the integration using the component
    // Update the integrationsState with the new connection status
    setIntegrationsState((prevIntegrationsState) => ({
      ...prevIntegrationsState,
      [integration.key]: { events: [], isConnected: true, token: 'token' },
    }));
  };

  const handleIntegrationDisconnect = (integration: Integration) => {
    // Disconnect from the integration
    // Update the integrationsState with the new connection status
    setIntegrationsState((prevIntegrationsState) => ({
      ...prevIntegrationsState,
      [integration.key]: { events: [], isConnected: false, token: null },
    }));
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div>
          <h1>Content Calendar</h1>
          <div>
            <h2>Integrations</h2>
            <ul>
              {integrations.map((integration) => (
                <li key={integration.key}>
                  <span>{integration.name}</span>
                  {integrationsState[integration.key].isConnected ? (
                    <button onClick={() => handleIntegrationDisconnect(integration)}>Disconnect</button>
                  ) : (
                    <button onClick={() => handleIntegrationConnect(integration)}>Connect</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <Calendar
            events={events}
            selectedDate={selectedDate}
            onDateChange={(date) => setSelectedDate(date)}
            onEventDrop={(event) => setDraggedEvent(event)}
            onEventHover={(event) => setHoveredEvent(event)}
          />
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;