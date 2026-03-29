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

const DashboardPage = () => {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [widgetLayout, setWidgetLayout] = useState<WidgetLayout>({
    columns: 3,
    rows: 2,
    widgets: initialWidgets,
  });
  const [analyticsData, setAnalyticsData] = useState({});
  const [contentSuggestions, setContentSuggestions] = useState({});

  const router = useRouter();

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const response = await axios.get('/api/analytics');
      setAnalyticsData(response.data);
      cache.analyticsData = response.data;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchContentSuggestions = useCallback(async () => {
    try {
      const response = await axios.get('/api/content-suggestions');
      setContentSuggestions(response.data);
      cache.contentSuggestions = response.data;
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
    fetchContentSuggestions();
  }, [fetchAnalyticsData, fetchContentSuggestions]);

  const handleWidgetClick = (widget: Widget) => {
    if (widget.onClick) {
      widget.onClick();
    }
  };

  const handleWidgetSettings = (widget: Widget) => {
    if (widget.isCustomizable) {
      // Open widget settings modal
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newWidgets = [...widgetLayout.widgets];
    const [removed] = newWidgets.splice(source.index, 1);

    newWidgets.splice(destination.index, 0, removed);

    setWidgetLayout({
      ...widgetLayout,
      widgets: newWidgets,
    });
  };

  const memoizedWidgets = useMemo(() => {
    return widgets.map((widget) => {
      return (
        <Draggable key={widget.id} draggableId={widget.id.toString()} index={widgets.indexOf(widget)}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <DashboardCard
                title={widget.title}
                icon={widget.icon}
                onClick={() => handleWidgetClick(widget)}
                settings={() => handleWidgetSettings(widget)}
                analyticsData={analyticsData[widget.id]}
                contentSuggestions={contentSuggestions[widget.id]}
              />
            </div>
          )}
        </Draggable>
      );
    });
  }, [widgets, analyticsData, contentSuggestions]);

  return (
    <DndProvider>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {memoizedWidgets}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </DndProvider>
  );
};

export default DashboardPage;