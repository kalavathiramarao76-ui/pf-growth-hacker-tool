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
  { name: 'Microsoft 365 Calendar', key: 'microsoft365Calendar', component: Microsoft365Calendar, category: 'Calendar', popularity: 10 },
  { name: 'Fastmail Calendar', key: 'fastmailCalendar', component: FastmailCalendar, category: 'Calendar', popularity: 11 },
  { name: 'Trello Integration', key: 'trelloIntegration', component: TrelloIntegration, category: 'Project Management', popularity: 9 },
  { name: 'Asana Integration', key: 'asanaIntegration', component: AsanaIntegration, category: 'Project Management', popularity: 8 },
  { name: 'Notion Integration', key: 'notionIntegration', component: NotionIntegration, category: 'Project Management', popularity: 7 },
  { name: 'Jira Integration', key: 'jiraIntegration', component: JiraIntegration, category: 'Project Management', popularity: 6 },
  { name: 'Basecamp Integration', key: 'basecampIntegration', component: BasecampIntegration, category: 'Project Management', popularity: 5 },
  { name: 'Wrike Integration', key: 'wrikeIntegration', component: WrikeIntegration, category: 'Project Management', popularity: 4 },
  { name: 'ClickUp Integration', key: 'clickUpIntegration', component: ClickUpIntegration, category: 'Project Management', popularity: 3 },
  { name: 'Monday Integration', key: 'mondayIntegration', component: MondayIntegration, category: 'Project Management', popularity: 2 },
  { name: 'Smartsheet Integration', key: 'smartsheetIntegration', component: SmartsheetIntegration, category: 'Project Management', popularity: 1 },
  { name: 'Slack Integration', key: 'slackIntegration', component: SlackIntegration, category: 'Communication', popularity: 9 },
  { name: 'Microsoft Teams Integration', key: 'microsoftTeamsIntegration', component: MicrosoftTeamsIntegration, category: 'Communication', popularity: 8 },
  { name: 'Discord Integration', key: 'discordIntegration', component: DiscordIntegration, category: 'Communication', popularity: 7 },
  { name: 'Zoom Integration', key: 'zoomIntegration', component: ZoomIntegration, category: 'Communication', popularity: 6 },
  { name: 'Skype Integration', key: 'skypeIntegration', component: SkypeIntegration, category: 'Communication', popularity: 5 },
  { name: 'Google Meet Integration', key: 'googleMeetIntegration', component: GoogleMeetIntegration, category: 'Communication', popularity: 4 },
  { name: 'Facebook Integration', key: 'facebookIntegration', component: FacebookIntegration, category: 'Social Media', popularity: 9 },
  { name: 'Twitter Integration', key: 'twitterIntegration', component: TwitterIntegration, category: 'Social Media', popularity: 8 },
  { name: 'LinkedIn Integration', key: 'linkedinIntegration', component: LinkedInIntegration, category: 'Social Media', popularity: 7 },
  { name: 'Instagram Integration', key: 'instagramIntegration', component: InstagramIntegration, category: 'Social Media', popularity: 6 },
  { name: 'TikTok Integration', key: 'tiktokIntegration', component: TikTokIntegration, category: 'Social Media', popularity: 5 },
  { name: 'Pinterest Integration', key: 'pinterestIntegration', component: PinterestIntegration, category: 'Social Media', popularity: 4 },
  { name: 'Mailchimp Integration', key: 'mailchimpIntegration', component: MailchimpIntegration, category: 'Email Marketing', popularity: 9 },
  { name: 'Constant Contact Integration', key: 'constantContactIntegration', component: ConstantContactIntegration, category: 'Email Marketing', popularity: 8 },
  { name: 'Sendinblue Integration', key: 'sendinblueIntegration', component: SendinblueIntegration, category: 'Email Marketing', popularity: 7 },
  { name: 'Klaviyo Integration', key: 'klaviyoIntegration', component: KlaviyoIntegration, category: 'Email Marketing', popularity: 6 },
  { name: 'Hubspot Integration', key: 'hubspotIntegration', component: HubspotIntegration, category: 'Email Marketing', popularity: 5 },
  { name: 'Google Drive Integration', key: 'googleDriveIntegration', component: GoogleDriveIntegration, category: 'Cloud Storage', popularity: 9 },
  { name: 'Dropbox Integration', key: 'dropboxIntegration', component: DropboxIntegration, category: 'Cloud Storage', popularity: 8 },
  { name: 'OneDrive Integration', key: 'oneDriveIntegration', component: OneDriveIntegration, category: 'Cloud Storage', popularity: 7 },
  { name: 'Box Integration', key: 'boxIntegration', component: BoxIntegration, category: 'Cloud Storage', popularity: 6 },
  { name: 'pCloud Integration', key: 'pcloudIntegration', component: pCloudIntegration, category: 'Cloud Storage', popularity: 5 },
];

const categories = Array.from(new Set(integrations.map((integration) => integration.category)));

const Page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredIntegrations = integrations.filter((integration) => {
    const nameMatches = integration.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatches = selectedCategory === '' || integration.category === selectedCategory;
    return nameMatches && categoryMatches;
  });

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Content Calendar</h1>
        <div className="flex flex-col items-center justify-center mb-4">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search integrations..."
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map((integration) => (
            <div key={integration.key} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-2">{integration.name}</h2>
              <integration.component />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Page;