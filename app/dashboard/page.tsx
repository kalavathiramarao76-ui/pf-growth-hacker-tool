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
          average increase of 25% in engagement and 35% in conversions. Limited
          time offer: get 15% off your
        </p>
      </div>
    ),
  },
];

const cache = {};

const fetchAnalyticsData = async (widgetId: number) => {
  if (cache[widgetId]) {
    return cache[widgetId];
  }

  try {
    const response = await axios.get(`/api/analytics/${widgetId}`);
    cache[widgetId] = response.data;
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchContentSuggestions = async (widgetId: number) => {
  if (cache[widgetId]) {
    return cache[widgetId];
  }

  try {
    const response = await axios.get(`/api/content-suggestions/${widgetId}`);
    cache[widgetId] = response.data;
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const DashboardPage = () => {
  const router = useRouter();
  const [widgets, setWidgets] = useState(initialWidgets);
  const [analyticsData, setAnalyticsData] = useState({});
  const [contentSuggestions, setContentSuggestions] = useState({});

  const fetchAllAnalyticsData = async () => {
    const promises = widgets.map((widget) => fetchAnalyticsData(widget.id));
    const results = await Promise.all(promises);
    setAnalyticsData(_.keyBy(results, 'id'));
  };

  const fetchAllContentSuggestions = async () => {
    const promises = widgets.map((widget) => fetchContentSuggestions(widget.id));
    const results = await Promise.all(promises);
    setContentSuggestions(_.keyBy(results, 'id'));
  };

  useEffect(() => {
    fetchAllAnalyticsData();
    fetchAllContentSuggestions();
  }, [widgets]);

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
        <Droppable droppableId="widgets">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <DashboardCard
                        key={widget.id}
                        title={widget.title}
                        icon={widget.icon}
                        onClick={() => handleWidgetClick(widget)}
                        analyticsData={analyticsData[widget.id]}
                        contentSuggestions={contentSuggestions[widget.id]}
                        description={widget.description}
                        callToAction={widget.callToAction}
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