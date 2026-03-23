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
    { id: 1, title: 'Create Content', icon: <AiOutlinePlus size={24} />, onClick: () => router.push('/content-analyzer') },
    { id: 2, title: 'View Analytics', icon: <IoMdAnalytics size={24} />, onClick: () => router.push('/engagement-tracker') },
    { id: 3, title: 'Content Calendar', icon: <FaRegCalendarAlt size={24} />, onClick: () => router.push('/content-calendar') },
    { id: 4, title: 'Settings', icon: <MdSettings size={24} />, onClick: () => router.push('/settings') },
    { 
      id: 5, 
      title: 'Upgrade to Premium', 
      icon: <MdSettings size={24} />, 
      onClick: () => router.push('/upgrade-plan'), 
      description: 'Unlock advanced features, priority support, and more with our premium plan. Get 20% more engagement, 30% more conversions, and expert guidance to take your content to the next level.',
      callToAction: (
        <div className="premium-upgrade-call-to-action">
          <h2>Unlock Your Content's Full Potential</h2>
          <p>Upgrade to our premium plan and get access to exclusive features, priority support, and expert guidance to take your content to the next level.</p>
          <ul>
            <li>20% more engagement</li>
            <li>30% more conversions</li>
            <li>Expert guidance and support</li>
          </ul>
          <button className="upgrade-button" onClick={() => router.push('/upgrade-plan')}>Upgrade Now and Get Started Today!</button>
          <p className="upgrade-benefits">By upgrading, you'll get access to advanced features, priority support, and expert guidance to help you achieve your content goals.</p>
          <div className="clear-call-to-action">
            <h3>Don't Miss Out! Upgrade Now and:</h3>
            <ul>
              <li>Maximize your content's reach and impact</li>
              <li>Get personalized support from our expert team</li>
              <li>Stay ahead of the competition with our latest features and updates</li>
            </ul>
            <button className="upgrade-button" onClick={() => router.push('/upgrade-plan')}>Upgrade to Premium Today!</button>
          </div>
        </div>
      )
    },
  ]);

  const [subscription, setSubscription] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(1);
  const [availableWidgets, setAvailableWidgets] = useState([
    { id: 6, title: 'New Widget', icon: <AiOutlinePlus size={24} /> }
  ]);

  return (
    <div>
      <DashboardHeader />
      <NavigationMenu />
      <DndProvider>
        <DragDropContext>
          <Droppable droppableId="widgets">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {widgets.map((widget, index) => (
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
      {showTutorial && (
        <WidgetSettings
          tutorialStep={tutorialStep}
          setTutorialStep={setTutorialStep}
          setShowTutorial={setShowTutorial}
        />
      )}
    </div>
  );
}