import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoMdAnalytics } from 'react-icons/io';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import Link from 'next/link';
import DashboardCard from '../components/DashboardCard';
import DashboardHeader from '../components/DashboardHeader';
import WidgetSettings from '../components/WidgetSettings';
import NavigationMenu from '../components/NavigationMenu';
import {
  DndProvider,
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import _ from 'lodash';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Widget {
  id: number;
  title: string;
  icon: JSX.Element;
  onClick: () => void;
  frequency?: number;
  description?: string;
  callToAction?: JSX.Element;
  analyticsData?: any;
  contentSuggestions?: any;
  isInteractive?: boolean;
  isCustomizable?: boolean;
}

interface WidgetLayout {
  columns: number;
  rows: number;
  widgets: Widget[];
}

const cache = {
  analyticsData: {},
  contentSuggestions: {},
};

const initialWidgets: Widget[] = [
  {
    id: 1,
    title: 'Create Content',
    icon: <AiOutlinePlus size={24} />,
    onClick: () => {},
    isInteractive: true,
    isCustomizable: true,
  },
  {
    id: 2,
    title: 'View Analytics',
    icon: <IoMdAnalytics size={24} />,
    onClick: () => {},
    analyticsData: {
      engagement: 100,
      conversions: 50,
      views: 1000,
    },
    isInteractive: true,
    isCustomizable: true,
  },
  {
    id: 3,
    title: 'Content Calendar',
    icon: <FaRegCalendarAlt size={24} />,
    onClick: () => {},
    isInteractive: true,
    isCustomizable: true,
  },
  {
    id: 4,
    title: 'Settings',
    icon: <MdSettings size={24} />,
    onClick: () => {},
    isInteractive: true,
    isCustomizable: true,
  },
  {
    id: 5,
    title: 'Upgrade to Premium',
    icon: <MdSettings size={24} />,
    onClick: () => {},
    description:
      'Unlock advanced features, priority support, and more with our premium plan. Get 20% more engagement, 30% more conversions, and expert guidance to take your content to the next level.',
    callToAction: (
      <div
        className="premium-upgrade-call-to-action"
        style={{
          padding: '20px',
          backgroundColor: '#f7f7f7',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#3498db',
          }}
        >
          Unlock Your Full Potential
        </h1>
      </div>
    ),
  },
];

const fetchAnalyticsData = async (widgetId: number) => {
  try {
    const response = await axios.get(`/api/analytics/${widgetId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchContentSuggestions = async (widgetId: number) => {
  try {
    const response = await axios.get(`/api/content-suggestions/${widgetId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const DashboardPage = () => {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [analyticsData, setAnalyticsData] = useState(cache.analyticsData);
  const [contentSuggestions, setContentSuggestions] = useState(cache.contentSuggestions);

  const fetchAndCacheAnalyticsData = useCallback(
    async (widgetId: number) => {
      if (!analyticsData[widgetId]) {
        const data = await fetchAnalyticsData(widgetId);
        if (data) {
          setAnalyticsData((prevData) => ({ ...prevData, [widgetId]: data }));
        }
      }
    },
    [analyticsData]
  );

  const fetchAndCacheContentSuggestions = useCallback(
    async (widgetId: number) => {
      if (!contentSuggestions[widgetId]) {
        const data = await fetchContentSuggestions(widgetId);
        if (data) {
          setContentSuggestions((prevData) => ({ ...prevData, [widgetId]: data }));
        }
      }
    },
    [contentSuggestions]
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all(
        widgets.map((widget) => {
          if (widget.analyticsData) {
            return fetchAndCacheAnalyticsData(widget.id);
          }
          if (widget.contentSuggestions) {
            return fetchAndCacheContentSuggestions(widget.id);
          }
          return Promise.resolve();
        })
      );
    };
    fetchInitialData();
  }, [widgets, fetchAndCacheAnalyticsData, fetchAndCacheContentSuggestions]);

  const handleWidgetClick = (widget: Widget) => {
    if (widget.onClick) {
      widget.onClick();
    }
    if (widget.analyticsData) {
      fetchAndCacheAnalyticsData(widget.id);
    }
    if (widget.contentSuggestions) {
      fetchAndCacheContentSuggestions(widget.id);
    }
  };

  return (
    <DndProvider>
      <DragDropContext>
        <Droppable droppableId="dashboard">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <DashboardHeader />
              <NavigationMenu />
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id.toString()} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <DashboardCard
                        widget={widget}
                        onClick={() => handleWidgetClick(widget)}
                        analyticsData={analyticsData[widget.id]}
                        contentSuggestions={contentSuggestions[widget.id]}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </DndProvider>
  );
};

export default DashboardPage;