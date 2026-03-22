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

  const handleWidgetAdd = (widget) => {
    const newWidgets = [...widgetLayout.widgets, widget];
    setWidgetLayout({ ...widgetLayout, widgets: newWidgets });
  };

  const handleWidgetRemove = (widgetId) => {
    const newWidgets = widgetLayout.widgets.filter((widget) => widget.id !== widgetId);
    setWidgetLayout({ ...widgetLayout, widgets: newWidgets });
  };

  const handleWidgetMove = (widgetId, newColumn, newRow) => {
    const newWidgets = widgetLayout.widgets.map((widget) => {
      if (widget.id === widgetId) {
        return { ...widget, column: newColumn, row: newRow };
      }
      return widget;
    });
    setWidgetLayout({ ...widgetLayout, widgets: newWidgets });
  };

  const handleLayoutChange = (newColumns, newRows) => {
    setWidgetLayout({ columns: newColumns, rows: newRows, widgets: widgetLayout.widgets });
  };

  useEffect(() => {
    const storedWidgetLayout = localStorage.getItem('widgetLayout');
    if (storedWidgetLayout) {
      setWidgetLayout(JSON.parse(storedWidgetLayout));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('widgetLayout', JSON.stringify(widgetLayout));
  }, [widgetLayout]);

  return (
    <div>
      <DashboardHeader />
      <NavigationMenu />
      <div className="widget-layout-container">
        {widgetLayout.columns > 0 && widgetLayout.rows > 0 && (
          <div className="widget-layout" style={{ gridTemplateColumns: `repeat(${widgetLayout.columns}, 1fr)` }}>
            {widgetLayout.widgets.map((widget, index) => (
              <div key={widget.id} className="widget" style={{ gridColumn: widget.column, gridRow: widget.row }}>
                <DashboardCard
                  title={widget.title}
                  icon={widget.icon}
                  onClick={widget.onClick}
                  description={widget.description}
                  onRemove={() => handleWidgetRemove(widget.id)}
                  onMove={(newColumn, newRow) => handleWidgetMove(widget.id, newColumn, newRow)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="available-widgets-container">
        <h2>Available Widgets</h2>
        <div className="available-widgets">
          {availableWidgets.map((widget) => (
            <div key={widget.id} className="available-widget">
              <DashboardCard
                title={widget.title}
                icon={widget.icon}
                onClick={widget.onClick}
                onAdd={() => handleWidgetAdd(widget)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="layout-settings-container">
        <h2>Layout Settings</h2>
        <div className="layout-settings">
          <label>Columns:</label>
          <input type="number" value={widgetLayout.columns} onChange={(e) => handleLayoutChange(parseInt(e.target.value), widgetLayout.rows)} />
          <label>Rows:</label>
          <input type="number" value={widgetLayout.rows} onChange={(e) => handleLayoutChange(widgetLayout.columns, parseInt(e.target.value))} />
        </div>
      </div>
    </div>
  );
}