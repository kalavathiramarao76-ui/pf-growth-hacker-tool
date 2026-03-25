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
  Any.doCalendar, 
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
}

const integrations: Integration[] = [
  { name: 'Google Calendar', key: 'googleCalendar', component: GoogleCalendar, category: 'Calendar' },
  { name: 'Outlook Calendar', key: 'outlookCalendar', component: OutlookCalendar, category: 'Calendar' },
  { name: 'Apple Calendar', key: 'appleCalendar', component: AppleCalendar, category: 'Calendar' },
  { name: 'iCal Calendar', key: 'iCalCalendar', component: ICalCalendar, category: 'Calendar' },
  { name: 'Exchange Calendar', key: 'exchangeCalendar', component: ExchangeCalendar, category: 'Calendar' },
  { name: 'Yahoo Calendar', key: 'yahooCalendar', component: YahooCalendar, category: 'Calendar' },
  { name: 'Zoho Calendar', key: 'zohoCalendar', component: ZohoCalendar, category: 'Calendar' },
  { name: 'Any.do Calendar', key: 'anyDoCalendar', component: Any.doCalendar, category: 'Calendar' },
  { name: 'Todoist Calendar', key: 'todoistCalendar', component: TodoistCalendar, category: 'Calendar' },
  { name: 'Microsoft 365 Calendar', key: 'microsoft365Calendar', component: Microsoft365Calendar, category: 'Calendar' },
  { name: 'Fastmail Calendar', key: 'fastmailCalendar', component: FastmailCalendar, category: 'Calendar' },
  { name: 'Trello', key: 'trello', component: TrelloIntegration, category: 'Project Management' },
  { name: 'Asana', key: 'asana', component: AsanaIntegration, category: 'Project Management' },
  { name: 'Notion', key: 'notion', component: NotionIntegration, category: 'Project Management' },
  { name: 'Jira', key: 'jira', component: JiraIntegration, category: 'Project Management' },
  { name: 'Basecamp', key: 'basecamp', component: BasecampIntegration, category: 'Project Management' },
  { name: 'Wrike', key: 'wrike', component: WrikeIntegration, category: 'Project Management' },
  { name: 'ClickUp', key: 'clickUp', component: ClickUpIntegration, category: 'Project Management' },
  { name: 'Monday', key: 'monday', component: MondayIntegration, category: 'Project Management' },
  { name: 'Smartsheet', key: 'smartsheet', component: SmartsheetIntegration, category: 'Project Management' },
  { name: 'Slack', key: 'slack', component: SlackIntegration, category: 'Communication' },
  { name: 'Microsoft Teams', key: 'microsoftTeams', component: MicrosoftTeamsIntegration, category: 'Communication' },
  { name: 'Discord', key: 'discord', component: DiscordIntegration, category: 'Communication' },
  { name: 'Zoom', key: 'zoom', component: ZoomIntegration, category: 'Communication' },
  { name: 'Skype', key: 'skype', component: SkypeIntegration, category: 'Communication' },
  { name: 'Google Meet', key: 'googleMeet', component: GoogleMeetIntegration, category: 'Communication' },
  { name: 'Facebook', key: 'facebook', component: FacebookIntegration, category: 'Social Media' },
  { name: 'Twitter', key: 'twitter', component: TwitterIntegration, category: 'Social Media' },
  { name: 'LinkedIn', key: 'linkedin', component: LinkedInIntegration, category: 'Social Media' },
  { name: 'Instagram', key: 'instagram', component: InstagramIntegration, category: 'Social Media' },
  { name: 'TikTok', key: 'tikTok', component: TikTokIntegration, category: 'Social Media' },
  { name: 'Pinterest', key: 'pinterest', component: PinterestIntegration, category: 'Social Media' },
  { name: 'Mailchimp', key: 'mailchimp', component: MailchimpIntegration, category: 'Email Marketing' },
  { name: 'Constant Contact', key: 'constantContact', component: ConstantContactIntegration, category: 'Email Marketing' },
  { name: 'Sendinblue', key: 'sendinblue', component: SendinblueIntegration, category: 'Email Marketing' },
  { name: 'Klaviyo', key: 'klaviyo', component: KlaviyoIntegration, category: 'Email Marketing' },
  { name: 'Hubspot', key: 'hubspot', component: HubspotIntegration, category: 'Email Marketing' },
  { name: 'Google Drive', key: 'googleDrive', component: GoogleDriveIntegration, category: 'Cloud Storage' },
  { name: 'Dropbox', key: 'dropbox', component: DropboxIntegration, category: 'Cloud Storage' },
  { name: 'OneDrive', key: 'oneDrive', component: OneDriveIntegration, category: 'Cloud Storage' },
  { name: 'Box', key: 'box', component: BoxIntegration, category: 'Cloud Storage' },
  { name: 'pCloud', key: 'pCloud', component: pCloudIntegration, category: 'Cloud Storage' }
];

const ContentCalendarPage = () => {
  const [integrationState, setIntegrationState] = useState<IntegrationState>({
    events: [],
    isConnected: false,
    token: null
  });

  const handleIntegration = (integration: Integration) => {
    // Handle integration logic here
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar>
          {integrations.map((integration) => (
            <DroppableCalendar key={integration.key} integration={integration}>
              <integration.component />
            </DroppableCalendar>
          ))}
        </Calendar>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;