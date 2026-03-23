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
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [isOutlookCalendarConnected, setIsOutlookCalendarConnected] = useState(false);
  const [isAppleCalendarConnected, setIsAppleCalendarConnected] = useState(false);
  const [isTrelloConnected, setIsTrelloConnected] = useState(false);
  const [isAsanaConnected, setIsAsanaConnected] = useState(false);
  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [googleCalendarAccessToken, setGoogleCalendarAccessToken] = useState<string | null>(null);
  const [outlookCalendarAccessToken, setOutlookCalendarAccessToken] = useState<string | null>(null);
  const [appleCalendarAccessToken, setAppleCalendarAccessToken] = useState<string | null>(null);

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
        <Calendar
          events={events}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          draggedEvent={draggedEvent}
          setDraggedEvent={setDraggedEvent}
          hoveredEvent={hoveredEvent}
          setHoveredEvent={setHoveredEvent}
        />
        <div>
          <h2>Calendar Integrations</h2>
          {calendarIntegrations.map((integration) => (
            <div key={integration.name}>
              {integration.component}
              <Tooltip>
                {integration.isConnected ? 'Connected' : 'Not Connected'}
              </Tooltip>
              <button onClick={() => integration.setIsConnected(!integration.isConnected)}>
                {integration.isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
        <div>
          <h2>Project Management Integrations</h2>
          {projectManagementIntegrations.map((integration) => (
            <div key={integration.name}>
              {integration.component}
              <Tooltip>
                {integration.isConnected ? 'Connected' : 'Not Connected'}
              </Tooltip>
              <button onClick={() => integration.setIsConnected(!integration.isConnected)}>
                {integration.isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;