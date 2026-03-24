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
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [calendarIntegrationModal, setCalendarIntegrationModal] = useState(false);

  const handleConnectCalendar = (calendarType: string) => {
    switch (calendarType) {
      case 'google':
        window.open('https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=https://www.googleapis.com/auth/calendar', '_blank');
        break;
      case 'outlook':
        window.open('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=https://outlook.office.com/.default', '_blank');
        break;
      case 'apple':
        window.open('https://appleid.apple.com/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=name%20email', '_blank');
        break;
      default:
        break;
    }
  };

  const handleSaveCalendarIntegration = () => {
    setCalendarIntegrationModal(false);
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
          <button onClick={() => setCalendarIntegrationModal(true)}>Connect Calendar</button>
          {calendarIntegrationModal && (
            <div>
              <h2>Connect Calendar</h2>
              <button onClick={() => handleConnectCalendar('google')}>Google Calendar</button>
              <button onClick={() => handleConnectCalendar('outlook')}>Outlook Calendar</button>
              <button onClick={() => handleConnectCalendar('apple')}>Apple Calendar</button>
              <button onClick={handleSaveCalendarIntegration}>Save</button>
            </div>
          )}
        </div>
        <GoogleCalendar events={googleCalendarEvents} isConnected={isGoogleCalendarConnected} />
        <OutlookCalendar events={outlookCalendarEvents} isConnected={isOutlookCalendarConnected} />
        <AppleCalendar events={appleCalendarEvents} isConnected={isAppleCalendarConnected} />
        <TrelloIntegration events={trelloEvents} isConnected={isTrelloConnected} />
        <AsanaIntegration events={asanaEvents} isConnected={isAsanaConnected} />
        <NotionIntegration events={notionEvents} isConnected={isNotionConnected} />
        <SlackIntegration events={slackEvents} isConnected={isSlackConnected} />
        <MicrosoftTeamsIntegration events={microsoftTeamsEvents} isConnected={isMicrosoftTeamsConnected} />
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;