import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';
import { Socket } from '../utils/socket';
import StripeCheckout from 'react-stripe-checkout';

// Unified Calendar API
interface CalendarIntegration {
  connect: (token: string) => void;
  getEvents: () => Promise<CalendarEvent[]>;
  disconnect: () => void;
  name: string;
  icon: string;
  description: string;
  authUrl: string;
  isAuthenticated: () => boolean;
  onboardingSteps: {
    title: string;
    description: string;
    action: () => void;
  }[];
}

// Calendar Integrations
const calendarIntegrations: { [key: string]: CalendarIntegration } = {
  GoogleCalendar: {
    connect: (token: string) => {
      try {
        // Implement Google Calendar connection logic
        localStorage.setItem('googleCalendarToken', token);
      } catch (error) {
        console.error('Error connecting to Google Calendar:', error);
      }
    },
    getEvents: async () => {
      try {
        // Implement Google Calendar event retrieval logic
        const token = localStorage.getItem('googleCalendarToken');
        if (token) {
          const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/events', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Error fetching Google Calendar events: ${response.status}`);
          }
          const data = await response.json();
          return data.items.map((event: any) => ({
            id: event.id,
            title: event.summary,
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
          }));
        }
        return [];
      } catch (error) {
        console.error('Error fetching Google Calendar events:', error);
        return [];
      }
    },
    disconnect: () => {
      try {
        // Implement Google Calendar disconnection logic
        localStorage.removeItem('googleCalendarToken');
      } catch (error) {
        console.error('Error disconnecting from Google Calendar:', error);
      }
    },
    isAuthenticated: () => {
      return localStorage.getItem('googleCalendarToken') !== null;
    },
    name: 'Google Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281764.png',
    description: 'Connect your Google Calendar to view and manage your events',
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
    onboardingSteps: [
      {
        title: 'Step 1: Click on the "Connect" button',
        description: 'Click on the "Connect" button to start the authentication process',
        action: () => {
          window.open('https://accounts.google.com/o/oauth2/auth', '_blank');
        },
      },
      {
        title: 'Step 2: Authenticate with Google',
        description: 'Enter your Google credentials to authenticate',
        action: () => {
          console.log('Authenticate with Google');
        },
      },
      {
        title: 'Step 3: Grant permissions',
        description: 'Grant the necessary permissions to access your Google Calendar',
        action: () => {
          console.log('Grant permissions');
        },
      },
    ],
  },
  OutlookCalendar: {
    connect: (token: string) => {
      try {
        // Implement Outlook Calendar connection logic
        localStorage.setItem('outlookCalendarToken', token);
      } catch (error) {
        console.error('Error connecting to Outlook Calendar:', error);
      }
    },
    getEvents: async () => {
      try {
        // Implement Outlook Calendar event retrieval logic
        const token = localStorage.getItem('outlookCalendarToken');
        if (token) {
          const response = await fetch('https://outlook.office.com/api/v2.0/me/events', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Error fetching Outlook Calendar events: ${response.status}`);
          }
          const data = await response.json();
          return data.value.map((event: any) => ({
            id: event.id,
            title: event.subject,
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
          }));
        }
        return [];
      } catch (error) {
        console.error('Error fetching Outlook Calendar events:', error);
        return [];
      }
    },
    disconnect: () => {
      try {
        // Implement Outlook Calendar disconnection logic
        localStorage.removeItem('outlookCalendarToken');
      } catch (error) {
        console.error('Error disconnecting from Outlook Calendar:', error);
      }
    },
    isAuthenticated: () => {
      return localStorage.getItem('outlookCalendarToken') !== null;
    },
    name: 'Outlook Calendar',
    icon: 'https://cdn-icons-png.flaticon.com/512/281/281765.png',
    description: 'Connect your Outlook Calendar to view and manage your events',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    onboardingSteps: [
      {
        title: 'Step 1: Click on the "Connect" button',
        description: 'Click on the "Connect" button to start the authentication process',
        action: () => {
          window.open('https://login.microsoftonline.com/common/oauth2/v2.0/authorize', '_blank');
        },
      },
      {
        title: 'Step 2: Authenticate with Microsoft',
        description: 'Enter your Microsoft credentials to authenticate',
        action: () => {
          console.log('Authenticate with Microsoft');
        },
      },
      {
        title: 'Step 3: Grant permissions',
        description: 'Grant the necessary permissions to access your Outlook Calendar',
        action: () => {
          console.log('Grant permissions');
        },
      },
    ],
  },
};

const OnboardingModal = ({ integration, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    if (currentStep < integration.onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{integration.name} Onboarding</h2>
        <p>{integration.onboardingSteps[currentStep].description}</p>
        <button onClick={integration.onboardingSteps[currentStep].action}>
          {integration.onboardingSteps[currentStep].title}
        </button>
        <button onClick={handlePrevStep}>Previous</button>
        <button onClick={handleNextStep}>Next</button>
      </div>
    </div>
  );
};

const App = () => {
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  const handleConnect = (integration) => {
    setSelectedIntegration(integration);
    setIsOnboardingModalOpen(true);
  };

  return (
    <Layout>
      <SEO title="AI-Powered Content Optimizer" />
      <DndProvider backend={HTML5Backend}>
        <Calendar>
          {Object.keys(calendarIntegrations).map((integrationName) => (
            <CalendarEvent
              key={integrationName}
              title={calendarIntegrations[integrationName].name}
              icon={calendarIntegrations[integrationName].icon}
              description={calendarIntegrations[integrationName].description}
              onClick={() => handleConnect(calendarIntegrations[integrationName])}
            />
          ))}
        </Calendar>
      </DndProvider>
      {isOnboardingModalOpen && selectedIntegration && (
        <OnboardingModal
          integration={selectedIntegration}
          isOpen={isOnboardingModalOpen}
          onClose={() => setIsOnboardingModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default App;