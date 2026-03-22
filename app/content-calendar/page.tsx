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

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventDrag = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleEventDrop = (event: CalendarEvent) => {
    setDraggedEvent(null);
  };

  const handleEventHover = (event: CalendarEvent) => {
    setHoveredEvent(event);
  };

  const handleEventUnhover = () => {
    setHoveredEvent(null);
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="calendar-container">
          <div className="calendar-header">
            <h2>Content Calendar</h2>
            <div className="calendar-navigation">
              <button onClick={() => handleDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))}>
                <Image src="/icons/chevron-left.svg" alt="Previous month" width={24} height={24} />
              </button>
              <span>
                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => handleDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}>
                <Image src="/icons/chevron-right.svg" alt="Next month" width={24} height={24} />
              </button>
            </div>
          </div>
          <DroppableCalendar
            date={selectedDate}
            events={events}
            onEventDrag={handleEventDrag}
            onEventDrop={handleEventDrop}
            onEventHover={handleEventHover}
            onEventUnhover={handleEventUnhover}
          >
            {events.map((event) => (
              <DraggableEvent key={event.id} event={event} />
            ))}
          </DroppableCalendar>
          <div className="calendar-sidebar">
            <h3>Calendar Integrations</h3>
            <ul>
              <li>
                <GoogleCalendar
                  isConnected={isGoogleCalendarConnected}
                  onConnect={() => setIsGoogleCalendarConnected(true)}
                  onDisconnect={() => setIsGoogleCalendarConnected(false)}
                />
              </li>
              <li>
                <OutlookCalendar
                  isConnected={isOutlookCalendarConnected}
                  onConnect={() => setIsOutlookCalendarConnected(true)}
                  onDisconnect={() => setIsOutlookCalendarConnected(false)}
                />
              </li>
              <li>
                <AppleCalendar
                  isConnected={isAppleCalendarConnected}
                  onConnect={() => setIsAppleCalendarConnected(true)}
                  onDisconnect={() => setIsAppleCalendarConnected(false)}
                />
              </li>
              <li>
                <MicrosoftExchangeCalendar
                  isConnected={isMicrosoftExchangeCalendarConnected}
                  onConnect={() => setIsMicrosoftExchangeCalendarConnected(true)}
                  onDisconnect={() => setIsMicrosoftExchangeCalendarConnected(false)}
                />
              </li>
              <li>
                <GoogleWorkspaceCalendar
                  isConnected={isGoogleWorkspaceCalendarConnected}
                  onConnect={() => setIsGoogleWorkspaceCalendarConnected(true)}
                  onDisconnect={() => setIsGoogleWorkspaceCalendarConnected(false)}
                />
              </li>
              <li>
                <MicrosoftTeamsCalendar
                  isConnected={isMicrosoftTeamsCalendarConnected}
                  onConnect={() => setIsMicrosoftTeamsCalendarConnected(true)}
                  onDisconnect={() => setIsMicrosoftTeamsCalendarConnected(false)}
                />
              </li>
            </ul>
            <h3>Project Management Integrations</h3>
            <ul>
              <li>
                <TrelloIntegration
                  isConnected={isTrelloConnected}
                  onConnect={() => setIsTrelloConnected(true)}
                  onDisconnect={() => setIsTrelloConnected(false)}
                />
              </li>
              <li>
                <AsanaIntegration
                  isConnected={isAsanaConnected}
                  onConnect={() => setIsAsanaConnected(true)}
                  onDisconnect={() => setIsAsanaConnected(false)}
                />
              </li>
              <li>
                <NotionIntegration
                  isConnected={isNotionConnected}
                  onConnect={() => setIsNotionConnected(true)}
                  onDisconnect={() => setIsNotionConnected(false)}
                />
              </li>
            </ul>
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;