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
    const storedPersonalizedRecommendations = localStorage.getItem('personalizedRecommendations');
    if (storedPersonalizedRecommendations) {
      setPersonalizedRecommendations(JSON.parse(storedPersonalizedRecommendations));
    } else {
      fetch('/api/personalized-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: storedUser ? JSON.parse(storedUser).id : null,
          subscription: storedSubscription ? JSON.parse(storedSubscription) : null,
          usageMetrics: {
            // Add usage metrics here, e.g. page views, engagement, etc.
          }
        })
      })
      .then(response => response.json())
      .then(data => {
        setPersonalizedRecommendations(data);
        localStorage.setItem('personalizedRecommendations', JSON.stringify(data));
      })
      .catch(error => console.error(error));
    }
  }, []);

  const handleCreateContent = () => {
    router.push('/content-analyzer');
  };

  return (
    <div>
      <DashboardHeader />
      <NavigationMenu />
      <div className="dashboard-content">
        {personalizedRecommendations.length > 0 && (
          <div className="personalized-recommendations">
            <h2>Personalized Recommendations</h2>
            {personalizedRecommendations.map(recommendation => (
              <DashboardCard key={recommendation.id} title={recommendation.title} icon={recommendation.icon} onClick={recommendation.onClick} description={recommendation.description} />
            ))}
          </div>
        )}
        <div className="widgets">
          {selectedWidgets.map(widget => (
            <DashboardCard key={widget.id} title={widget.title} icon={widget.icon} onClick={widget.onClick} />
          ))}
        </div>
        {showTutorial && (
          <WidgetSettings tutorialStep={tutorialStep} setTutorialStep={setTutorialStep} />
        )}
      </div>
    </div>
  );
}