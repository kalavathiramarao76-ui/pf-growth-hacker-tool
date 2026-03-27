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
          average increase of 25% in engagement and 35% in conversions with
          our premium plan.
        </p>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Upgrade Now
        </button>
      </div>
    ),
  },
];

const App = () => {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [widgetLayout, setWidgetLayout] = useState<WidgetLayout>({
    columns: 3,
    rows: 2,
    widgets: initialWidgets,
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newWidgets = [...widgets];

    const [removed] = newWidgets.splice(source.index, 1);
    newWidgets.splice(destination.index, 0, removed);

    setWidgets(newWidgets);
  };

  const handleWidgetAdd = () => {
    const newWidget: Widget = {
      id: widgets.length + 1,
      title: 'New Widget',
      icon: <AiOutlinePlus size={24} />,
      onClick: () => {},
    };

    setWidgets([...widgets, newWidget]);
  };

  const handleWidgetRemove = (id: number) => {
    const newWidgets = widgets.filter((widget) => widget.id !== id);
    setWidgets(newWidgets);
  };

  const handleWidgetSettings = (id: number) => {
    const widget = widgets.find((widget) => widget.id === id);
    if (widget) {
      // Open widget settings modal
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <NavigationMenu />
      <DndProvider>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="widget-grid">
            {widgets.map((widget, index) => (
              <Draggable key={widget.id} draggableId={widget.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="widget-card"
                  >
                    <DashboardCard
                      title={widget.title}
                      icon={widget.icon}
                      onClick={widget.onClick}
                      analyticsData={widget.analyticsData}
                      contentSuggestions={widget.contentSuggestions}
                      description={widget.description}
                      callToAction={widget.callToAction}
                    />
                    <div className="widget-actions">
                      <button onClick={() => handleWidgetSettings(widget.id)}>Settings</button>
                      <button onClick={() => handleWidgetRemove(widget.id)}>Remove</button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        </DragDropContext>
      </DndProvider>
      <button className="add-widget-button" onClick={handleWidgetAdd}>
        Add Widget
      </button>
    </div>
  );
};

export default App;