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

interface Widget {
  id: number;
  title: string;
  icon: JSX.Element;
  onClick: () => void;
  frequency?: number;
  description?: string;
  callToAction?: JSX.Element;
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
    onClick: () => {} 
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
      <div className="premium-upgrade-call-to-action">
        <h1>Unlock Your Content's Full Potential with Our Premium Plan</h1>
        <p>Take your content to the next level with our premium plan, featuring advanced features, priority support, and expert guidance. Limited time offer: get 15% off your first year and experience the power of AI-driven content optimization!</p>
        <div className="benefits-list">
          <h2>Unlock Exclusive Benefits:</h2>
          <ul>
            <li><strong>AI-Powered Content Insights</strong>: Get data-driven recommendations to boost engagement and conversions</li>
            <li><strong>Prioritized Support</strong>: Get expert help whenever you need it, with priority access to our support team</li>
            <li><strong>Advanced Analytics</strong>: Dive deeper into your content's performance with our advanced analytics tools</li>
            <li><strong>Content Calendar Pro</strong>: Plan and schedule your content in advance with our intuitive calendar feature</li>
            <li><strong>Enhanced Security and Backups</strong>: Protect your content with our robust security measures and automated backups</li>
          </ul>
        </div>
        <div className="pricing-table">
        </div>
      </div>
    )
  },
];

const initialLayout: WidgetLayout = {
  columns: 2,
  rows: 3,
  widgets: initialWidgets,
};

const DashboardPage = () => {
  const [layout, setLayout] = useState(initialLayout);
  const [dragging, setDragging] = useState(false);

  const onDragStart = () => {
    setDragging(true);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newLayout = { ...layout };
    const widgets = [...newLayout.widgets];
    const [removed] = widgets.splice(source.index, 1);
    widgets.splice(destination.index, 0, removed);
    newLayout.widgets = widgets;
    setLayout(newLayout);
    setDragging(false);
  };

  return (
    <div className="dashboard-page">
      <DashboardHeader />
      <NavigationMenu />
      <DndProvider>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="dashboard-widgets">
            {Array.from({ length: layout.columns }, (_, columnIndex) => (
              <div key={columnIndex} className="widget-column">
                {Array.from({ length: layout.rows }, (_, rowIndex) => {
                  const widgetIndex = columnIndex * layout.rows + rowIndex;
                  const widget = layout.widgets[widgetIndex];
                  return (
                    <Draggable key={widget.id} draggableId={widget.id.toString()} index={widgetIndex}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="widget"
                        >
                          <DashboardCard
                            title={widget.title}
                            icon={widget.icon}
                            onClick={widget.onClick}
                            description={widget.description}
                            callToAction={widget.callToAction}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </div>
            ))}
          </div>
        </DragDropContext>
      </DndProvider>
      <WidgetSettings />
    </div>
  );
};

export default DashboardPage;