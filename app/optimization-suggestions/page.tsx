use client;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '../utils/localStorage';
import OptimizationSuggestionsList from '../components/OptimizationSuggestionsList';
import PageHeader from '../components/PageHeader';
import PageLayout from '../components/PageLayout';

const OptimizationSuggestionsPage = () => {
  const router = useRouter();
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptimizationSuggestions = async () => {
      setLoading(true);
      const storedSuggestions = LocalStorage.get('optimizationSuggestions');
      if (storedSuggestions) {
        setOptimizationSuggestions(storedSuggestions);
      } else {
        // Simulate API call to fetch optimization suggestions
        const suggestions = [
          { id: 1, title: 'Use attention-grabbing headlines', description: 'Headlines that grab attention increase engagement by 20%' },
          { id: 2, title: 'Optimize images for web', description: 'Optimized images reduce page load time by 30%' },
          { id: 3, title: 'Use social proof', description: 'Social proof increases conversion rates by 15%' },
        ];
        setOptimizationSuggestions(suggestions);
        LocalStorage.set('optimizationSuggestions', suggestions);
      }
      setLoading(false);
    };
    fetchOptimizationSuggestions();
  }, []);

  return (
    <PageLayout>
      <PageHeader title="Optimization Suggestions" />
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <OptimizationSuggestionsList suggestions={optimizationSuggestions} />
      )}
    </PageLayout>
  );
};

export default OptimizationSuggestionsPage;