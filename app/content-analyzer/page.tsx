use client;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '../utils/local-storage';
import { SEO } from '../components/seo';
import { PageHeader } from '../components/page-header';
import { ContentAnalyzerForm } from '../components/content-analyzer-form';
import { OptimizationSuggestions } from '../components/optimization-suggestions';
import { EngagementTracker } from '../components/engagement-tracker';

const ContentAnalyzerPage = () => {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [engagement, setEngagement] = useState(null);

  useEffect(() => {
    const storedContent = LocalStorage.get('content');
    if (storedContent) {
      setContent(storedContent);
    }
  }, []);

  const handleAnalyze = async (content: string) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTrackEngagement = async () => {
    try {
      const response = await fetch('/api/track-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      setEngagement(data.engagement);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Content Analyzer" />
      <ContentAnalyzerForm
        content={content}
        onChange={(content) => setContent(content)}
        onAnalyze={handleAnalyze}
      />
      {analysis && (
        <div className="mt-8">
          <h2 className="text-lg font-bold">Analysis</h2>
          <p className="text-gray-600">{analysis}</p>
        </div>
      )}
      {suggestions && (
        <div className="mt-8">
          <h2 className="text-lg font-bold">Optimization Suggestions</h2>
          <OptimizationSuggestions suggestions={suggestions} />
        </div>
      )}
      {engagement && (
        <div className="mt-8">
          <h2 className="text-lg font-bold">Engagement Tracker</h2>
          <EngagementTracker engagement={engagement} />
        </div>
      )}
    </div>
  );
};

export default ContentAnalyzerPage;