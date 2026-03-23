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
  const [googleCalendarAccessToken, setGoogleCalendarAccessToken] = useState<string | null>(null);
  const [outlookCalendarAccessToken, setOutlookCalendarAccessToken] = useState<string | null>(null);
  const [appleCalendarAccessToken, setAppleCalendarAccessToken] = useState<string | null>(null);
  const [slackAccessToken, setSlackAccessToken] = useState<string | null>(null);
  const [microsoftTeamsAccessToken, setMicrosoftTeamsAccessToken] = useState<string | null>(null);

  const calendarIntegrations = [
    {
      name: 'Google Calendar',
      component: <GoogleCalendar />,
      isConnected: isGoogleCalendarConnected,
      setIsConnected: setIsGoogleCalendarConnected,
      accessToken: googleCalendarAccessToken,
      setAccessToken: setGoogleCalendarAccessToken,
      events: googleCalendarEvents,
      setEvents: setGoogleCalendarEvents,
    },
    {
      name: 'Outlook Calendar',
      component: <OutlookCalendar />,
      isConnected: isOutlookCalendarConnected,
      setIsConnected: setIsOutlookCalendarConnected,
      accessToken: outlookCalendarAccessToken,
      setAccessToken: setOutlookCalendarAccessToken,
      events: outlookCalendarEvents,
      setEvents: setOutlookCalendarEvents,
    },
    {
      name: 'Apple Calendar',
      component: <AppleCalendar />,
      isConnected: isAppleCalendarConnected,
      setIsConnected: setIsAppleCalendarConnected,
      accessToken: appleCalendarAccessToken,
      setAccessToken: setAppleCalendarAccessToken,
      events: appleCalendarEvents,
      setEvents: setAppleCalendarEvents,
    },
    {
      name: 'Slack',
      component: <SlackIntegration />,
      isConnected: isSlackConnected,
      setIsConnected: setIsSlackConnected,
      accessToken: slackAccessToken,
      setAccessToken: setSlackAccessToken,
      events: slackEvents,
      setEvents: setSlackEvents,
    },
    {
      name: 'Microsoft Teams',
      component: <MicrosoftTeamsIntegration />,
      isConnected: isMicrosoftTeamsConnected,
      setIsConnected: setIsMicrosoftTeamsConnected,
      accessToken: microsoftTeamsAccessToken,
      setAccessToken: setMicrosoftTeamsAccessToken,
      events: microsoftTeamsEvents,
      setEvents: setMicrosoftTeamsEvents,
    },
  ];

  const projectManagementIntegrations = [
    {
      name: 'Trello',
      component: <TrelloIntegration />,
      isConnected: isTrelloConnected,
      setIsConnected: setIsTrelloConnected,
      events: trelloEvents,
      setEvents: setTrelloEvents,
    },
    {
      name: 'Asana',
      component: <AsanaIntegration />,
      isConnected: isAsanaConnected,
      setIsConnected: setIsAsanaConnected,
      events: asanaEvents,
      setEvents: setAsanaEvents,
    },
    {
      name: 'Notion',
      component: <NotionIntegration />,
      isConnected: isNotionConnected,
      setIsConnected: setIsNotionConnected,
      events: notionEvents,
      setEvents: setNotionEvents,
    },
  ];

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <DroppableCalendar
          events={events}
          setEvents={setEvents}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          draggedEvent={draggedEvent}
          setDraggedEvent={setDraggedEvent}
          hoveredEvent={hoveredEvent}
          setHoveredEvent={setHoveredEvent}
        />
        <div>
          {calendarIntegrations.map((integration) => (
            <div key={integration.name}>
              {integration.component}
              {integration.isConnected ? (
                <button onClick={() => integration.setIsConnected(false)}>Disconnect</button>
              ) : (
                <button onClick={() => integration.setIsConnected(true)}>Connect</button>
              )}
            </div>
          ))}
        </div>
        <div>
          {projectManagementIntegrations.map((integration) => (
            <div key={integration.name}>
              {integration.component}
              {integration.isConnected ? (
                <button onClick={() => integration.setIsConnected(false)}>Disconnect</button>
              ) : (
                <button onClick={() => integration.setIsConnected(true)}>Connect</button>
              )}
            </div>
          ))}
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;