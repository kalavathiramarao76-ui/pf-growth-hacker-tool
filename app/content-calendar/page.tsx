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
          alert('You have started the authentication process');
        },
      },
      {
        title: 'Step 2: Authenticate with Google',
        description: 'You will be redirected to Google authentication page',
        action: () => {
          window.open('https://accounts.google.com/o/oauth2/auth', '_blank');
        },
      },
      {
        title: 'Step 3: Allow access to your Google Calendar',
        description: 'You will be asked to allow access to your Google Calendar',
        action: () => {
          alert('You have allowed access to your Google Calendar');
        },
      },
    ],
  },
};

const Page = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (calendarIntegrations.GoogleCalendar.isAuthenticated()) {
      setIsConnected(true);
    }
  }, []);

  const handleConnect = () => {
    calendarIntegrations.GoogleCalendar.connect('token');
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    calendarIntegrations.GoogleCalendar.disconnect();
    setIsConnected(false);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <div className="container">
          <h1>Content Calendar</h1>
          <p>Connect your Google Calendar to view and manage your events</p>
          {isConnected ? (
            <div>
              <p>You are connected to Google Calendar</p>
              <button onClick={handleDisconnect}>Disconnect</button>
            </div>
          ) : (
            <div>
              <p>Connect to Google Calendar</p>
              <button onClick={handleConnect}>Connect</button>
            </div>
          )}
          <div className="onboarding-steps">
            {calendarIntegrations.GoogleCalendar.onboardingSteps.map((step, index) => (
              <div key={index} className={currentStep === index ? 'active' : ''}>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
                <button onClick={step.action}>Start</button>
              </div>
            ))}
          </div>
          <div className="navigation">
            {currentStep > 0 && (
              <button onClick={handlePreviousStep}>Previous</button>
            )}
            {currentStep < calendarIntegrations.GoogleCalendar.onboardingSteps.length - 1 && (
              <button onClick={handleNextStep}>Next</button>
            )}
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default Page;