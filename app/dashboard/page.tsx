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

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader user={user} />
      <NavigationMenu />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {widgets.map((widget) => (
            <DashboardCard
              key={widget.id}
              title={widget.title}
              icon={widget.icon}
              onClick={widget.onClick}
            >
              {widget.title === 'Create Content' && (
                <p>Analyze and optimize your marketing content for better engagement and conversion rates.</p>
              )}
              {widget.title === 'View Analytics' && (
                <p>Track your progress and make data-driven decisions to improve your content strategy.</p>
              )}
              {widget.title === 'Content Calendar' && (
                <p>Plan and schedule your content in advance to save time and increase productivity.</p>
              )}
              {widget.title === 'Settings' && (
                <p>Configure your account settings and customize your experience.</p>
              )}
              {widget.title === 'Upgrade to Premium' && (
                <p>Unlock exclusive features and priority support to take your content to the next level.</p>
              )}
            </DashboardCard>
          ))}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Premium Features</h2>
          <p>Upgrade to our premium plan to unlock exclusive features and priority support.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard
              title="Advanced Analytics"
              icon={<IoMdAnalytics size={24} />}
              onClick={() => router.push('/upgrade-plan')}
            >
              <p>Get in-depth insights into your content performance and audience engagement.</p>
            </DashboardCard>
            <DashboardCard
              title="Priority Support"
              icon={<MdSettings size={24} />}
              onClick={() => router.push('/upgrade-plan')}
            >
              <p>Get dedicated support from our team to help you achieve your content goals.</p>
            </DashboardCard>
            <DashboardCard
              title="Exclusive Content Templates"
              icon={<AiOutlinePlus size={24} />}
              onClick={() => router.push('/upgrade-plan')}
            >
              <p>Access a library of exclusive content templates to help you create high-quality content.</p>
            </DashboardCard>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleUpgradePlan}
          >
            Upgrade to Premium
          </button>
        </div>
      </main>
    </div>
  );
}