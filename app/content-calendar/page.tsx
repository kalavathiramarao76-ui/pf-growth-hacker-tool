import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarEvent } from '../components/Calendar';
import { Layout } from '../layout';
import { SEO } from '../components/SEO';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GoogleCalendar, OutlookCalendar } from '../components/CalendarIntegrations';
import { Tooltip } from '../components/Tooltip';
import Image from 'next/image';

const ContentCalendarPage = () => {
  const pathname = usePathname();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<CalendarEvent[]>([]);
  const [outlookCalendarEvents, setOutlookCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [isOutlookCalendarConnected, setIsOutlookCalendarConnected] = useState(false);
  const [googleCalendarAccessToken, setGoogleCalendarAccessToken] = useState<string | null>(null);
  const [outlookCalendarAccessToken, setOutlookCalendarAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    const storedGoogleCalendarConnected = localStorage.getItem('isGoogleCalendarConnected');
    if (storedGoogleCalendarConnected) {
      setIsGoogleCalendarConnected(JSON.parse(storedGoogleCalendarConnected));
    }
    const storedOutlookCalendarConnected = localStorage.getItem('isOutlookCalendarConnected');
    if (storedOutlookCalendarConnected) {
      setIsOutlookCalendarConnected(JSON.parse(storedOutlookCalendarConnected));
    }
    const storedGoogleCalendarAccessToken = localStorage.getItem('googleCalendarAccessToken');
    if (storedGoogleCalendarAccessToken) {
      setGoogleCalendarAccessToken(storedGoogleCalendarAccessToken);
    }
    const storedOutlookCalendarAccessToken = localStorage.getItem('outlookCalendarAccessToken');
    if (storedOutlookCalendarAccessToken) {
      setOutlookCalendarAccessToken(storedOutlookCalendarAccessToken);
    }
  }, []);

  useEffect(() => {
    if (isGoogleCalendarConnected && googleCalendarAccessToken) {
      fetchGoogleCalendarEvents();
    }
    if (isOutlookCalendarConnected && outlookCalendarAccessToken) {
      fetchOutlookCalendarEvents();
    }
  }, [isGoogleCalendarConnected, googleCalendarAccessToken, isOutlookCalendarConnected, outlookCalendarAccessToken]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventCreate = (event: CalendarEvent) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    localStorage.setItem('events', JSON.stringify([...events, event]));
    if (isGoogleCalendarConnected && googleCalendarAccessToken) {
      createGoogleCalendarEvent(event);
    }
    if (isOutlookCalendarConnected && outlookCalendarAccessToken) {
      createOutlookCalendarEvent(event);
    }
  };

  const handleEventDelete = (eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    localStorage.setItem('events', JSON.stringify(events.filter((event) => event.id !== eventId)));
    if (isGoogleCalendarConnected && googleCalendarAccessToken) {
      deleteGoogleCalendarEvent(eventId);
    }
    if (isOutlookCalendarConnected && outlookCalendarAccessToken) {
      deleteOutlookCalendarEvent(eventId);
    }
  };

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDragEnd = (event: CalendarEvent, newDate: Date) => {
    if (draggedEvent) {
      const updatedEvents = events.map((e) => {
        if (e.id === draggedEvent.id) {
          return { ...e, startDate: newDate };
        }
        return e;
      });
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      if (isGoogleCalendarConnected && googleCalendarAccessToken) {
        updateGoogleCalendarEvent(event, newDate);
      }
      if (isOutlookCalendarConnected && outlookCalendarAccessToken) {
        updateOutlookCalendarEvent(event, newDate);
      }
    }
  };

  const handleDrop = (event: CalendarEvent, newDate: Date) => {
    if (draggedEvent) {
      const updatedEvents = events.map((e) => {
        if (e.id === draggedEvent.id) {
          return { ...e, startDate: newDate };
        }
        return e;
      });
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      if (isGoogleCalendarConnected && googleCalendarAccessToken) {
        updateGoogleCalendarEvent(event, newDate);
      }
      if (isOutlookCalendarConnected && outlookCalendarAccessToken) {
        updateOutlookCalendarEvent(event, newDate);
      }
    }
  };

  const connectGoogleCalendar = async () => {
    const clientId = 'YOUR_GOOGLE_CALENDAR_CLIENT_ID';
    const redirectUri = 'YOUR_REDIRECT_URI';
    const scope = 'https://www.googleapis.com/auth/calendar';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    window.open(url, '_blank');
  };

  const connectOutlookCalendar = async () => {
    const clientId = 'YOUR_OUTLOOK_CALENDAR_CLIENT_ID';
    const redirectUri = 'YOUR_REDIRECT_URI';
    const scope = 'https://outlook.office.com/.default';
    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    window.open(url, '_blank');
  };

  const fetchGoogleCalendarEvents = async () => {
    const url = 'https://www.googleapis.com/calendar/v3/users/me/events';
    const headers = {
      'Authorization': `Bearer ${googleCalendarAccessToken}`,
      'Content-Type': 'application/json',
    };
    const response = await fetch(url, { headers });
    const data = await response.json();
    setGoogleCalendarEvents(data.items);
  };

  const fetchOutlookCalendarEvents = async () => {
    const url = 'https://outlook.office.com/api/v2.0/me/events';
    const headers = {
      'Authorization': `Bearer ${outlookCalendarAccessToken}`,
      'Content-Type': 'application/json',
    };
    const response = await fetch(url, { headers });
    const data = await response.json();
    setOutlookCalendarEvents(data.value);
  };

  const createGoogleCalendarEvent = async (event: CalendarEvent) => {
    const url = 'https://www.googleapis.com/calendar/v3/users/me/events';
    const headers = {
      'Authorization': `Bearer ${googleCalendarAccessToken}`,
      'Content-Type': 'application/json',
    };
    const body = {
      'summary': event.title,
      'description': event.description,
      'start': {
        'dateTime': event.startDate.toISOString(),
      },
      'end': {
        'dateTime': event.endDate.toISOString(),
      },
    };
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    const data = await response.json();
    console.log(data);
  };

  const createOutlookCalendarEvent = async (event: CalendarEvent) => {
    const url = 'https://outlook.office.com/api/v2.0/me/events';
    const headers = {
      'Authorization': `Bearer ${outlookCalendarAccessToken}`,
      'Content-Type': 'application/json',
    };
    const body = {
      'Subject': event.title,
      'Body': {
        'Content': event.description,
        'ContentType': 'HTML',
      },
      'Start': {
        'DateTime': event.startDate.toISOString(),
        'TimeZone': 'UTC',
      },
      'End': {
        'DateTime': event.endDate.toISOString(),
        'TimeZone': 'UTC',
      },
    };
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    const data = await response.json();
    console.log(data);
  };

  const deleteGoogleCalendarEvent = async (eventId: string) => {
    const url = `https://www.googleapis.com/calendar/v3/users/me/events/${eventId}`;
    const headers = {
      'Authorization': `Bearer ${googleCalendarAccessToken}`,
    };
    const response = await fetch(url, { method: 'DELETE', headers });
    const data = await response.json();
    console.log(data);
  };

  const deleteOutlookCalendarEvent = async (eventId: string) => {
    const url = `https://outlook.office.com/api/v2.0/me/events/${eventId}`;
    const headers = {
      'Authorization': `Bearer ${outlookCalendarAccessToken}`,
    };
    const response = await fetch(url, { method: 'DELETE', headers });
    const data = await response.json();
    console.log(data);
  };

  const updateGoogleCalendarEvent = async (event: CalendarEvent, newDate: Date) => {
    const url = `https://www.googleapis.com/calendar/v3/users/me/events/${event.id}`;
    const headers = {
      'Authorization': `Bearer ${googleCalendarAccessToken}`,
      'Content-Type': 'application/json',
    };
    const body = {
      'start': {
        'dateTime': newDate.toISOString(),
      },
    };
    const response = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
    const data = await response.json();
    console.log(data);
  };

  const updateOutlookCalendarEvent = async (event: CalendarEvent, newDate: Date) => {
    const url = `https://outlook.office.com/api/v2.0/me/events/${event.id}`;
    const headers = {
      'Authorization': `Bearer ${outlookCalendarAccessToken}`,
      'Content-Type': 'application/json',
    };
    const body = {
      'Start': {
        'DateTime': newDate.toISOString(),
        'TimeZone': 'UTC',
      },
    };
    const response = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
    const data = await response.json();
    console.log(data);
  };

  const handleGoogleCalendarConnect = async () => {
    connectGoogleCalendar();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      const tokenUrl = 'https://oauth2.googleapis.com/token';
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const body = {
        'code': code,
        'client_id': 'YOUR_GOOGLE_CALENDAR_CLIENT_ID',
        'client_secret': 'YOUR_GOOGLE_CALENDAR_CLIENT_SECRET',
        'redirect_uri': 'YOUR_REDIRECT_URI',
        'grant_type': 'authorization_code',
      };
      const response = await fetch(tokenUrl, { method: 'POST', headers, body: new URLSearchParams(body).toString() });
      const data = await response.json();
      setGoogleCalendarAccessToken(data.access_token);
      localStorage.setItem('googleCalendarAccessToken', data.access_token);
      setIsGoogleCalendarConnected(true);
      localStorage.setItem('isGoogleCalendarConnected', 'true');
    }
  };

  const handleOutlookCalendarConnect = async () => {
    connectOutlookCalendar();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const body = {
        'code': code,
        'client_id': 'YOUR_OUTLOOK_CALENDAR_CLIENT_ID',
        'client_secret': 'YOUR_OUTLOOK_CALENDAR_CLIENT_SECRET',
        'redirect_uri': 'YOUR_REDIRECT_URI',
        'grant_type': 'authorization_code',
      };
      const response = await fetch(tokenUrl, { method: 'POST', headers, body: new URLSearchParams(body).toString() });
      const data = await response.json();
      setOutlookCalendarAccessToken(data.access_token);
      localStorage.setItem('outlookCalendarAccessToken', data.access_token);
      setIsOutlookCalendarConnected(true);
      localStorage.setItem('isOutlookCalendarConnected', 'true');
    }
  };

  return (
    <Layout>
      <SEO title="Content Calendar" />
      <DndProvider backend={HTML5Backend}>
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onEventCreate={handleEventCreate}
          onEventDelete={handleEventDelete}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
        {isGoogleCalendarConnected ? (
          <GoogleCalendar events={googleCalendarEvents} />
        ) : (
          <button onClick={handleGoogleCalendarConnect}>Connect Google Calendar</button>
        )}
        {isOutlookCalendarConnected ? (
          <OutlookCalendar events={outlookCalendarEvents} />
        ) : (
          <button onClick={handleOutlookCalendarConnect}>Connect Outlook Calendar</button>
        )}
      </DndProvider>
    </Layout>
  );
};

export default ContentCalendarPage;