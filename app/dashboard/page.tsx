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
  const [widgetLayout, setWidgetLayout] = useState({
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
    { id: 6, title: 'New Widget', icon: <AiOutlinePlus size={24} />, onClick: () => console.log('New widget clicked'), frequency: 0 },
    { id: 7, title: 'Another Widget', icon: <IoMdAnalytics size={24} />, onClick: () => console.log('Another widget clicked'), frequency: 0 },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedSubscription = localStorage.getItem('subscription');
    if (storedSubscription) {
      setSubscription(JSON.parse(storedSubscription));
    }
    const storedTutorial = localStorage.getItem('tutorial');
    if (!storedTutorial) {
      setShowTutorial(true);
      localStorage.setItem('tutorial', 'true');
    }
    const storedSelectedWidgets = localStorage.getItem('selectedWidgets');
    if (storedSelectedWidgets) {
      setSelectedWidgets(JSON.parse(storedSelectedWidgets));
    }
    const storedWidgetLayout = localStorage.getItem('widgetLayout');
    if (storedWidgetLayout) {
      setWidgetLayout(JSON.parse(storedWidgetLayout));
    }
    const storedCustomizableWidgets = localStorage.getItem('customizableWidgets');
    if (storedCustomizableWidgets) {
      setCustomizableWidgets(JSON.parse(storedCustomizableWidgets));
    }
  }, []);

  const handleWidgetClick = (widget) => {
    widget.frequency++;
    setCustomizableWidgets(customizableWidgets.map((w) => w.id === widget.id ? widget : w));
    localStorage.setItem('customizableWidgets', JSON.stringify(customizableWidgets));
  };

  const handleWidgetLayoutChange = (newLayout) => {
    setWidgetLayout(newLayout);
    localStorage.setItem('widgetLayout', JSON.stringify(newLayout));
  };

  const handleWidgetAdd = (widget) => {
    const newLayout = { ...widgetLayout };
    newLayout.widgets.push(widget);
    handleWidgetLayoutChange(newLayout);
  };

  const handleWidgetRemove = (widgetId) => {
    const newLayout = { ...widgetLayout };
    newLayout.widgets = newLayout.widgets.filter((widget) => widget.id !== widgetId);
    handleWidgetLayoutChange(newLayout);
  };

  const handleWidgetPriorityChange = (widgetId, newPriority) => {
    const newLayout = { ...widgetLayout };
    newLayout.widgets = newLayout.widgets.map((widget) => {
      if (widget.id === widgetId) {
        widget.priority = newPriority;
      }
      return widget;
    });
    handleWidgetLayoutChange(newLayout);
  };

  return (
    <div>
      <DashboardHeader />
      <NavigationMenu />
      <div className="dashboard-container">
        <div className="widget-layout">
          {widgetLayout.widgets.map((widget, index) => (
            <DashboardCard key={index} widget={widget} onClick={() => handleWidgetClick(widget)} />
          ))}
        </div>
        <div className="widget-settings">
          <WidgetSettings
            availableWidgets={availableWidgets}
            selectedWidgets={selectedWidgets}
            onWidgetAdd={handleWidgetAdd}
            onWidgetRemove={handleWidgetRemove}
            onWidgetPriorityChange={handleWidgetPriorityChange}
          />
        </div>
      </div>
    </div>
  );
}