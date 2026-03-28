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
    isInteractive: true,
    isCustomizable: true,
  },
];

const DashboardPage = () => {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [widgetLayout, setWidgetLayout] = useState<WidgetLayout>({
    columns: 3,
    rows: 2,
    widgets: initialWidgets,
  });

  const handleWidgetClick = (widget: Widget) => {
    widget.onClick();
  };

  const handleWidgetSettings = (widget: Widget) => {
    // Open widget settings modal
  };

  const handleWidgetCustomization = (widget: Widget) => {
    // Open widget customization modal
  };

  const onDragEnd = (result: any) => {
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

  return (
    <DndProvider>
      <DragDropContext onDragEnd={onDragEnd}>
        <DashboardHeader />
        <NavigationMenu />
        <div className="dashboard-container">
          <Droppable droppableId="widgets">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="widget-grid"
              >
                {widgetLayout.widgets.map((widget, index) => (
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
                          isInteractive={widget.isInteractive}
                          isCustomizable={widget.isCustomizable}
                          onSettingsClick={() => handleWidgetSettings(widget)}
                          onCustomizeClick={() => handleWidgetCustomization(widget)}
                        >
                          {widget.analyticsData && (
                            <Line
                              data={{
                                labels: ['Engagement', 'Conversions', 'Views'],
                                datasets: [
                                  {
                                    label: 'Analytics Data',
                                    data: [
                                      widget.analyticsData.engagement,
                                      widget.analyticsData.conversions,
                                      widget.analyticsData.views,
                                    ],
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1,
                                  },
                                ],
                              }}
                              options={{
                                scales: {
                                  yAxes: [
                                    {
                                      ticks: {
                                        beginAtZero: true,
                                      },
                                    },
                                  ],
                                },
                              }}
                            />
                          )}
                          {widget.description && <p>{widget.description}</p>}
                          {widget.callToAction && widget.callToAction}
                        </DashboardCard>
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