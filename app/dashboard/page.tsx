import { useState, useEffect } from 'react';
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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [widgets, setWidgets] = useState([
    { 
      id: 1, 
      title: 'Create Content', 
      icon: <AiOutlinePlus size={24} />, 
      onClick: () => router.push('/content-analyzer') 
    },
    { 
      id: 2, 
      title: 'View Analytics', 
      icon: <IoMdAnalytics size={24} />, 
      onClick: () => router.push('/engagement-tracker') 
    },
    { 
      id: 3, 
      title: 'Content Calendar', 
      icon: <FaRegCalendarAlt size={24} />, 
      onClick: () => router.push('/content-calendar') 
    },
    { 
      id: 4, 
      title: 'Settings', 
      icon: <MdSettings size={24} />, 
      onClick: () => router.push('/settings') 
    },
    { 
      id: 5, 
      title: 'Upgrade to Premium', 
      icon: <MdSettings size={24} />, 
      onClick: () => router.push('/upgrade-plan'), 
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
              <h2>Limited Time Offer: Get 15% Off Your First Year!</h2>
              <button className="upgrade-button" onClick={() => router.push('/upgrade-plan')}>Upgrade Now</button>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 6, 
      title: 'Premium Plan Benefits', 
      icon: <MdSettings size={24} />, 
      onClick: () => router.push('/premium-benefits'), 
      description: 'Discover the benefits of our premium plan, including advanced features, priority support, and expert guidance.',
      callToAction: (
        <div className="premium-benefits-call-to-action">
          <h1>Experience the Power of Our Premium Plan</h1>
          <p>Unlock advanced features, priority support, and expert guidance to take your content to the next level.</p>
          <ul>
            <li>Advanced analytics and insights</li>
            <li>Priority support and expert guidance</li>
            <li>Enhanced security and backups</li>
            <li>Priority access to new features</li>
          </ul>
          <button className="learn-more-button" onClick={() => router.push('/premium-benefits')}>Learn More</button>
        </div>
      )
    }
  ]);

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
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
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
      <WidgetSettings />
    </div>
  );
}