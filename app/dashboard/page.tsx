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

  const handleUpgradePlan = () => {
    router.push('/upgrade-plan');
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
          <DashboardCard
            title="Upgrade to Premium"
            icon={<MdSettings size={24} />}
            onClick={handleUpgradePlan}
            className="bg-orange-100 hover:bg-orange-200"
          >
            <h2 className="text-lg font-bold mb-2">Unlock the Full Potential</h2>
            <p>Upgrade to our premium plan and get access to:</p>
            <ul className="list-disc pl-4 mb-4">
              <li>Priority support</li>
              <li>Advanced analytics and insights</li>
              <li>Unlimited content creation and optimization</li>
            </ul>
            <p className="text-lg font-bold">Pricing:
              <ul className="list-disc pl-4 mb-4">
                <li>Basic: $9.99/month (limited features)</li>
                <li>Premium: $29.99/month (all features, priority support)</li>
                <li>Enterprise: custom pricing (large teams, advanced features)</li>
              </ul>
            </p>
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleUpgradePlan}
            >
              Upgrade Now
            </button>
          </DashboardCard>
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-lg font-bold mb-2">Compare Plans</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-2">Feature</th>
                <th className="border border-gray-200 p-2">Basic</th>
                <th className="border border-gray-200 p-2">Premium</th>
                <th className="border border-gray-200 p-2">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 p-2">Content Creation</td>
                <td className="border border-gray-200 p-2">Limited</td>
                <td className="border border-gray-200 p-2">Unlimited</td>
                <td className="border border-gray-200 p-2">Unlimited</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-2">Analytics and Insights</td>
                <td className="border border-gray-200 p-2">Basic</td>
                <td className="border border-gray-200 p-2">Advanced</td>
                <td className="border border-gray-200 p-2">Advanced</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-2">Priority Support</td>
                <td className="border border-gray-200 p-2">No</td>
                <td className="border border-gray-200 p-2">Yes</td>
                <td className="border border-gray-200 p-2">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}