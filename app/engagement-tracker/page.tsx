use client;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '../utils/local-storage';
import { EngagementTrackerData } from '../types/engagement-tracker';
import EngagementTrackerChart from '../components/engagement-tracker-chart';
import EngagementTrackerTable from '../components/engagement-tracker-table';

const EngagementTrackerPage = () => {
  const router = useRouter();
  const [engagementData, setEngagementData] = useState<EngagementTrackerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = LocalStorage.get('engagementData');
    if (storedData) {
      setEngagementData(storedData);
      setLoading(false);
    } else {
      // Generate dummy data for demonstration purposes
      const dummyData: EngagementTrackerData[] = [
        { date: '2024-01-01', engagement: 100 },
        { date: '2024-01-02', engagement: 120 },
        { date: '2024-01-03', engagement: 150 },
        { date: '2024-01-04', engagement: 180 },
        { date: '2024-01-05', engagement: 200 },
      ];
      setEngagementData(dummyData);
      LocalStorage.set('engagementData', dummyData);
      setLoading(false);
    }
  }, []);

  const handleBackToDashboard = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col h-screen p-4 md:p-6 lg:p-8">
      <header className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Engagement Tracker</h1>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
      </header>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-lg font-bold">Loading...</p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <EngagementTrackerChart data={engagementData} />
          <EngagementTrackerTable data={engagementData} />
        </div>
      )}
    </div>
  );
};

export default EngagementTrackerPage;