import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GoogleCalendar, OutlookCalendar, AppleCalendar, ICalCalendar, ExchangeCalendar } from '../components/CalendarIntegrations';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import { TrelloIntegration, AsanaIntegration, NotionIntegration } from '../components/ProjectManagementIntegrations';
import { DraggableEvent, DroppableCalendar } from '../components/DraggableEvent';
import { SlackIntegration, MicrosoftTeamsIntegration } from '../components/CommunicationIntegrations';
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
    trello: { events: [], isConnected: false, token: null },
    asana: { events: [], isConnected: false, token: null },
    notion: { events: [], isConnected: false, token: null },
    slack: { events: [], isConnected: false, token: null },
    microsoftTeams: { events: [], isConnected: false, token: null },
  });
  const [ssoToken, setSsoToken] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [realTimeEvents, setRealTimeEvents] = useState<CalendarEvent[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const integrations: Integration[] = [
    { name: 'Google Calendar', key: 'googleCalendar', component: GoogleCalendar },
    { name: 'Outlook Calendar', key: 'outlookCalendar', component: OutlookCalendar },
    { name: 'Apple Calendar', key: 'appleCalendar', component: AppleCalendar },
    { name: 'iCal Calendar', key: 'iCalCalendar', component: ICalCalendar },
    { name: 'Exchange Calendar', key: 'exchangeCalendar', component: ExchangeCalendar },
    { name: 'Trello', key: 'trello', component: TrelloIntegration },
    { name: 'Asana', key: 'asana', component: AsanaIntegration },
    { name: 'Notion', key: 'notion', component: NotionIntegration },
    { name: 'Slack', key: 'slack', component: SlackIntegration },
    { name: 'Microsoft Teams', key: 'microsoftTeams', component: MicrosoftTeamsIntegration },
  ];

  const handleIntegrationChange = (key: string, isConnected: boolean, token: string | null) => {
    setIntegrationsState((prevIntegrationsState) => ({
      ...prevIntegrationsState,
      [key]: { events: [], isConnected, token },
    }));
  };

  const renderIntegration = (integration: Integration) => {
    const IntegrationComponent = integration.component;
    return (
      <IntegrationComponent
        key={integration.key}
        isConnected={integrationsState[integration.key].isConnected}
        token={integrationsState[integration.key].token}
        onConnectionChange={(isConnected, token) => handleIntegrationChange(integration.key, isConnected, token)}
      />
    );
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div>
          <h1>Content Calendar</h1>
          <Calendar
            events={events}
            selectedDate={selectedDate}
            onDateChange={(date) => setSelectedDate(date)}
          />
          <div>
            {integrations.map((integration) => (
              <div key={integration.key}>
                <h2>{integration.name}</h2>
                {renderIntegration(integration)}
              </div>
            ))}
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;