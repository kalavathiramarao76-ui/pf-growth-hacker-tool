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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleCreateContent = () => {
    router.push('/content-analyzer');
  };

  const handleViewAnalytics = () => {
    router.push('/engagement-tracker');
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
    { id: 7, title: 'Engagement Tracker', icon: <IoMdAnalytics size={24} />, onClick: () => console.log('Engagement tracker clicked') },
  ];

  const handleSaveWidgetOrder = () => {
    localStorage.setItem('widgets', JSON.stringify(widgets));
  };

  const handleLoadWidgetOrder = () => {
    const storedWidgets = localStorage.getItem('widgets');
    if (storedWidgets) {
      setWidgets(JSON.parse(storedWidgets));
    }
  };

  useEffect(() => {
    handleLoadWidgetOrder();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader user={user} />
      <NavigationMenu />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-4">
            <h2 className="text-2xl font-bold mb-2">Welcome to AI-Powered Content Optimizer</h2>
            <p className="text-lg">Optimize your content for better engagement and conversion rates.</p>
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-1 mb-4">
            <h3 className="text-xl font-bold mb-2">Customizable Dashboard</h3>
            <div className="flex flex-wrap gap-4">
              {widgets.map((widget, index) => (
                <DashboardCard key={widget.id} widget={widget} onRemove={() => handleRemoveWidget(widget.id)} />
              ))}
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddWidget}>
              Add Widget
            </button>
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-1 mb-4">
            <h3 className="text-xl font-bold mb-2">Available Widgets</h3>
            <div className="flex flex-wrap gap-4">
              {availableWidgets.map((widget) => (
                <DashboardCard key={widget.id} widget={widget} onAdd={() => setWidgets([...widgets, widget])} />
              ))}
            </div>
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-1 mb-4">
            <h3 className="text-xl font-bold mb-2">Widget Settings</h3>
            <WidgetSettings widgets={widgets} onReorder={handleReorderWidgets} onSave={handleSaveWidgetOrder} />
          </div>
        </div>
      </main>
    </div>
  );
}