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
];

const categories = [
  { name: 'Calendar', integrations: integrations.filter(integration => integration.category === 'Calendar') },
  { name: 'Project Management', integrations: integrations.filter(integration => integration.category === 'Project Management') },
  { name: 'Communication', integrations: integrations.filter(integration => integration.category === 'Communication') },
];

const Page = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const handleDragStart = (event: any) => {
    console.log('Drag started:', event);
  };

  const handleDragEnd = (event: any) => {
    console.log('Drag ended:', event);
  };

  const handleDrop = (event: any) => {
    console.log('Dropped:', event);
  };

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    // Connect to the selected integration
    // ...
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setToken(null);
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="container">
          <h1>Content Calendar</h1>
          <div className="calendar-container">
            <DroppableCalendar
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            >
              {events.map((event, index) => (
                <DraggableEvent key={index} event={event} />
              ))}
            </DroppableCalendar>
          </div>
          <div className="integrations-container">
            {categories.map(category => (
              <div key={category.name}>
                <h2>{category.name}</h2>
                <ul>
                  {category.integrations.map(integration => (
                    <li key={integration.key}>
                      <button onClick={() => handleConnect(integration)}>
                        {integration.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {selectedIntegration && (
            <div className="connection-container">
              <h2>Connect to {selectedIntegration.name}</h2>
              {selectedIntegration.component}
              <button onClick={handleDisconnect}>Disconnect</button>
            </div>
          )}
        </div>
      </DndProvider>
    </Layout>
  );
};

export default Page;