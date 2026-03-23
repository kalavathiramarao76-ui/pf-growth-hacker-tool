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
      description: 'Unlock advanced features, priority support, and more with our premium plan. Get 20% more engagement, 30% more conversions, and expert guidance to take your content to the next level.' 
    },
  ]);

  const [subscription, setSubscription] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(1);
  const [availableWidgets, setAvailableWidgets] = useState([
    { id: 6, title: 'New Widget', icon: <AiOutlinePlus size={24} />, onClick: () => console.log('New widget clicked') },
    { id: 7, title: 'Another Widget', icon: <IoMdAnalytics size={24} />, onClick: () => console.log('Another widget clicked') },
  ]);
  const [selectedWidgets, setSelectedWidgets] = useState(widgets);
  const [widgetLayout, setWidgetLayout] = useState<WidgetLayout>({
    columns: 3,
    rows: 2,
    widgets: []
  });
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState([]);
  const [customizableWidgets, setCustomizableWidgets] = useState([
    { id: 1, title: 'Create Content', icon: <AiOutlinePlus size={24} />, onClick: () => router.push('/content-analyzer'), frequency: 0 },
    { id: 2, title: 'View Analytics', icon: <IoMdAnalytics size={24} />, onClick: () => router.push('/engagement-tracker'), frequency: 0 },
    { id: 3, title: 'Content Calendar', icon: <FaRegCalendarAlt size={24} />, onClick: () => router.push('/content-calendar'), frequency: 0 },
  ]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newWidgets = [...selectedWidgets];
    const [removed] = newWidgets.splice(source.index, 1);
    newWidgets.splice(destination.index, 0, removed);
    setSelectedWidgets(newWidgets);
  };

  useEffect(() => {
    const storedWidgets = localStorage.getItem('selectedWidgets');
    if (storedWidgets) {
      setSelectedWidgets(JSON.parse(storedWidgets));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedWidgets', JSON.stringify(selectedWidgets));
  }, [selectedWidgets]);

  return (
    <DndProvider>
      <DashboardHeader />
      <NavigationMenu />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="widgets">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-3 gap-4">
                {selectedWidgets.map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="bg-white rounded shadow p-4"
                      >
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
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Available Widgets</h2>
          <div className="grid grid-cols-3 gap-4">
            {availableWidgets.map((widget) => (
              <div key={widget.id} className="bg-white rounded shadow p-4">
                <DashboardCard widget={widget} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}