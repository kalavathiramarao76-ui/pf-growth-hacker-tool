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
}

interface WidgetLayout {
  columns: number;
  rows: number;
  widgets: Widget[];
}

const initialWidgets: Widget[] = [
  {
    id: 1,
    title: 'Create Content',
    icon: <AiOutlinePlus size={24} />,
    onClick: () => {},
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
  },
  {
    id: 3,
    title: 'Content Calendar',
    icon: <FaRegCalendarAlt size={24} />,
    onClick: () => {},
  },
  {
    id: 4,
    title: 'Settings',
    icon: <MdSettings size={24} />,
    onClick: () => {},
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
          Unlock Your Content's Full Potential with Our Premium Plan
        </h1>
        <p
          style={{
            fontSize: '16px',
            marginBottom: '20px',
          }}
        >
          Join the ranks of our 10,000+ satisfied customers who have seen an
          average increase of 25% in engagement and 35% in conversio
        </p>
      </div>
    ),
  },
];

const cache = {
  analyticsData: null,
  contentSuggestions: null,
};

const fetchAnalyticsData = async () => {
  if (cache.analyticsData) {
    return cache.analyticsData;
  }

  try {
    const response = await axios.get('/api/analytics');
    cache.analyticsData = response.data;
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchContentSuggestions = async () => {
  if (cache.contentSuggestions) {
    return cache.contentSuggestions;
  }

  try {
    const response = await axios.get('/api/content-suggestions');
    cache.contentSuggestions = response.data;
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const DashboardPage = () => {
  const router = useRouter();
  const [widgets, setWidgets] = useState(initialWidgets);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [contentSuggestions, setContentSuggestions] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      const analyticsDataResponse = await fetchAnalyticsData();
      const contentSuggestionsResponse = await fetchContentSuggestions();

      setAnalyticsData(analyticsDataResponse);
      setContentSuggestions(contentSuggestionsResponse);
    };

    fetchInitialData();
  }, []);

  const handleWidgetClick = (widget: Widget) => {
    if (widget.onClick) {
      widget.onClick();
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newWidgets = [...widgets];
    const [reorderedWidget] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, reorderedWidget);

    setWidgets(newWidgets);
  };

  return (
    <DndProvider>
      <DragDropContext onDragEnd={handleDragEnd}>
        <DashboardHeader />
        <NavigationMenu />
        <div className="dashboard-container">
          <Droppable droppableId="widgets">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="widgets-container"
              >
                {widgets.map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="widget"
                      >
                        <DashboardCard
                          title={widget.title}
                          icon={widget.icon}
                          onClick={() => handleWidgetClick(widget)}
                          analyticsData={analyticsData}
                          contentSuggestions={contentSuggestions}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </DndProvider>
  );
};

export default DashboardPage;