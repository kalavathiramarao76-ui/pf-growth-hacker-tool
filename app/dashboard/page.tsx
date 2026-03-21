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
    }
  };

  return (
    <div>
      <DashboardHeader />
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
        <div className="flex flex-wrap justify-center">
          {widgets.map((widget) => (
            <DashboardCard key={widget.id} title={widget.title} icon={widget.icon} onClick={widget.onClick} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold">Unlock the Full Potential of AI-Powered Content Optimizer</h2>
          <p className="text-lg">Upgrade to our premium plan and get access to advanced features, priority support, and more.</p>
          <div className="flex flex-wrap justify-center mt-6">
            <div className="w-full lg:w-1/2 xl:w-1/3 p-6">
              <h3 className="text-2xl font-bold">Premium Plan</h3>
              <ul>
                <li>Advanced analytics and insights</li>
                <li>Priority support and dedicated account manager</li>
                <li>Access to exclusive content and resources</li>
              </ul>
              <p className="text-lg font-bold">$29.99/month</p>
              <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpgradePlan}>
                Upgrade Now
              </button>
            </div>
            <div className="w-full lg:w-1/2 xl:w-1/3 p-6">
              <h3 className="text-2xl font-bold">Benefits of Upgrading</h3>
              <ul>
                <li>Improve your content's performance and engagement</li>
                <li>Get personalized support and guidance</li>
                <li>Stay ahead of the competition with exclusive resources</li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2 xl:w-1/3 p-6">
              <h3 className="text-2xl font-bold">What Our Users Say</h3>
              <p className="text-lg">"AI-Powered Content Optimizer has been a game-changer for our business. The premium plan has given us the insights and support we need to take our content to the next level."</p>
              <p className="text-lg">- John Doe, CEO of Example Company</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}