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
      <div className="premium-upgrade-call-to-action" style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#3498db' }}>Unlock Your Content's Full Potential with Our Premium Plan</h1>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>Join the ranks of our 10,000+ satisfied customers who have seen an average increase of 25% in engagement and 35% in conversions. Limited time offer: get 15% off your first year and experience the power of AI-driven content optimization!</p>
        <div className="benefits-list" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Unlock Exclusive Benefits:</h2>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
            <li style={{ marginBottom: '10px' }}><strong>AI-Powered Content Insights</strong>: Get data-driven recommendations to boost engagement and conversions</li>
            <li style={{ marginBottom: '10px' }}><strong>Prioritized Support</strong>: Get expert help whenever you need it, with priority access to our support team</li>
            <li style={{ marginBottom: '10px' }}><strong>Advanced Analytics</strong>: Track your content's performance with in-depth metrics and insights</li>
            <li style={{ marginBottom: '10px' }}><strong>Content Calendar Pro</strong>: Plan and schedule your content in advance with our intuitive calendar tool</li>
            <li style={{ marginBottom: '10px' }}><strong>Expert Guidance</strong>: Get access to our team of content experts who will help you create a winning content strategy</li>
          </ul>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button style={{ backgroundColor: '#3498db', color: '#ffffff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Upgrade to Premium Now</button>
        </div>
        <p style={{ fontSize: '14px', color: '#666666' }}>Hurry! This limited-time offer won't last long. Use code PREMIUM15 at checkout to receive your 15% discount.</p>
      </div>
    )
  },
]

const App = () => {
  const router = useRouter();

  return (
    <div>
      <DashboardHeader />
      <NavigationMenu />
      <DndProvider>
        <DragDropContext>
          <Droppable droppableId="widgets">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {initialWidgets.map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id.toString()} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <DashboardCard widget={widget} />
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
  );
};

export default App;