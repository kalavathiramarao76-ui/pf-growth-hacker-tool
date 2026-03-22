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
import { DndProvider } from 'react-beautiful-dnd';

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
      description: 'Get additional features, priority support, and more with our premium plan' 
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
    { id: 4, title: 'Settings', icon: <MdSettings size={24} />, onClick: () => router.push('/settings'), frequency: 0 },
    { 
      id: 5, 
      title: 'Upgrade to Premium', 
      icon: <MdSettings size={24} />, 
      onClick: () => router.push('/upgrade-plan'), 
      description: 'Get additional features, priority support, and more with our premium plan',
      frequency: 0
    },
  ]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newWidgets = [...widgetLayout.widgets];
    const [removed] = newWidgets.splice(source.index, 1);
    newWidgets.splice(destination.index, 0, removed);
    setWidgetLayout({
      ...widgetLayout,
      widgets: newWidgets
    });
  };

  useEffect(() => {
    const storedWidgetLayout = localStorage.getItem('widgetLayout');
    if (storedWidgetLayout) {
      setWidgetLayout(JSON.parse(storedWidgetLayout));
    } else {
      const defaultWidgets = customizableWidgets.map((widget) => ({ ...widget }));
      setWidgetLayout({
        columns: 3,
        rows: 2,
        widgets: defaultWidgets
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('widgetLayout', JSON.stringify(widgetLayout));
  }, [widgetLayout]);

  const handleAddWidget = (widget: Widget) => {
    setWidgetLayout({
      ...widgetLayout,
      widgets: [...widgetLayout.widgets, widget]
    });
  };

  const handleRemoveWidget = (widgetId: number) => {
    setWidgetLayout({
      ...widgetLayout,
      widgets: widgetLayout.widgets.filter((widget) => widget.id !== widgetId)
    });
  };

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <DashboardHeader />
      <NavigationMenu />
      <div className="dashboard-container">
        <div className="widget-grid">
          {widgetLayout.widgets.map((widget, index) => (
            <DashboardCard
              key={widget.id}
              title={widget.title}
              icon={widget.icon}
              onClick={widget.onClick}
              index={index}
              removable={true}
              onRemove={() => handleRemoveWidget(widget.id)}
            />
          ))}
        </div>
        <div className="available-widgets">
          <h2>Available Widgets</h2>
          {availableWidgets.map((widget) => (
            <DashboardCard
              key={widget.id}
              title={widget.title}
              icon={widget.icon}
              onClick={() => handleAddWidget(widget)}
              removable={false}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}