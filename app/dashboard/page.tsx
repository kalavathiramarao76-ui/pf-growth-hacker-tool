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
            <li style={{ marginBottom: '10px' }}><strong>Prioritized Support</strong>: Get expert help whenever you need it, with priority access to our support team</li>
          </ul>
        </div>
      </div>
    )
  },
  { 
    id: 6, 
    title: 'Content Suggestions', 
    icon: <AiOutlinePlus size={24} />, 
    onClick: () => {}, 
    contentSuggestions: [
      {
        title: 'Optimize Your Headlines',
        description: 'Use attention-grabbing headlines to increase engagement and conversions'
      },
      {
        title: 'Use High-Quality Images',
        description: 'Add high-quality images to your content to make it more visually appealing'
      }
    ]
  }
];

const App = () => {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [dragging, setDragging] = useState(false);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newWidgets = [...widgets];
    const [removed] = newWidgets.splice(source.index, 1);
    newWidgets.splice(destination.index, 0, removed);
    setWidgets(newWidgets);
  };

  const handleWidgetClick = (widget: Widget) => {
    widget.onClick();
  };

  return (
    <DndProvider>
      <DragDropContext onDragEnd={onDragEnd}>
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
                      style={{
                        ...provided.draggableProps.style,
                        backgroundColor: dragging ? '#f7f7f7' : '#fff',
                        padding: '20px',
                        border: '1px solid #ddd',
                        borderRadius: '10px',
                        marginBottom: '20px'
                      }}
                    >
                      <DashboardCard
                        title={widget.title}
                        icon={widget.icon}
                        onClick={() => handleWidgetClick(widget)}
                      >
                        {widget.analyticsData && (
                          <div style={{ padding: '20px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Analytics Data:</h2>
                            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                              <li style={{ marginBottom: '10px' }}><strong>Engagement:</strong> {widget.analyticsData.engagement}</li>
                              <li style={{ marginBottom: '10px' }}><strong>Conversions:</strong> {widget.analyticsData.conversions}</li>
                              <li style={{ marginBottom: '10px' }}><strong>Views:</strong> {widget.analyticsData.views}</li>
                            </ul>
                          </div>
                        )}
                        {widget.contentSuggestions && (
                          <div style={{ padding: '20px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Content Suggestions:</h2>
                            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                              {widget.contentSuggestions.map((suggestion, index) => (
                                <li key={index} style={{ marginBottom: '10px' }}>
                                  <strong>{suggestion.title}:</strong> {suggestion.description}
                                </li>
                              ))}
                            </ul>
                          </div>
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
      </DragDropContext>
    </DndProvider>
  );
};

export default App;