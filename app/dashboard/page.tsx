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
  const [availableWidgets, setAvailableWidgets] = useState([
    { id: 6, title: 'New Widget', icon: <AiOutlinePlus size={24} />, onClick: () => console.log('New widget clicked') },
    { id: 7, title: 'Another Widget', icon: <IoMdAnalytics size={24} />, onClick: () => console.log('Another widget clicked') },
  ]);
  const [selectedWidgets, setSelectedWidgets] = useState(widgets);

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

  const handleAddWidget = (widget) => {
    setSelectedWidgets([...selectedWidgets, widget]);
    localStorage.setItem('selectedWidgets', JSON.stringify([...selectedWidgets, widget]));
  };

  const handleRemoveWidget = (id) => {
    setSelectedWidgets(selectedWidgets.filter((widget) => widget.id !== id));
    localStorage.setItem('selectedWidgets', JSON.stringify(selectedWidgets.filter((widget) => widget.id !== id)));
  };

  const handleReorderWidgets = (newWidgets) => {
    setSelectedWidgets(newWidgets);
    localStorage.setItem('selectedWidgets', JSON.stringify(newWidgets));
  };

  const handleNextTutorialStep = () => {
    setTutorialStep(tutorialStep + 1);
    if (tutorialStep === 3) {
      setShowTutorial(false);
    }
  };

  return (
    <div>
      <DashboardHeader />
      <NavigationMenu />
      <div className="dashboard-container">
        <div className="widget-settings">
          <WidgetSettings
            availableWidgets={availableWidgets}
            selectedWidgets={selectedWidgets}
            onAddWidget={handleAddWidget}
            onRemoveWidget={handleRemoveWidget}
            onReorderWidgets={handleReorderWidgets}
          />
        </div>
        <div className="dashboard-cards">
          {selectedWidgets.map((widget) => (
            <DashboardCard key={widget.id} title={widget.title} icon={widget.icon} onClick={widget.onClick} />
          ))}
        </div>
      </div>
    </div>
  );
}