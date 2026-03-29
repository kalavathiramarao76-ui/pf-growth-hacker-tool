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
          Unlock Your Potential
        </h1>
      </div>
    ),
  },
];

const DashboardPage = () => {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [widgetLayout, setWidgetLayout] = useState<WidgetLayout>({
    columns: 2,
    rows: 3,
    widgets: initialWidgets,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const response = await axios.get('/api/analytics');
      const analyticsData = response.data;
      cache.analyticsData = analyticsData;
      setWidgets((prevWidgets) =>
        prevWidgets.map((widget) => {
          if (widget.analyticsData) {
            return { ...widget, analyticsData: analyticsData };
          }
          return widget;
        })
      );
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContentSuggestions = useCallback(async () => {
    try {
      const response = await axios.get('/api/content-suggestions');
      const contentSuggestions = response.data;
      cache.contentSuggestions = contentSuggestions;
      setWidgets((prevWidgets) =>
        prevWidgets.map((widget) => {
          if (widget.contentSuggestions) {
            return { ...widget, contentSuggestions: contentSuggestions };
          }
          return widget;
        })
      );
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchAnalyticsData(), fetchContentSuggestions()]);
    };
    fetchAllData();
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
    const newWidgets = [...widgets];
    const [removed] = newWidgets.splice(source.index, 1);
    newWidgets.splice(destination.index, 0, removed);
    setWidgets(newWidgets);
  };

  return (
    <DndProvider>
      <DragDropContext onDragEnd={handleDragEnd}>
        <DashboardHeader />
        <NavigationMenu />
        <div className="dashboard-widgets">
          {widgets.map((widget, index) => (
            <Draggable key={widget.id} draggableId={String(widget.id)} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <DashboardCard
                    key={widget.id}
                    widget={widget}
                    onClick={() => handleWidgetClick(widget)}
                    onSettingsClick={() => handleWidgetSettings(widget)}
                  />
                </div>
              )}
            </Draggable>
          ))}
        </div>
      </DragDropContext>
    </DndProvider>
  );
};

export default DashboardPage;