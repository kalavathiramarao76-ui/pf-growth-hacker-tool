use client;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoMdAnalytics } from 'react-icons/io';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import Link from 'next/link';
import DashboardCard from '../components/DashboardCard';
import DashboardHeader from '../components/DashboardHeader';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

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

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader user={user} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard
            title="Create Content"
            icon={<AiOutlinePlus size={24} />}
            onClick={handleCreateContent}
          >
            Analyze and optimize your marketing content for better engagement and conversion rates.
          </DashboardCard>
          <DashboardCard
            title="View Analytics"
            icon={<IoMdAnalytics size={24} />}
            onClick={handleViewAnalytics}
          >
            Track your progress and adjust your strategy accordingly.
          </DashboardCard>
          <DashboardCard
            title="Content Calendar"
            icon={<FaRegCalendarAlt size={24} />}
            onClick={handleViewCalendar}
          >
            Plan and organize your content in advance.
          </DashboardCard>
          <DashboardCard
            title="Settings"
            icon={<MdSettings size={24} />}
            onClick={handleViewSettings}
          >
            Configure your account and preferences.
          </DashboardCard>
        </div>
      </main>
    </div>
  );
}