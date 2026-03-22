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

  return (
    <div>
      <DashboardHeader />
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
        <div className="flex flex-col lg:flex-row justify-center items-center mb-12">
          <h1 className="text-3xl font-bold mb-4 lg:mb-0">AI-Powered Content Optimizer</h1>
          <button 
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-0 lg:ml-4"
            onClick={() => router.push('/upgrade-plan')}
          >
            Upgrade to Premium
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {widgets.map((widget) => (
            <DashboardCard key={widget.id} title={widget.title} icon={widget.icon} onClick={widget.onClick} />
          ))}
        </div>
        <div className="bg-gray-100 p-4 rounded mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Upgrade to Premium?</h2>
          <ul>
            <li>Get additional features to optimize your content</li>
            <li>Priority support to help you succeed</li>
            <li>More storage and bandwidth to grow your business</li>
          </ul>
          <p className="text-lg font-bold mb-4">Pricing:</p>
          <ul>
            <li>Monthly: $9.99</li>
            <li>Yearly: $99.99 (save 20% compared to monthly)</li>
          </ul>
          <button 
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push('/upgrade-plan')}
          >
            Upgrade Now
          </button>
        </div>
        <NavigationMenu />
        <WidgetSettings />
      </div>
    </div>
  );
}