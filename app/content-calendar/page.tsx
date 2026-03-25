import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GoogleCalendar, OutlookCalendar, AppleCalendar, ICalCalendar, ExchangeCalendar, YahooCalendar, ZohoCalendar } from '../components/CalendarIntegrations';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import { TrelloIntegration, AsanaIntegration, NotionIntegration, JiraIntegration, BasecampIntegration, WrikeIntegration } from '../components/ProjectManagementIntegrations';
import { DraggableEvent, DroppableCalendar } from '../components/DraggableEvent';
import { SlackIntegration, MicrosoftTeamsIntegration, DiscordIntegration, ZoomIntegration } from '../components/CommunicationIntegrations';
import { Socket } from '../utils/socket';
import { FacebookIntegration, TwitterIntegration, LinkedInIntegration, InstagramIntegration } from '../components/SocialMediaIntegrations';
import { MailchimpIntegration, ConstantContactIntegration, SendinblueIntegration } from '../components/EmailMarketingIntegrations';

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
  { name: 'Trello', key: 'trello', component: TrelloIntegration, category: 'Project Management' },
  { name: 'Asana', key: 'asana', component: AsanaIntegration, category: 'Project Management' },
  { name: 'Notion', key: 'notion', component: NotionIntegration, category: 'Project Management' },
  { name: 'Jira', key: 'jira', component: JiraIntegration, category: 'Project Management' },
  { name: 'Basecamp', key: 'basecamp', component: BasecampIntegration, category: 'Project Management' },
  { name: 'Wrike', key: 'wrike', component: WrikeIntegration, category: 'Project Management' },
  { name: 'Slack', key: 'slack', component: SlackIntegration, category: 'Communication' },
  { name: 'Microsoft Teams', key: 'microsoftTeams', component: MicrosoftTeamsIntegration, category: 'Communication' },
  { name: 'Discord', key: 'discord', component: DiscordIntegration, category: 'Communication' },
  { name: 'Zoom', key: 'zoom', component: ZoomIntegration, category: 'Communication' },
  { name: 'Facebook', key: 'facebook', component: FacebookIntegration, category: 'Social Media' },
  { name: 'Twitter', key: 'twitter', component: TwitterIntegration, category: 'Social Media' },
  { name: 'LinkedIn', key: 'linkedin', component: LinkedInIntegration, category: 'Social Media' },
  { name: 'Instagram', key: 'instagram', component: InstagramIntegration, category: 'Social Media' },
  { name: 'Mailchimp', key: 'mailchimp', component: MailchimpIntegration, category: 'Email Marketing' },
  { name: 'Constant Contact', key: 'constantContact', component: ConstantContactIntegration, category: 'Email Marketing' },
  { name: 'Sendinblue', key: 'sendinblue', component: SendinblueIntegration, category: 'Email Marketing' },
];

const categories = [
  { name: 'Calendar', integrations: integrations.filter(i => i.category === 'Calendar') },
  { name: 'Project Management', integrations: integrations.filter(i => i.category === 'Project Management') },
  { name: 'Communication', integrations: integrations.filter(i => i.category === 'Communication') },
  { name: 'Social Media', integrations: integrations.filter(i => i.category === 'Social Media') },
  { name: 'Email Marketing', integrations: integrations.filter(i => i.category === 'Email Marketing') },
];

const Page = () => {
  const [integrationState, setIntegrationState] = useState<IntegrationState>({
    events: [],
    isConnected: false,
    token: null,
  });

  const handleConnect = (integration: Integration) => {
    // Handle connection to integration
  };

  const handleDisconnect = (integration: Integration) => {
    // Handle disconnection from integration
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar>
          {categories.map(category => (
            <div key={category.name}>
              <h2>{category.name}</h2>
              {category.integrations.map(integration => (
                <div key={integration.key}>
                  <integration.component />
                  <button onClick={() => handleConnect(integration)}>Connect</button>
                  <button onClick={() => handleDisconnect(integration)}>Disconnect</button>
                </div>
              ))}
            </div>
          ))}
        </Calendar>
      </DndProvider>
    </Layout>
  );
};

export default Page;