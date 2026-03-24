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

  const integrations = [
    { name: 'Google Calendar', key: 'googleCalendar' },
    { name: 'Outlook Calendar', key: 'outlookCalendar' },
    { name: 'Apple Calendar', key: 'appleCalendar' },
    { name: 'iCal Calendar', key: 'iCalCalendar' },
    { name: 'Exchange Calendar', key: 'exchangeCalendar' },
    { name: 'Trello', key: 'trello' },
    { name: 'Asana', key: 'asana' },
    { name: 'Notion', key: 'notion' },
    { name: 'Slack', key: 'slack' },
    { name: 'Microsoft Teams', key: 'microsoftTeams' },
  ];

  const handleIntegrationChange = (key: string, isConnected: boolean, token: string | null) => {
    setIntegrationsState((prevIntegrationsState) => ({
      ...prevIntegrationsState,
      [key]: { events: prevIntegrationsState[key].events, isConnected, token },
    }));
  };

  const handleEventsChange = (key: string, events: CalendarEvent[]) => {
    setIntegrationsState((prevIntegrationsState) => ({
      ...prevIntegrationsState,
      [key]: { events, isConnected: prevIntegrationsState[key].isConnected, token: prevIntegrationsState[key].token },
    }));
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <DroppableCalendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date)}
          onEventDrop={(event) => setEvents((prevEvents) => [...prevEvents, event])}
        >
          {integrations.map((integration) => (
            <div key={integration.key}>
              {integration.key === 'googleCalendar' && (
                <GoogleCalendar
                  isConnected={integrationsState.googleCalendar.isConnected}
                  token={integrationsState.googleCalendar.token}
                  onIntegrationChange={(isConnected, token) => handleIntegrationChange('googleCalendar', isConnected, token)}
                  onEventsChange={(events) => handleEventsChange('googleCalendar', events)}
                />
              )}
              {integration.key === 'outlookCalendar' && (
                <OutlookCalendar
                  isConnected={integrationsState.outlookCalendar.isConnected}
                  token={integrationsState.outlookCalendar.token}
                  onIntegrationChange={(isConnected, token) => handleIntegrationChange('outlookCalendar', isConnected, token)}
                  onEventsChange={(events) => handleEventsChange('outlookCalendar', events)}
                />
              )}
              {integration.key === 'appleCalendar' && (
                <AppleCalendar
                  isConnected={integrationsState.appleCalendar.isConnected}
                  token={integrationsState.appleCalendar.token}
                  onIntegrationChange={(isConnected, token) => handleIntegrationChange('appleCalendar', isConnected, token)}
                  onEventsChange={(events) => handleEventsChange('appleCalendar', events)}
                />
              )}
              {integration.key === 'iCalCalendar' && (
                <ICalCalendar
                  isConnected={integrationsState.iCalCalendar.isConnected}
                  token={integrationsState.iCalCalendar.token}
                  onIntegrationChange={(isConnected, token) => handleIntegrationChange('iCalCalendar', isConnected, token)}
                  onEventsChange={(events) => handleEventsChange('iCalCalendar', events)}
                />
              )}
              {integration.key === 'exchangeCalendar' && (
                <ExchangeCalendar
                  isConnected={integrationsState.exchangeCalendar.isConnected}
                  token={integrationsState.exchangeCalendar.token}
                  onIntegrationChange={(isConnected, token) => handleIntegrationChange('exchangeCalendar', isConnected, token)}
                  onEventsChange={(events) => handleEventsChange('exchangeCalendar', events)}
                />
              )}
              {integration.key === 'trello' && (
                <TrelloIntegration
                  isConnected={integrationsState.trello.isConnected}
                  token={integrationsState.trello.token}
                  onIntegrationChange={(isConnected, token) => handleIntegrationChange('trello', isConnected, token)}
                  onEventsChange={(events) => handleEventsChange('trello', events)}
                />
              )}
              {integration.key === 'asana' && (
                <AsanaIntegration
                  isConnected={integrationsState.asana.isConnected}
                  token={integrationsState.asana.token}
                  onIntegrationChange={(isConnected, token) => handleIntegrationChange('asana', isConnected, token)}
                  onEventsChange={(events) => handleEventsChange('asana', events)}
                />
              )}
              {integration.key === 'notion' && (
                <NotionIntegration
                  isConnected={integrationsState.notion.isConnected}
                  token={integrationsState.notion.token}
                  onIntegrationChange={(isConnected, token) => handleIntegrationChange('notion', isConnected, token)}
                  onEventsChange={(events) => handleEventsChange('notion', events)}
                />
              )}
              {integration.key === 'slack' && (
                <SlackIntegration
                  isConnected={integrationsState.slack.isConnected}
                  token={integrationsState.slack.token}
                  onIntegrationChange={(isConnected, token) => handleIntegrationChange('slack', isConnected, token)}
                  onEventsChange={(events) => handleEventsChange('slack', events)}
                />
              )}
              {integration.key === 'microsoftTeams' && (
                <MicrosoftTeamsIntegration
                  isConnected={integrationsState.microsoftTeams.isConnected}
                  token={integrationsState.microsoftTeams.token}
                  onIntegrationChange={(isConnected, token) => handleIntegrationChange('microsoftTeams', isConnected, token)}
                  onEventsChange={(events) => handleEventsChange('microsoftTeams', events)}
                />
              )}
            </div>
          ))}
        </DroppableCalendar>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;