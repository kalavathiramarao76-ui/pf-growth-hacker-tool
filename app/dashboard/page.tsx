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

  const availableWidgets = [
    { id: 1, title: 'Create Content', icon: <AiOutlinePlus size={24} />, onClick: () => router.push('/content-analyzer') },
    { id: 2, title: 'View Analytics', icon: <IoMdAnalytics size={24} />, onClick: () => router.push('/engagement-tracker') },
    { id: 3, title: 'Content Calendar', icon: <FaRegCalendarAlt size={24} />, onClick: () => router.push('/content-calendar') },
    { id: 4, title: 'Settings', icon: <MdSettings size={24} />, onClick: () => router.push('/settings') },
    { id: 5, title: 'Upgrade to Premium', icon: <MdSettings size={24} />, onClick: () => router.push('/upgrade-plan') },
  ];

  return (
    <div>
      <DashboardHeader />
      <NavigationMenu />
      <div className="container mx-auto p-4">
        <div className="flex justify-center mb-4">
          {subscription && subscription.plan === 'premium' ? (
            <div className="text-lg text-green-500">You are a premium user. Enjoy advanced features!</div>
          ) : (
            <div className="text-lg text-orange-500">
              Upgrade to premium to unlock advanced features, such as advanced analytics, priority support, and more.{' '}
              <button
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleUpgradePlan}
              >
                Upgrade Now
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {widgets.map((widget) => (
            <DashboardCard key={widget.id} title={widget.title} icon={widget.icon} onClick={widget.onClick} />
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddWidget}
          >
            Add Widget
          </button>
        </div>
      </div>
    </div>
  );
}