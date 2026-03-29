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
        // Automatically retrieve events after connecting
        calendarIntegrations.GoogleCalendar.getEvents().then((events) => {
          setEvents(events);
          // Provide feedback to the user
          setConnectionStatus('Connected to Google Calendar');
          setConnectionMessage('You have been connected to Google Calendar. Your events are being synced.');
          setOnboardingStep(1);
          // Display a success message with clear instructions
          setSuccessMessage('You are now connected to Google Calendar. Please review the onboarding steps below to complete the setup.');
          // Display a tooltip with additional instructions
          setTooltip('To complete the setup, please review the onboarding steps and follow the instructions. If you have any questions, please contact our support team.');
        });
      } catch (error) {
        console.error('Error connecting to Google Calendar:', error);
        // Provide feedback to the user
        setConnectionStatus('Error connecting to Google Calendar');
        setConnectionMessage('Error connecting to Google Calendar. Please try again.');
        setOnboardingStep(0);
        // Display an error message with clear instructions
        setError('Error connecting to Google Calendar. Please ensure you have granted the necessary permissions and try again. If you are still experiencing issues, please contact our support team.');
        // Display a tooltip with additional instructions
        setTooltip('If you are experiencing issues connecting to Google Calendar, please ensure you have granted the necessary permissions and try again. If you are still experiencing issues, please contact our support team.');
      }
    },
    getEvents: async () => {
      try {
        // Implement Google Calendar event retrieval logic
        const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/events', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('googleCalendarToken')}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        return data.items.map((event: any) => ({
          id: event.id,
          title: event.summary,
          start: new Date(event.start.dateTime),
          end: new Date(event.end.dateTime)
        }));
      } catch (error) {
        console.error('Error retrieving Google Calendar events:', error);
        throw error;
      }
    },
    disconnect: () => {
      try {
        // Implement Google Calendar disconnection logic
        localStorage.removeItem('googleCalendarToken');
        setConnectionStatus('Disconnected from Google Calendar');
        setConnectionMessage('You have been disconnected from Google Calendar.');
        setOnboardingStep(0);
      } catch (error) {
        console.error('Error disconnecting from Google Calendar:', error);
      }
    },
    name: 'Google Calendar',
    icon: 'https://developers.google.com/identity/images/g-logo.png',
    description: 'Connect your Google Calendar account to sync your events.',
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
    isAuthenticated: () => {
      return localStorage.getItem('googleCalendarToken') !== null;
    },
    onboardingSteps: [
      {
        title: 'Step 1: Connect your Google Calendar account',
        description: 'Click the "Connect" button to authorize access to your Google Calendar account.',
        action: () => {
          window.location.href = calendarIntegrations.GoogleCalendar.authUrl;
        }
      },
      {
        title: 'Step 2: Review your events',
        description: 'Review your synced events to ensure they are accurate and up-to-date.',
        action: () => {
          setOnboardingStep(2);
        }
      },
      {
        title: 'Step 3: Complete the setup',
        description: 'You have completed the setup. You can now manage your events and calendar settings.',
        action: () => {
          setOnboardingStep(3);
        }
      }
    ]
  }
};

const [events, setEvents] = useState<CalendarEvent[]>([]);
const [connectionStatus, setConnectionStatus] = useState<string>('');
const [connectionMessage, setConnectionMessage] = useState<string>('');
const [onboardingStep, setOnboardingStep] = useState<number>(0);
const [successMessage, setSuccessMessage] = useState<string>('');
const [errorMessage, setError] = useState<string>('');
const [tooltip, setTooltip] = useState<string>('');

const handleConnect = (token: string) => {
  calendarIntegrations.GoogleCalendar.connect(token);
};

const handleDisconnect = () => {
  calendarIntegrations.GoogleCalendar.disconnect();
};

const handleGetEvents = async () => {
  try {
    const events = await calendarIntegrations.GoogleCalendar.getEvents();
    setEvents(events);
  } catch (error) {
    console.error('Error retrieving events:', error);
  }
};

useEffect(() => {
  if (calendarIntegrations.GoogleCalendar.isAuthenticated()) {
    handleGetEvents();
  }
}, []);

return (
  <Layout>
    <SEO title="Content Calendar" />
    <DndProvider backend={HTML5Backend}>
      <Calendar events={events} />
      <div>
        <h2>Connect your Google Calendar account</h2>
        <p>{connectionMessage}</p>
        {connectionStatus === 'Connected to Google Calendar' && (
          <button onClick={handleDisconnect}>Disconnect</button>
        )}
        {connectionStatus === 'Disconnected from Google Calendar' && (
          <button onClick={() => window.location.href = calendarIntegrations.GoogleCalendar.authUrl}>Connect</button>
        )}
        {onboardingStep === 1 && (
          <div>
            <h3>Onboarding Step 1: Review your events</h3>
            <p>Please review your synced events to ensure they are accurate and up-to-date.</p>
            <button onClick={() => setOnboardingStep(2)}>Next Step</button>
          </div>
        )}
        {onboardingStep === 2 && (
          <div>
            <h3>Onboarding Step 2: Complete the setup</h3>
            <p>You have completed the setup. You can now manage your events and calendar settings.</p>
            <button onClick={() => setOnboardingStep(3)}>Finish</button>
          </div>
        )}
        {successMessage && (
          <div>
            <h3>Success!</h3>
            <p>{successMessage}</p>
          </div>
        )}
        {errorMessage && (
          <div>
            <h3>Error!</h3>
            <p>{errorMessage}</p>
          </div>
        )}
        {tooltip && (
          <Tooltip>{tooltip}</Tooltip>
        )}
      </div>
    </DndProvider>
  </Layout>
);