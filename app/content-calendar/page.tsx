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
        const events = await response.json();
        return events.items.map((event: any) => ({
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
        setConnectionStatus('Error disconnecting from Google Calendar');
        setConnectionMessage('Error disconnecting from Google Calendar. Please try again.');
      }
    },
    name: 'Google Calendar',
    icon: 'https://www.google.com/calendar/images/google_calendar_64.png',
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
        title: 'Step 2: Review and sync your events',
        description: 'Review the events synced from your Google Calendar account and make any necessary adjustments.',
        action: () => {
          setOnboardingStep(2);
        }
      },
      {
        title: 'Step 3: Complete the setup',
        description: 'You have completed the setup. You can now manage your events and calendar integrations.',
        action: () => {
          setOnboardingStep(3);
        }
      }
    ]
  }
};

const App = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [connectionMessage, setConnectionMessage] = useState<string>('');
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setError] = useState<string>('');
  const [tooltip, setTooltip] = useState<string>('');

  useEffect(() => {
    if (calendarIntegrations.GoogleCalendar.isAuthenticated()) {
      calendarIntegrations.GoogleCalendar.getEvents().then((events) => {
        setEvents(events);
      });
    }
  }, []);

  return (
    <Layout>
      <SEO title="AI-Powered Content Optimizer" />
      <DndProvider backend={HTML5Backend}>
        <Calendar events={events} />
      </DndProvider>
      {connectionStatus && (
        <div>
          <p>{connectionStatus}</p>
          <p>{connectionMessage}</p>
        </div>
      )}
      {onboardingStep > 0 && (
        <div>
          <h2>Onboarding Steps</h2>
          {calendarIntegrations.GoogleCalendar.onboardingSteps.map((step, index) => (
            <div key={index}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <button onClick={step.action}>Next</button>
            </div>
          ))}
        </div>
      )}
      {successMessage && (
        <div>
          <p>{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div>
          <p>{errorMessage}</p>
        </div>
      )}
      {tooltip && (
        <Tooltip>
          <p>{tooltip}</p>
        </Tooltip>
      )}
    </Layout>
  );
};

export default App;