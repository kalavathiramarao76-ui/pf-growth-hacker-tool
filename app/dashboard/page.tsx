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

const initialWidgets = [
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
        <p>Take your content to the next level with our premium plan, featuring advanced features, priority support, and expert guidance. Limited time offer: get 15% off your first year!</p>
        <ul>
          <li>20% more engagement</li>
          <li>30% more conversions</li>
          <li>Expert guidance and support</li>
          <li>Priority access to new features</li>
          <li>Enhanced security and backups</li>
        </ul>
        <div className="pricing-and-benefits">
          <h2>Pricing Plans:</h2>
          <ul>
            <li>Monthly: $9.99</li>
            <li>Yearly: $99.99 (save 20% compared to monthly)</li>
          </ul>
          <div className="limited-time-offer">
            <h2>Limited Time Offer: Get 15% Off Your First Year</h2>
            <p>Try our premium plan risk-free with a 14-day free trial. Cancel anytime.</p>
            <button>Start Free Trial</button>
          </div>
          <div className="demo-request">
            <h2>Request a Demo</h2>
            <p>See our premium plan in action and learn how it can help you achieve your content goals.</p>
            <button>
              Request Demo
            </button>
          </div>
        </div>
      </div>
    )
  },
];

const DashboardPage = () => {
  const router = useRouter();
  const [widgets, setWidgets] = useState(initialWidgets);
  const [layout, setLayout] = useState<WidgetLayout>({ columns: 2, rows: 3, widgets: initialWidgets });

  const handleWidgetClick = (widget: Widget) => {
    widget.onClick();
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
    <div className="dashboard-page">
      <DashboardHeader />
      <NavigationMenu />
      <div className="dashboard-content">
        <DndProvider>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="widgets">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
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
      </div>
    </div>
  );
};

export default DashboardPage;