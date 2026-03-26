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
        <p>Take your content to the next level with our premium plan, featuring advanced features, priority support, and expert guidance. Limited time offer: get 15% off your first year!</p>
        <div className="benefits-list">
          <h2>Benefits:</h2>
          <ul>
            <li>20% more engagement</li>
            <li>30% more conversions</li>
            <li>Expert guidance and support</li>
            <li>Priority access to new features</li>
            <li>Enhanced security and backups</li>
          </ul>
        </div>
        <div className="pricing-table">
          <h2>Pricing Plans:</h2>
          <table>
            <thead>
              <tr>
                <th>Plan</th>
                <th>Price</th>
                <th>Features</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monthly</td>
                <td>$9.99</td>
                <td>Basic features, limited support</td>
              </tr>
              <tr>
                <td>Yearly</td>
                <td>$99.99 (save 20% compared to monthly)</td>
                <td>Advanced features, priority support</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
];

const initialWidgetLayout: WidgetLayout = {
  columns: 2,
  rows: 3,
  widgets: initialWidgets,
};

const Page = () => {
  const [widgetLayout, setWidgetLayout] = useState(initialWidgetLayout);
  const [dragging, setDragging] = useState(false);

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

  const handleAddWidget = () => {
    const newWidget: Widget = {
      id: widgetLayout.widgets.length + 1,
      title: 'New Widget',
      icon: <AiOutlinePlus size={24} />,
      onClick: () => {},
    };

    setWidgetLayout({
      ...widgetLayout,
      widgets: [...widgetLayout.widgets, newWidget],
    });
  };

  return (
    <DndProvider backend={require('react-beautiful-dnd').backend}>
      <DashboardHeader />
      <NavigationMenu />
      <div className="dashboard-container">
        <div className="widget-grid">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="widgets">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="widget-grid-container"
                >
                  {widgetLayout.widgets.map((widget, index) => (
                    <Draggable key={widget.id} draggableId={widget.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="widget-card"
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
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="add-widget-button">
          <button onClick={handleAddWidget}>
            <AiOutlinePlus size={24} />
            Add Widget
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default Page;