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
          <h2>Choose Your Plan:</h2>
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
                <td>Advanced features, priority support, AI-powered content insights, and more</td>
              </tr>
              <tr>
                <td>Yearly (Limited Time Offer)</td>
                <td>$84.99 (save 15% compared to yearly)</td>
                <td>Advanced features, priority support, AI-powered content insights, and more</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="call-to-action-button">
          <button>Upgrade to Premium Now</button>
        </div>
      </div>
    )
  },
];

const DashboardPage = () => {
  const router = useRouter();
  const [widgets, setWidgets] = useState(initialWidgets);

  const handleWidgetClick = (widget: Widget) => {
    widget.onClick();
  };

  return (
    <div className="dashboard-page">
      <DashboardHeader />
      <NavigationMenu />
      <div className="dashboard-content">
        <DndProvider>
          <DragDropContext>
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