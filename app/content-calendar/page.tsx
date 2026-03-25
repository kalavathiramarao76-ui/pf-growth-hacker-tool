import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  GoogleCalendar, 
  OutlookCalendar, 
  AppleCalendar, 
  ICalCalendar, 
  ExchangeCalendar, 
  YahooCalendar, 
  ZohoCalendar, 
  AnyDoCalendar, 
  TodoistCalendar, 
  Microsoft365Calendar, 
  FastmailCalendar 
} from '../components/CalendarIntegrations';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import { 
  TrelloIntegration, 
  AsanaIntegration, 
  NotionIntegration, 
  JiraIntegration, 
  BasecampIntegration, 
  WrikeIntegration, 
  ClickUpIntegration, 
  MondayIntegration, 
  SmartsheetIntegration 
} from '../components/ProjectManagementIntegrations';
import { DraggableEvent, DroppableCalendar } from '../components/DraggableEvent';
import { 
  SlackIntegration, 
  MicrosoftTeamsIntegration, 
  DiscordIntegration, 
  ZoomIntegration, 
  SkypeIntegration, 
  GoogleMeetIntegration 
} from '../components/CommunicationIntegrations';
import { Socket } from '../utils/socket';
import { 
  FacebookIntegration, 
  TwitterIntegration, 
  LinkedInIntegration, 
  InstagramIntegration, 
  TikTokIntegration, 
  PinterestIntegration 
} from '../components/SocialMediaIntegrations';
import { 
  MailchimpIntegration, 
  ConstantContactIntegration, 
  SendinblueIntegration, 
  KlaviyoIntegration, 
  HubspotIntegration 
} from '../components/EmailMarketingIntegrations';
import { 
  GoogleDriveIntegration, 
  DropboxIntegration, 
  OneDriveIntegration, 
  BoxIntegration, 
  pCloudIntegration 
} from '../components/CloudStorageIntegrations';

interface IntegrationState {
  events: CalendarEvent[];
  isConnected: boolean;
  token: string | null;
}

interface Integration {
  name: string;
  key: string;
  component: any;
  category: string;
  popularity: number;
}

const integrations: Integration[] = [
  { name: 'Google Calendar', key: 'googleCalendar', component: GoogleCalendar, category: 'Calendar', popularity: 9 },
  { name: 'Outlook Calendar', key: 'outlookCalendar', component: OutlookCalendar, category: 'Calendar', popularity: 8 },
  { name: 'Apple Calendar', key: 'appleCalendar', component: AppleCalendar, category: 'Calendar', popularity: 7 },
  { name: 'iCal Calendar', key: 'iCalCalendar', component: ICalCalendar, category: 'Calendar', popularity: 6 },
  { name: 'Exchange Calendar', key: 'exchangeCalendar', component: ExchangeCalendar, category: 'Calendar', popularity: 5 },
  { name: 'Yahoo Calendar', key: 'yahooCalendar', component: YahooCalendar, category: 'Calendar', popularity: 4 },
  { name: 'Zoho Calendar', key: 'zohoCalendar', component: ZohoCalendar, category: 'Calendar', popularity: 3 },
  { name: 'Any.do Calendar', key: 'anyDoCalendar', component: AnyDoCalendar, category: 'Calendar', popularity: 2 },
  { name: 'Todoist Calendar', key: 'todoistCalendar', component: TodoistCalendar, category: 'Calendar', popularity: 1 },
  { name: 'Microsoft 365 Calendar', key: 'microsoft365Calendar', component: Microsoft365Calendar, category: 'Calendar', popularity: 1 },
  { name: 'Fastmail Calendar', key: 'fastmailCalendar', component: FastmailCalendar, category: 'Calendar', popularity: 1 },
];

const App = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dragging, setDragging] = useState(false);
  const [droppedEvent, setDroppedEvent] = useState<CalendarEvent | null>(null);

  const handleDragStart = (event: CalendarEvent) => {
    setDragging(true);
    setDroppedEvent(event);
  };

  const handleDragEnd = () => {
    setDragging(false);
    setDroppedEvent(null);
  };

  const handleDrop = (event: CalendarEvent) => {
    if (droppedEvent) {
      const updatedEvents = events.map((e) => {
        if (e.id === droppedEvent.id) {
          return { ...e, date: event.date };
        }
        return e;
      });
      setEvents(updatedEvents);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <SEO title="AI-Powered Content Optimizer" />
        <div className="content-calendar">
          <DroppableCalendar onDrop={handleDrop}>
            {events.map((event) => (
              <DraggableEvent
                key={event.id}
                event={event}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}
          </DroppableCalendar>
        </div>
      </Layout>
    </DndProvider>
  );
};

export default App;