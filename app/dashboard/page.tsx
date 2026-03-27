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
import { DndProvider, DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
    onClick: () => {} 
  },
  { 
    id: 2, 
    title: 'View Analytics', 
    icon: <IoMdAnalytics size={24} />, 
    onClick: () => {}, 
    analyticsData: {
      engagement: 100,
      conversions: 50,
      views: 1000
    }
  },
  { 
    id: 3, 
    title: 'Content Calendar', 
    icon: <FaRegCalendarAlt size={24} />, 
    onClick: () => {} 
  },
  { 
    id: 4, 
    title: 'Settings', 
    icon: <MdSettings size={24} />, 
    onClick: () => {} 
  },
  { 
    id: 5, 
    title: 'Upgrade to Premium', 
    icon: <MdSettings size={24} />, 
    onClick: () => {}, 
    description: 'Unlock advanced features, priority support, and more with our premium plan. Get 20% more engagement, 30% more conversions, and expert guidance to take your content to the next level.',
    callToAction: (
      <div className="premium-upgrade-call-to-action" style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#3498db' }}>Unlock Your Content's Full Potential with Our Premium Plan</h1>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>Join the ranks of our 10,000+ satisfied customers who have seen an average increase of 25% in engagement and 35% in conversions. Limited time offer: get 15% off your first year and experience the power of AI-driven content optimization!</p>
        <div className="benefits-list" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Unlock Exclusive Benefits:</h2>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
            <li style={{ marginBottom: '10px' }}><strong>AI-Powered Content Insights</strong>: Get data-driven recommendations to boost engagement and conversions</li>
            <li style={{ marginBottom: '10px' }}><strong>Prioritized Support</strong>: Get help when you need it with our dedicated support team</li>
            <li style={{ marginBottom: '10px' }}><strong>Advanced Analytics</strong>: Unlock deeper insights into your content's performance with our advanced analytics tools</li>
          </ul>
        </div>
        <button style={{ backgroundColor: '#3498db', color: '#fff', padding: '10px 20px', borderRadius: '10px', border: 'none' }}>Upgrade Now</button>
      </div>
    )
  },
];

const initialLayout: WidgetLayout = {
  columns: 2,
  rows: 3,
  widgets: initialWidgets,
};

const App = () => {
  const [layout, setLayout] = useState(initialLayout);
  const [dragging, setDragging] = useState(false);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newWidgets = [...layout.widgets];
    const [removed] = newWidgets.splice(source.index, 1);
    newWidgets.splice(destination.index, 0, removed);
    setLayout({ ...layout, widgets: newWidgets });
  };

  const onDragStart = () => {
    setDragging(true);
  };

  const onDragEndHandler = () => {
    setDragging(false);
  };

  const handleWidgetClick = (id: number) => {
    const widget = layout.widgets.find((widget) => widget.id === id);
    if (widget && widget.onClick) {
      widget.onClick();
    }
  };

  const handleWidgetSettings = (id: number) => {
    const widget = layout.widgets.find((widget) => widget.id === id);
    if (widget) {
      // Open widget settings modal
    }
  };

  const handleAddWidget = () => {
    const newWidget: Widget = {
      id: layout.widgets.length + 1,
      title: 'New Widget',
      icon: <AiOutlinePlus size={24} />,
      onClick: () => {},
    };
    setLayout({ ...layout, widgets: [...layout.widgets, newWidget] });
  };

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Engagement',
        data: [100, 120, 140, 160, 180],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Conversions',
        data: [50, 60, 70, 80, 90],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Content Performance',
      },
    },
  };

  return (
    <DndProvider backend={require('react-beautiful-dnd').HTML5Backend}>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart} onDragEnd={onDragEndHandler}>
        <DashboardHeader />
        <NavigationMenu />
        <div className="dashboard-container">
          <Droppable droppableId="widgets">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {layout.widgets.map((widget, index) => (
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
                          onClick={() => handleWidgetClick(widget.id)}
                          onSettingsClick={() => handleWidgetSettings(widget.id)}
                        >
                          {widget.analyticsData && (
                            <div className="analytics-data">
                              <Line options={chartOptions} data={chartData} />
                            </div>
                          )}
                          {widget.description && (
                            <div className="description">{widget.description}</div>
                          )}
                          {widget.callToAction && (
                            <div className="call-to-action">{widget.callToAction}</div>
                          )}
                        </DashboardCard>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button className="add-widget-button" onClick={handleAddWidget}>
            Add Widget
          </button>
        </div>
      </DragDropContext>
    </DndProvider>
  );
};

export default App;