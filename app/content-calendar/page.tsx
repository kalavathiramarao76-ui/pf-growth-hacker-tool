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
  FastmailCalendar,
  AmazonCalendar,
  AOLCalendar,
  CoxCalendar,
  ComcastCalendar,
  ATTCalendar,
  VerizonCalendar,
  SBCGlobalCalendar,
  EarthlinkCalendar,
  MindspringCalendar,
  JunoCalendar,
  NetZeroCalendar,
  ProdigyCalendar,
  CompuserveCalendar
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
  SmartsheetIntegration,
  PodioIntegration,
  WunderlistIntegration,
  EvernoteIntegration,
  OneNoteIntegration,
  SimplenoteIntegration,
  WorkflowyIntegration,
  AirtableIntegration
} from '../components/ProjectManagementIntegrations';
import { DraggableEvent, DroppableCalendar } from '../components/DraggableEvent';
import { 
  SlackIntegration, 
  MicrosoftTeamsIntegration, 
  DiscordIntegration, 
  ZoomIntegration, 
  SkypeIntegration, 
  GoogleMeetIntegration,
  CiscoWebexIntegration,
  GoToMeetingIntegration,
  JoinMeIntegration,
  RingCentralIntegration,
  UberConferenceIntegration,
  FreeConferenceCallIntegration
} from '../components/CommunicationIntegrations';
import { Socket } from '../utils/socket';
import { 
  FacebookIntegration, 
  TwitterIntegration, 
  LinkedInIntegration, 
  InstagramIntegration, 
  TikTokIntegration, 
  PinterestIntegration,
  RedditIntegration,
  TumblrIntegration,
  SnapchatIntegration,
  YouTubeIntegration,
  TwitchIntegration
} from '../components/SocialMediaIntegrations';
import { 
  MailchimpIntegration, 
  ConstantContactIntegration, 
  SendinblueIntegration, 
  KlaviyoIntegration, 
  HubspotIntegration,
  MarketoIntegration,
  PardotIntegration,
  ActiveCampaignIntegration,
  ConvertKitIntegration,
  DripIntegration
} from '../components/EmailMarketingIntegrations';
import { 
  GoogleDriveIntegration, 
  DropboxIntegration, 
  OneDriveIntegration, 
  BoxIntegration, 
  pCloudIntegration,
  AmazonS3Integration,
  MicrosoftAzureIntegration,
  IBMCloudIntegration,
  RackspaceIntegration,
  BackblazeIntegration,
  SpiderOakIntegration
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
  { name: 'Fastmail Calendar', key: 'fastmailCalendar', component: FastmailCalendar, category: 'Calendar', popularity: 9 },
  { name: 'Amazon Calendar', key: 'amazonCalendar', component: AmazonCalendar, category: 'Calendar', popularity: 8 },
  { name: 'AOL Calendar', key: 'aolCalendar', component: AOLCalendar, category: 'Calendar', popularity: 7 },
  { name: 'Cox Calendar', key: 'coxCalendar', component: CoxCalendar, category: 'Calendar', popularity: 6 },
  { name: 'Comcast Calendar', key: 'comcastCalendar', component: ComcastCalendar, category: 'Calendar', popularity: 5 },
  { name: 'AT&T Calendar', key: 'attCalendar', component: ATTCalendar, category: 'Calendar', popularity: 4 },
  { name: 'Verizon Calendar', key: 'verizonCalendar', component: VerizonCalendar, category: 'Calendar', popularity: 3 },
  { name: 'SBCGlobal Calendar', key: 'sbccalendar', component: SBCGlobalCalendar, category: 'Calendar', popularity: 2 },
  { name: 'Earthlink Calendar', key: 'earthlinkCalendar', component: EarthlinkCalendar, category: 'Calendar', popularity: 1 },
  { name: 'Mindspring Calendar', key: 'mindspringCalendar', component: MindspringCalendar, category: 'Calendar', popularity: 10 },
  { name: 'Juno Calendar', key: 'junoCalendar', component: JunoCalendar, category: 'Calendar', popularity: 9 },
  { name: 'NetZero Calendar', key: 'netzeroCalendar', component: NetZeroCalendar, category: 'Calendar', popularity: 8 },
  { name: 'Prodigy Calendar', key: 'prodigyCalendar', component: ProdigyCalendar, category: 'Calendar', popularity: 7 },
  { name: 'Compuserve Calendar', key: 'compuserveCalendar', component: CompuserveCalendar, category: 'Calendar', popularity: 6 },
  { name: 'Trello Integration', key: 'trelloIntegration', component: TrelloIntegration, category: 'Project Management', popularity: 9 },
  { name: 'Asana Integration', key: 'asanaIntegration', component: AsanaIntegration, category: 'Project Management', popularity: 8 },
  { name: 'Notion Integration', key: 'notionIntegration', component: NotionIntegration, category: 'Project Management', popularity: 7 },
  { name: 'Jira Integration', key: 'jiraIntegration', component: JiraIntegration, category: 'Project Management', popularity: 6 },
  { name: 'Basecamp Integration', key: 'basecampIntegration', component: BasecampIntegration, category: 'Project Management', popularity: 5 },
  { name: 'Wrike Integration', key: 'wrikeIntegration', component: WrikeIntegration, category: 'Project Management', popularity: 4 },
  { name: 'ClickUp Integration', key: 'clickupIntegration', component: ClickUpIntegration, category: 'Project Management', popularity: 3 },
  { name: 'Monday Integration', key: 'mondayIntegration', component: MondayIntegration, category: 'Project Management', popularity: 2 },
  { name: 'Smartsheet Integration', key: 'smartsheetIntegration', component: SmartsheetIntegration, category: 'Project Management', popularity: 1 },
  { name: 'Podio Integration', key: 'podioIntegration', component: PodioIntegration, category: 'Project Management', popularity: 10 },
  { name: 'Wunderlist Integration', key: 'wunderlistIntegration', component: WunderlistIntegration, category: 'Project Management', popularity: 9 },
  { name: 'Evernote Integration', key: 'evernoteIntegration', component: EvernoteIntegration, category: 'Project Management', popularity: 8 },
  { name: 'OneNote Integration', key: 'onenoteIntegration', component: OneNoteIntegration, category: 'Project Management', popularity: 7 },
  { name: 'Simplenote Integration', key: 'simplenoteIntegration', component: SimplenoteIntegration, category: 'Project Management', popularity: 6 },
  { name: 'Workflowy Integration', key: 'workflowyIntegration', component: WorkflowyIntegration, category: 'Project Management', popularity: 5 },
  { name: 'Airtable Integration', key: 'airtableIntegration', component: AirtableIntegration, category: 'Project Management', popularity: 4 },
  { name: 'Slack Integration', key: 'slackIntegration', component: SlackIntegration, category: 'Communication', popularity: 9 },
  { name: 'Microsoft Teams Integration', key: 'microsoftTeamsIntegration', component: MicrosoftTeamsIntegration, category: 'Communication', popularity: 8 },
  { name: 'Discord Integration', key: 'discordIntegration', component: DiscordIntegration, category: 'Communication', popularity: 7 },
  { name: 'Zoom Integration', key: 'zoomIntegration', component: ZoomIntegration, category: 'Communication', popularity: 6 },
  { name: 'Skype Integration', key: 'skypeIntegration', component: SkypeIntegration, category: 'Communication', popularity: 5 },
  { name: 'Google Meet Integration', key: 'googleMeetIntegration', component: GoogleMeetIntegration, category: 'Communication', popularity: 4 },
  { name: 'Cisco Webex Integration', key: 'ciscoWebexIntegration', component: CiscoWebexIntegration, category: 'Communication', popularity: 3 },
  { name: 'GoToMeeting Integration', key: 'gotoMeetingIntegration', component: GoToMeetingIntegration, category: 'Communication', popularity: 2 },
  { name: 'JoinMe Integration', key: 'joinmeIntegration', component: JoinMeIntegration, category: 'Communication', popularity: 1 },
  { name: 'RingCentral Integration', key: 'ringcentralIntegration', component: RingCentralIntegration, category: 'Communication', popularity: 10 },
  { name: 'UberConference Integration', key: 'uberConferenceIntegration', component: UberConferenceIntegration, category: 'Communication', popularity: 9 },
  { name: 'FreeConferenceCall Integration', key: 'freeConferenceCallIntegration', component: FreeConferenceCallIntegration, category: 'Communication', popularity: 8 },
  { name: 'Facebook Integration', key: 'facebookIntegration', component: FacebookIntegration, category: 'Social Media', popularity: 9 },
  { name: 'Twitter Integration', key: 'twitterIntegration', component: TwitterIntegration, category: 'Social Media', popularity: 8 },
  { name: 'LinkedIn Integration', key: 'linkedinIntegration', component: LinkedInIntegration, category: 'Social Media', popularity: 7 },
  { name: 'Instagram Integration', key: 'instagramIntegration', component: InstagramIntegration, category: 'Social Media', popularity: 6 },
  { name: 'TikTok Integration', key: 'tiktokIntegration', component: TikTokIntegration, category: 'Social Media', popularity: 5 },
  { name: 'Pinterest Integration', key: 'pinterestIntegration', component: PinterestIntegration, category: 'Social Media', popularity: 4 },
  { name: 'Reddit Integration', key: 'redditIntegration', component: RedditIntegration, category: 'Social Media', popularity: 3 },
  { name: 'Tumblr Integration', key: 'tumblrIntegration', component: TumblrIntegration, category: 'Social Media', popularity: 2 },
  { name: 'Snapchat Integration', key: 'snapchatIntegration', component: SnapchatIntegration, category: 'Social Media', popularity: 1 },
  { name: 'YouTube Integration', key: 'youtubeIntegration', component: YouTubeIntegration, category: 'Social Media', popularity: 10 },
  { name: 'Twitch Integration', key: 'twitchIntegration', component: TwitchIntegration, category: 'Social Media', popularity: 9 },
  { name: 'Mailchimp Integration', key: 'mailchimpIntegration', component: MailchimpIntegration, category: 'Email Marketing', popularity: 9 },
  { name: 'Constant Contact Integration', key: 'constantContactIntegration', component: ConstantContactIntegration, category: 'Email Marketing', popularity: 8 },
  { name: 'Sendinblue Integration', key: 'sendinblueIntegration', component: SendinblueIntegration, category: 'Email Marketing', popularity: 7 },
  { name: 'Klaviyo Integration', key: 'klaviyoIntegration', component: KlaviyoIntegration, category: 'Email Marketing', popularity: 6 },
  { name: 'Hubspot Integration', key: 'hubspotIntegration', component: HubspotIntegration, category: 'Email Marketing', popularity: 5 },
  { name: 'Marketo Integration', key: 'marketoIntegration', component: MarketoIntegration, category: 'Email Marketing', popularity: 4 },
  { name: 'Pardot Integration', key: 'pardotIntegration', component: PardotIntegration, category: 'Email Marketing', popularity: 3 },
  { name: 'ActiveCampaign Integration', key: 'activeCampaignIntegration', component: ActiveCampaignIntegration, category: 'Email Marketing', popularity: 2 },
  { name: 'ConvertKit Integration', key: 'convertKitIntegration', component: ConvertKitIntegration, category: 'Email Marketing', popularity: 1 },
  { name: 'Drip Integration', key: 'dripIntegration', component: DripIntegration, category: 'Email Marketing', popularity: 10 },
  { name: 'Google Drive Integration', key: 'googleDriveIntegration', component: GoogleDriveIntegration, category: 'Cloud Storage', popularity: 9 },
  { name: 'Dropbox Integration', key: 'dropboxIntegration', component: DropboxIntegration, category: 'Cloud Storage', popularity: 8 },
  { name: 'OneDrive Integration', key: 'oneDriveIntegration', component: OneDriveIntegration, category: 'Cloud Storage', popularity: 7 },
  { name: 'Box Integration', key: 'boxIntegration', component: BoxIntegration, category: 'Cloud Storage', popularity: 6 },
  { name: 'pCloud Integration', key: 'pcloudIntegration', component: pCloudIntegration, category: 'Cloud Storage', popularity: 5 },
  { name: 'Amazon S3 Integration', key: 'amazonS3Integration', component: AmazonS3Integration, category: 'Cloud Storage', popularity: 4 },
  { name: 'Microsoft Azure Integration', key: 'microsoftAzureIntegration', component: MicrosoftAzureIntegration, category: 'Cloud Storage', popularity: 3 },
  { name: 'IBM Cloud Integration', key: 'ibmCloudIntegration', component: IBMCloudIntegration, category: 'Cloud Storage', popularity: 2 },
  { name: 'Rackspace Integration', key: 'rackspaceIntegration', component: RackspaceIntegration, category: 'Cloud Storage', popularity: 1 },
  { name: 'Backblaze Integration', key: 'backblazeIntegration', component: BackblazeIntegration, category: 'Cloud Storage', popularity: 10 },
  { name: 'SpiderOak Integration', key: 'spiderOakIntegration', component: SpiderOakIntegration, category: 'Cloud Storage', popularity: 9 }
];

const Page = () => {
  const [integrationState, setIntegrationState] = useState<IntegrationState>({
    events: [],
    isConnected: false,
    token: null
  });

  const pathname = usePathname();

  useEffect(() => {
    const socket = new Socket();
    socket.connect();
    socket.on('connect', () => {
      setIntegrationState((prev) => ({ ...prev, isConnected: true }));
    });
    socket.on('disconnect', () => {
      setIntegrationState((prev) => ({ ...prev, isConnected: false }));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Layout>
      <SEO title="AI-Powered Content Optimizer" />
      <DndProvider backend={HTML5Backend}>
        <Calendar>
          {integrations.map((integration) => (
            <DraggableEvent key={integration.key} integration={integration} />
          ))}
        </DndProvider>
        <div>
          {integrations.map((integration) => (
            <div key={integration.key}>
              <h2>{integration.name}</h2>
              <integration.component />
            </div>
          ))}
        </div>
      </Layout>
    </Layout>
  );
};

export default Page;