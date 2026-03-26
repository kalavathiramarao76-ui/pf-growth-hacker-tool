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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Unlock Your Content's Full Potential with Our Premium Plan</h1>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>Take your content to the next level with our premium plan, featuring advanced features, priority support, and expert guidance. Limited time offer: get 15% off your first year and experience the power of AI-driven content optimization!</p>
        <div className="benefits-list" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Unlock Exclusive Benefits:</h2>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
            <li style={{ marginBottom: '10px' }}><strong>AI-Powered Content Insights</strong>: Get data-driven recommendations to boost engagement and conversions</li>
            <li style={{ marginBottom: '10px' }}><strong>Prioritized Support</strong>: Get expert help whenever you need it, with priority access to our support team</li>
            <li style={{ marginBottom: '10px' }}><strong>Advanced Analytics</strong>: Dive deeper into your content's performance with our advanced analytics tools</li>
            <li style={{ marginBottom: '10px' }}><strong>Content Calendar Pro</strong>: Plan and schedule your content in advance with our intuitive calendar feature</li>
            <li style={{ marginBottom: '10px' }}><strong>Enhanced Security and Backups</strong>: Protect your content with our robust security measures and automated backups</li>
          </ul>
        </div>
        <div className="pricing-table" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Pricing Plan:</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Plan</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Price</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Features</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Monthly</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>$29.99</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                    <li style={{ marginBottom: '10px' }}>AI-Powered Content Insights</li>
                    <li style={{ marginBottom: '10px' }}>Prioritized Support</li>
                    <li style={{ marginBottom: '10px' }}>Advanced Analytics</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Yearly</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>$299.99</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                    <li style={{ marginBottom: '10px' }}>AI-Powered Content Insights</li>
                    <li style={{ marginBottom: '10px' }}>Prioritized Support</li>
                    <li style={{ marginBottom: '10px' }}>Advanced Analytics</li>
                    <li style={{ marginBottom: '10px' }}>Content Calendar Pro</li>
                    <li style={{ marginBottom: '10px' }}>Enhanced Security and Backups</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
          <button style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Upgrade Now</button>
        </div>
      </div>
    )
  },
];

const App = () => {
  const router = useRouter();

  return (
    <div>
      <DashboardHeader />
      <NavigationMenu />
      <div className="dashboard-content">
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
    </div>
  );
};

export default App;