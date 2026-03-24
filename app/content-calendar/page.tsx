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

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
  };

  const handleDrop = (event: CalendarEvent, date: Date) => {
    const newEvents = [...events];
    const index = newEvents.findIndex((e) => e.id === event.id);
    if (index !== -1) {
      newEvents[index].startDate = date;
      newEvents[index].endDate = new Date(date.getTime() + event.duration);
    }
    setEvents(newEvents);
  };

  const handleRealTimeEventChange = (event: CalendarEvent) => {
    setRealTimeEvents((prevEvents) => {
      const index = prevEvents.findIndex((e) => e.id === event.id);
      if (index !== -1) {
        prevEvents[index] = event;
      } else {
        prevEvents.push(event);
      }
      return prevEvents;
    });
  };

  useEffect(() => {
    const socket = new Socket();
    socket.on('realTimeEventChange', handleRealTimeEventChange);
    return () => {
      socket.disconnect();
    };
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
        >
          {events.map((event) => (
            <DraggableEvent key={event.id} event={event} />
          ))}
        </DroppableCalendar>
      </DndProvider>
      <div>
        {integrations.map((integration) => (
          <div key={integration.key}>
            <h2>{integration.name}</h2>
            <button onClick={() => handleIntegrationChange(integration.key, true, 'token')}>Connect</button>
            <button onClick={() => handleIntegrationChange(integration.key, false, null)}>Disconnect</button>
            {integration.key === 'googleCalendar' && <GoogleCalendar events={integrationsState.googleCalendar.events} />}
            {integration.key === 'outlookCalendar' && <OutlookCalendar events={integrationsState.outlookCalendar.events} />}
            {integration.key === 'appleCalendar' && <AppleCalendar events={integrationsState.appleCalendar.events} />}
            {integration.key === 'trello' && <TrelloIntegration events={integrationsState.trello.events} />}
            {integration.key === 'asana' && <AsanaIntegration events={integrationsState.asana.events} />}
            {integration.key === 'notion' && <NotionIntegration events={integrationsState.notion.events} />}
            {integration.key === 'slack' && <SlackIntegration events={integrationsState.slack.events} />}
            {integration.key === 'microsoftTeams' && <MicrosoftTeamsIntegration events={integrationsState.microsoftTeams.events} />}
          </div>
        ))}
      </div>
      <div>
        <h2>Real-time Events</h2>
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