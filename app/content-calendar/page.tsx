import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GoogleCalendar, OutlookCalendar, AppleCalendar, MicrosoftExchangeCalendar, GoogleWorkspaceCalendar, MicrosoftTeamsCalendar } from '../components/CalendarIntegrations';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import { TrelloIntegration, AsanaIntegration, NotionIntegration, GoogleWorkspaceIntegration, MicrosoftTeamsIntegration } from '../components/ProjectManagementIntegrations';
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
  const [microsoftExchangeCalendarEvents, setMicrosoftExchangeCalendarEvents] = useState<CalendarEvent[]>([]);
  const [googleWorkspaceCalendarEvents, setGoogleWorkspaceCalendarEvents] = useState<CalendarEvent[]>([]);
  const [microsoftTeamsCalendarEvents, setMicrosoftTeamsCalendarEvents] = useState<CalendarEvent[]>([]);
  const [trelloEvents, setTrelloEvents] = useState<CalendarEvent[]>([]);
  const [asanaEvents, setAsanaEvents] = useState<CalendarEvent[]>([]);
  const [notionEvents, setNotionEvents] = useState<CalendarEvent[]>([]);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [isOutlookCalendarConnected, setIsOutlookCalendarConnected] = useState(false);
  const [isAppleCalendarConnected, setIsAppleCalendarConnected] = useState(false);
  const [isMicrosoftExchangeCalendarConnected, setIsMicrosoftExchangeCalendarConnected] = useState(false);
  const [isGoogleWorkspaceCalendarConnected, setIsGoogleWorkspaceCalendarConnected] = useState(false);
  const [isMicrosoftTeamsCalendarConnected, setIsMicrosoftTeamsCalendarConnected] = useState(false);
  const [isTrelloConnected, setIsTrelloConnected] = useState(false);
  const [isAsanaConnected, setIsAsanaConnected] = useState(false);
  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [googleCalendarAccessToken, setGoogleCalendarAccessToken] = useState<string | null>(null);
  const [outlookCalendarAccessToken, setOutlookCalendarAccessToken] = useState<string | null>(null);
  const [appleCalendarAccessToken, setAppleCalendarAccessToken] = useState<string | null>(null);
  const [microsoftExchangeCalendarAccessToken, setMicrosoftExchangeCalendarAccessToken] = useState<string | null>(null);
  const [googleWorkspaceCalendarAccessToken, setGoogleWorkspaceCalendarAccessToken] = useState<string | null>(null);
  const [microsoftTeamsCalendarAccessToken, setMicrosoftTeamsCalendarAccessToken] = useState<string | null>(null);
  const [trelloAccessToken, setTrelloAccessToken] = useState<string | null>(null);
  const [asanaAccessToken, setAsanaAccessToken] = useState<string | null>(null);
  const [notionAccessToken, setNotionAccessToken] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumCalendarIntegrations, setPremiumCalendarIntegrations] = useState({
    microsoftExchange: false,
    googleWorkspace: false,
  });

  useEffect(() => {
    const storedIsPremium = localStorage.getItem('isPremium');
    if (storedIsPremium) {
      setIsPremium(storedIsPremium === 'true');
    }
  }, []);

  const handleUpgradeToPremium = () => {
    // Implement upgrade to premium logic here
    setIsPremium(true);
    localStorage.setItem('isPremium', 'true');
  };

  const handleConnectPremiumCalendar = (calendarType: 'microsoftExchange' | 'googleWorkspace') => {
    if (isPremium) {
      if (calendarType === 'microsoftExchange') {
        setPremiumCalendarIntegrations((prev) => ({ ...prev, microsoftExchange: true }));
      } else if (calendarType === 'googleWorkspace') {
        setPremiumCalendarIntegrations((prev) => ({ ...prev, googleWorkspace: true }));
      }
    } else {
      alert('Please upgrade to premium to connect this calendar');
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
        >
          <DroppableCalendar />
        </Calendar>
        <div>
          <h2>Calendar Integrations</h2>
          <GoogleCalendar
            isConnected={isGoogleCalendarConnected}
            accessToken={googleCalendarAccessToken}
            onConnect={() => {
              // Implement Google Calendar connection logic here
              setIsGoogleCalendarConnected(true);
            }}
          />
          <OutlookCalendar
            isConnected={isOutlookCalendarConnected}
            accessToken={outlookCalendarAccessToken}
            onConnect={() => {
              // Implement Outlook Calendar connection logic here
              setIsOutlookCalendarConnected(true);
            }}
          />
          <AppleCalendar
            isConnected={isAppleCalendarConnected}
            accessToken={appleCalendarAccessToken}
            onConnect={() => {
              // Implement Apple Calendar connection logic here
              setIsAppleCalendarConnected(true);
            }}
          />
          {isPremium && (
            <>
              <MicrosoftExchangeCalendar
                isConnected={premiumCalendarIntegrations.microsoftExchange}
                accessToken={microsoftExchangeCalendarAccessToken}
                onConnect={() => handleConnectPremiumCalendar('microsoftExchange')}
              />
              <GoogleWorkspaceCalendar
                isConnected={premiumCalendarIntegrations.googleWorkspace}
                accessToken={googleWorkspaceCalendarAccessToken}
                onConnect={() => handleConnectPremiumCalendar('googleWorkspace')}
              />
            </>
          )}
          {!isPremium && (
            <button onClick={handleUpgradeToPremium}>Upgrade to Premium to unlock more calendar integrations</button>
          )}
        </div>
        <div>
          <h2>Project Management Integrations</h2>
          <TrelloIntegration
            isConnected={isTrelloConnected}
            accessToken={trelloAccessToken}
            onConnect={() => {
              // Implement Trello connection logic here
              setIsTrelloConnected(true);
            }}
          />
          <AsanaIntegration
            isConnected={isAsanaConnected}
            accessToken={asanaAccessToken}
            onConnect={() => {
              // Implement Asana connection logic here
              setIsAsanaConnected(true);
            }}
          />
          <NotionIntegration
            isConnected={isNotionConnected}
            accessToken={notionAccessToken}
            onConnect={() => {
              // Implement Notion connection logic here
              setIsNotionConnected(true);
            }}
          />
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;