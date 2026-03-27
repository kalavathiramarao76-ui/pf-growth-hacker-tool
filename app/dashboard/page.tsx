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
            <li style={{ marginBottom: '10px' }}><strong>Priority Support</strong>: Get dedicated support from our team of experts to help you achieve your content goals</li>
            <li style={{ marginBottom: '10px' }}><strong>Advanced Analytics</strong>: Get in-depth analytics and tracking to optimize your content strategy</li>
            <li style={{ marginBottom: '10px' }}><strong>Content Optimization Tools</strong>: Get access to our suite of content optimization tools to streamline your workflow</li>
          </ul>
        </div>
        <button style={{ backgroundColor: '#3498db', color: '#ffffff', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }} onClick={() => alert('Upgrade to Premium Plan')}>Upgrade Now</button>
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

  const handleUpgradeClick = () => {
    // Add logic to handle upgrade to premium plan
  };

  return (
    <div>
      <DashboardHeader />
      <NavigationMenu />
      <div className="dashboard-container">
        <DndProvider>
          <DragDropContext>
            <Droppable droppableId="widgets">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {widgets.map((widget, index) => (
                    <Draggable key={widget.id} draggableId={widget.id.toString()} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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