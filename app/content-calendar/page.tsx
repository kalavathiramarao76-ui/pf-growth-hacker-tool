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

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventCreate = (event: CalendarEvent) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    localStorage.setItem('events', JSON.stringify([...events, event]));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    localStorage.setItem('events', JSON.stringify(events.filter((event) => event.id !== eventId)));
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
    }
  };

  const handleMouseOver = (event: CalendarEvent) => {
    setHoveredEvent(event);
  };

  const handleMouseOut = () => {
    setHoveredEvent(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <SEO 
          title="AI-Powered Content Calendar | Plan and Organize Your Content" 
          description="Discover the ultimate AI-powered content calendar to plan, organize, and optimize your content strategy. Get started today and boost your online presence!" 
          meta={[
            {
              name: 'keywords',
              content: 'content calendar, content planning, content organization, ai-powered content, content strategy, online presence'
            },
            {
              name: 'robots',
              content: 'index, follow'
            },
            {
              name: 'og:title',
              content: 'AI-Powered Content Calendar | Plan and Organize Your Content'
            },
            {
              name: 'og:description',
              content: 'Discover the ultimate AI-powered content calendar to plan, organize, and optimize your content strategy. Get started today and boost your online presence!'
            },
            {
              name: 'og:image',
              content: '/images/content-calendar-og-image.jpg'
            },
            {
              name: 'twitter:card',
              content: 'summary_large_image'
            },
            {
              name: 'twitter:title',
              content: 'AI-Powered Content Calendar | Plan and Organize Your Content'
            },
            {
              name: 'twitter:description',
              content: 'Discover the ultimate AI-powered content calendar to plan, organize, and optimize your content strategy. Get started today and boost your online presence!'
            },
            {
              name: 'twitter:image',
              content: '/images/content-calendar-twitter-image.jpg'
            }
          ]}
          imageOptimization={{
            images: [
              {
                src: '/images/content-calendar-og-image.jpg',
                alt: 'Content Calendar OG Image',
                width: 1200,
                height: 630
              },
              {
                src: '/images/content-calendar-twitter-image.jpg',
                alt: 'Content Calendar Twitter Image',
                width: 1024,
                height: 512
              }
            ]
          }}
        />
        <div className="content-calendar-page">
          <Calendar 
            events={events} 
            selectedDate={selectedDate} 
            onDateChange={handleDateChange} 
            onEventCreate={handleEventCreate} 
            onEventDelete={handleEventDelete} 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd} 
            onDrop={handleDrop} 
            onMouseOver={handleMouseOver} 
            onMouseOut={handleMouseOut}
          />
          <GoogleCalendar />
          <OutlookCalendar />
          <Tooltip />
          <Image 
            src="/images/content-calendar-image.jpg" 
            alt="Content Calendar Image" 
            width={800} 
            height={400} 
            priority={true} 
            loading="eager"
          />
        </div>
      </Layout>
    </DndProvider>
  );
};

export default ContentCalendarPage;