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
      description: 'Get additional features, priority support, and more with our premium plan' 
    },
  ]);

  const categorizedWidgets = {
    'Content Creation': [
      { id: 1, title: 'Create Content', icon: <AiOutlinePlus size={24} />, onClick: () => router.push('/content-analyzer') },
    ],
    'Analytics and Insights': [
      { id: 2, title: 'View Analytics', icon: <IoMdAnalytics size={24} />, onClick: () => router.push('/engagement-tracker') },
    ],
    'Content Planning': [
      { id: 3, title: 'Content Calendar', icon: <FaRegCalendarAlt size={24} />, onClick: () => router.push('/content-calendar') },
    ],
    'Settings and Upgrades': [
      { id: 4, title: 'Settings', icon: <MdSettings size={24} />, onClick: () => router.push('/settings') },
      { 
        id: 5, 
        title: 'Upgrade to Premium', 
        icon: <MdSettings size={24} />, 
        onClick: () => router.push('/upgrade-plan'), 
        description: 'Get additional features, priority support, and more with our premium plan' 
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <NavigationMenu />
      <div className="widget-categories">
        {Object.keys(categorizedWidgets).map(category => (
          <div key={category} className="widget-category">
            <h2>{category}</h2>
            <div className="widget-grid">
              {categorizedWidgets[category].map(widget => (
                <DashboardCard key={widget.id} widget={widget} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <WidgetSettings />
    </div>
  );
}