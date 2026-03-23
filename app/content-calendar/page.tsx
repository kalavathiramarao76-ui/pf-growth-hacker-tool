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
  const [googleCalendarAccessToken, setGoogleCalendarAccessToken] = useState<string | null>(null);
  const [outlookCalendarAccessToken, setOutlookCalendarAccessToken] = useState<string | null>(null);
  const [appleCalendarAccessToken, setAppleCalendarAccessToken] = useState<string | null>(null);
  const [slackAccessToken, setSlackAccessToken] = useState<string | null>(null);
  const [microsoftTeamsAccessToken, setMicrosoftTeamsAccessToken] = useState<string | null>(null);

  const calendarIntegrations = [
    {
      name: 'Google Calendar',
      component: <GoogleCalendar />,
      isConnected: isGoogleCalendarConnected,
      onConnect: () => {
        // handle google calendar connection
      },
      onDisconnect: () => {
        // handle google calendar disconnection
      },
    },
    {
      name: 'Outlook Calendar',
      component: <OutlookCalendar />,
      isConnected: isOutlookCalendarConnected,
      onConnect: () => {
        // handle outlook calendar connection
      },
      onDisconnect: () => {
        // handle outlook calendar disconnection
      },
    },
    {
      name: 'Apple Calendar',
      component: <AppleCalendar />,
      isConnected: isAppleCalendarConnected,
      onConnect: () => {
        // handle apple calendar connection
      },
      onDisconnect: () => {
        // handle apple calendar disconnection
      },
    },
  ];

  const projectManagementIntegrations = [
    {
      name: 'Trello',
      component: <TrelloIntegration />,
      isConnected: isTrelloConnected,
      onConnect: () => {
        // handle trello connection
      },
      onDisconnect: () => {
        // handle trello disconnection
      },
    },
    {
      name: 'Asana',
      component: <AsanaIntegration />,
      isConnected: isAsanaConnected,
      onConnect: () => {
        // handle asana connection
      },
      onDisconnect: () => {
        // handle asana disconnection
      },
    },
    {
      name: 'Notion',
      component: <NotionIntegration />,
      isConnected: isNotionConnected,
      onConnect: () => {
        // handle notion connection
      },
      onDisconnect: () => {
        // handle notion disconnection
      },
    },
  ];

  const communicationIntegrations = [
    {
      name: 'Slack',
      component: <SlackIntegration />,
      isConnected: isSlackConnected,
      onConnect: () => {
        // handle slack connection
      },
      onDisconnect: () => {
        // handle slack disconnection
      },
    },
    {
      name: 'Microsoft Teams',
      component: <MicrosoftTeamsIntegration />,
      isConnected: isMicrosoftTeamsConnected,
      onConnect: () => {
        // handle microsoft teams connection
      },
      onDisconnect: () => {
        // handle microsoft teams disconnection
      },
    },
  ];

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-screen">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Content Calendar</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Event
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                View Settings
              </button>
            </div>
          </div>
          <div className="flex flex-1 overflow-y-auto">
            <div className="w-1/3 p-4 border-r border-gray-200">
              <h2 className="text-xl font-bold mb-4">Calendar Integrations</h2>
              <ul>
                {calendarIntegrations.map((integration) => (
                  <li key={integration.name} className="mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{integration.name}</h3>
                        <p className="text-gray-600">
                          {integration.isConnected ? 'Connected' : 'Not Connected'}
                        </p>
                      </div>
                      <div>
                        {integration.isConnected ? (
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={integration.onDisconnect}
                          >
                            Disconnect
                          </button>
                        ) : (
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={integration.onConnect}
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-1/3 p-4 border-r border-gray-200">
              <h2 className="text-xl font-bold mb-4">Project Management Integrations</h2>
              <ul>
                {projectManagementIntegrations.map((integration) => (
                  <li key={integration.name} className="mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{integration.name}</h3>
                        <p className="text-gray-600">
                          {integration.isConnected ? 'Connected' : 'Not Connected'}
                        </p>
                      </div>
                      <div>
                        {integration.isConnected ? (
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={integration.onDisconnect}
                          >
                            Disconnect
                          </button>
                        ) : (
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={integration.onConnect}
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-1/3 p-4">
              <h2 className="text-xl font-bold mb-4">Communication Integrations</h2>
              <ul>
                {communicationIntegrations.map((integration) => (
                  <li key={integration.name} className="mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{integration.name}</h3>
                        <p className="text-gray-600">
                          {integration.isConnected ? 'Connected' : 'Not Connected'}
                        </p>
                      </div>
                      <div>
                        {integration.isConnected ? (
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={integration.onDisconnect}
                          >
                            Disconnect
                          </button>
                        ) : (
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={integration.onConnect}
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-center items-center p-4 border-t border-gray-200">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save Changes
            </button>
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;