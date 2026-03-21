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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedSubscription = localStorage.getItem('subscription');
    if (storedSubscription) {
      setSubscription(JSON.parse(storedSubscription));
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
    { id: 6, title: 'Content Suggestions', icon: <AiOutlinePlus size={24} />, onClick: () => console.log('Content suggestions clicked') },
    { id: 7, title: 'Priority Support', icon: <MdSettings size={24} />, onClick: () => router.push('/priority-support'), availableFor: 'premium' },
    { id: 8, title: 'Advanced Analytics', icon: <IoMdAnalytics size={24} />, onClick: () => router.push('/advanced-analytics'), availableFor: 'premium' },
  ];

  const premiumWidgets = availableWidgets.filter((widget) => widget.availableFor === 'premium');

  return (
    <div>
      <DashboardHeader user={user} subscription={subscription} />
      <NavigationMenu />
      <div className="dashboard-container">
        {widgets.map((widget) => (
          <DashboardCard key={widget.id} title={widget.title} icon={widget.icon} onClick={widget.onClick} />
        ))}
        {subscription && subscription.plan === 'premium' && (
          <div>
            <h2>Premium Features</h2>
            {premiumWidgets.map((widget) => (
              <DashboardCard key={widget.id} title={widget.title} icon={widget.icon} onClick={widget.onClick} />
            ))}
          </div>
        )}
        <button onClick={handleAddWidget}>Add Widget</button>
      </div>
    </div>
  );
}