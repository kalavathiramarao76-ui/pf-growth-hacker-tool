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
            <h2>Limited Time Offer: Get 15% Off Your First</h2>
          </div>
        </div>
      </div>
    )
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [widgets, setWidgets] = useState(initialWidgets);

  const memoizedWidgets = useMemo(() => {
    return widgets.map((widget) => {
      if (widget.id === 1) {
        return { ...widget, onClick: () => router.push('/content-analyzer') };
      } else if (widget.id === 2) {
        return { ...widget, onClick: () => router.push('/engagement-tracker') };
      } else if (widget.id === 3) {
        return { ...widget, onClick: () => router.push('/content-calendar') };
      } else if (widget.id === 4) {
        return { ...widget, onClick: () => router.push('/settings') };
      } else if (widget.id === 5) {
        return { ...widget, onClick: () => router.push('/upgrade-plan') };
      }
      return widget;
    });
  }, [widgets, router]);

  const handleWidgetRender = useCallback((widget) => {
    return (
      <Draggable key={widget.id} draggableId={widget.id.toString()} index={widget.id - 1}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
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
  }, []);

  return (
    <DndProvider>
      <DragDropContext>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {memoizedWidgets.map((widget) => handleWidgetRender(widget))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </DndProvider>
  );
}