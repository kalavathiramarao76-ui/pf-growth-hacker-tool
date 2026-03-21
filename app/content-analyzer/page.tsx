use client;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '../utils/local-storage';
import { SEO } from '../components/seo';
import { PageHeader } from '../components/page-header';
import { ContentAnalyzerForm } from '../components/content-analyzer-form';
import { OptimizationSuggestions } from '../components/optimization-suggestions';
import { EngagementTracker } from '../components/engagement-tracker';
import { AlternativeFormats } from '../components/alternative-formats';

const ContentAnalyzerPage = () => {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('text');
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [alternativeFormats, setAlternativeFormats] = useState(null);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(null);
  const [user, setUser] = useState(null);
  const [userEngagementMetrics, setUserEngagementMetrics] = useState(null);

  useEffect(() => {
    const storedContent = LocalStorage.get('content');
    const storedAnalysisHistory = LocalStorage.get('analysisHistory');
    const storedUser = LocalStorage.get('user');
    if (storedContent) {
      setContent(storedContent);
    }
    if (storedAnalysisHistory) {
      setAnalysisHistory(storedAnalysisHistory);
    }
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleAnalyze = async (content: string, contentType: string, image: any, video: any) => {
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('contentType', contentType);
      if (image) {
        formData.append('image', image);
      }
      if (video) {
        formData.append('video', video);
      }
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAnalysis(data.analysis);
      setSuggestions(data.suggestions);
      const newAnalysisHistory = [...analysisHistory, {
        content,
        contentType,
        analysis: data.analysis,
        suggestions: data.suggestions,
      }];
      setAnalysisHistory(newAnalysisHistory);
      if (user) {
        const userId = user.id;
        const analysisHistoryResponse = await fetch('/api/save-analysis-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, analysisHistory: newAnalysisHistory }),
        });
        const analysisHistoryData = await analysisHistoryResponse.json();
        if (analysisHistoryData.success) {
          LocalStorage.set('analysisHistory', newAnalysisHistory);
        }
      } else {
        LocalStorage.set('analysisHistory', newAnalysisHistory);
      }
      await fetchUserEngagementMetrics();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserEngagementMetrics = async () => {
    try {
      if (user) {
        const userId = user.id;
        const response = await fetch(`/api/user-engagement-metrics/${userId}`);
        const data = await response.json();
        setUserEngagementMetrics(data);
        suggestAlternativeFormats(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const suggestAlternativeFormats = (engagementMetrics: any) => {
    if (engagementMetrics) {
      const engagementScores = engagementMetrics.scores;
      const suggestedFormats: string[] = [];
      if (engagementScores.video > engagementScores.text) {
        suggestedFormats.push('video');
      }
      if (engagementScores.image > engagementScores.text) {
        suggestedFormats.push('image');
      }
      if (engagementScores.audio > engagementScores.text) {
        suggestedFormats.push('audio');
      }
      setAlternativeFormats(suggestedFormats);
    }
  };

  return (
    <div>
      <SEO title="Content Analyzer" />
      <PageHeader title="Content Analyzer" />
      <ContentAnalyzerForm
        content={content}
        contentType={contentType}
        image={image}
        video={video}
        onAnalyze={handleAnalyze}
      />
      {analysis && (
        <OptimizationSuggestions
          analysis={analysis}
          suggestions={suggestions}
        />
      )}
      {engagement && (
        <EngagementTracker engagement={engagement} />
      )}
      {alternativeFormats && (
        <AlternativeFormats formats={alternativeFormats} />
      )}
    </div>
  );
};

export default ContentAnalyzerPage;