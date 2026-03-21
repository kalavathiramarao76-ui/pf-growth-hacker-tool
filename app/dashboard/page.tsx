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
    { id: 5, title: 'Upgrade to Premium', icon: <MdSettings size={24} />, onClick: () => router.push('/upgrade-plan') },
  ]);

  const [subscription, setSubscription] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(1);

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
  }, []);

  const handleCreateContent = () => {
    router.push('/content-analyzer');
  };

  const handleViewAnalytics = () => {
    if (subscription && subscription.plan === 'premium') {
      router.push('/advanced-analytics');
    } else {
      router.push('/engagement-tracker');
    }
  };

  const handleViewCalendar = () => {
    router.push('/content-calendar');
  };

  const handleViewSettings = () => {
    router.push('/settings');
  };

  const handleUpgradePlan = () => {
    router.push('/upgrade-plan');
  };

  const handleAddWidget = () => {
    setWidgets([...widgets, { id: widgets.length + 1, title: 'New Widget', icon: <AiOutlinePlus size={24} />, onClick: () => console.log('New widget clicked') }]);
  };

  const handleRemoveWidget = (id) => {
    setWidgets(widgets.filter((widget) => widget.id !== id));
  };

  const handleReorderWidgets = (newWidgets) => {
    setWidgets(newWidgets);
  };

  const handleNextTutorialStep = () => {
    setTutorialStep(tutorialStep + 1);
    if (tutorialStep === 3) {
      setShowTutorial(false);
    }
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <div className="dashboard-container">
      {showTutorial && (
        <div className="tutorial-overlay">
          {tutorialStep === 1 && (
            <div className="tutorial-step">
              <h2>Welcome to the AI-Powered Content Optimizer!</h2>
              <p>This is your dashboard, where you can access all the features of the application.</p>
              <button onClick={handleNextTutorialStep}>Next</button>
            </div>
          )}
          {tutorialStep === 2 && (
            <div className="tutorial-step">
              <h2>Navigation Menu</h2>
              <p>Use the navigation menu on the left to access different sections of the application.</p>
              <button onClick={handleNextTutorialStep}>Next</button>
              <button onClick={handleSkipTutorial}>Skip Tutorial</button>
            </div>
          )}
          {tutorialStep === 3 && (
            <div className="tutorial-step">
              <h2>Getting Started</h2>
              <p>Click on the "Create Content" button to start creating your first piece of content.</p>
              <button onClick={handleSkipTutorial}>Finish Tutorial</button>
            </div>
          )}
        </div>
      )}
      <DashboardHeader user={user} />
      <div className="dashboard-content">
        <div className="widget-container">
          {widgets.map((widget) => (
            <DashboardCard key={widget.id} title={widget.title} icon={widget.icon} onClick={widget.onClick} />
          ))}
          <button className="add-widget-button" onClick={handleAddWidget}>
            <AiOutlinePlus size={24} />
            Add Widget
          </button>
        </div>
        <div className="settings-container">
          <WidgetSettings widgets={widgets} onRemoveWidget={handleRemoveWidget} onReorderWidgets={handleReorderWidgets} />
        </div>
      </div>
      <NavigationMenu />
    </div>
  );
}