use client;

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineSave } from 'react-icons/ai';
import { Switch } from '@headlessui/react';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [analytics, setAnalytics] = useState(() => localStorage.getItem('analytics') === 'true');
  const router = useRouter();

  const handleSave = () => {
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('analytics', analytics.toString());
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col h-screen p-6 md:p-12">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <div className="flex flex-col mb-6">
        <label className="text-lg font-medium mb-2">Dark Mode</label>
        <Switch
          checked={darkMode}
          onChange={setDarkMode}
          className={`${
            darkMode ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span
            className={`${
              darkMode ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out`}
          />
        </Switch>
      </div>
      <div className="flex flex-col mb-6">
        <label className="text-lg font-medium mb-2">Analytics</label>
        <Switch
          checked={analytics}
          onChange={setAnalytics}
          className={`${
            analytics ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span
            className={`${
              analytics ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out`}
          />
        </Switch>
      </div>
      <button
        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        onClick={handleSave}
      >
        <AiOutlineSave className="mr-2" />
        Save Changes
      </button>
    </div>
  );
};

export default SettingsPage;