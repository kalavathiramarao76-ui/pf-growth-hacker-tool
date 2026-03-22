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
      }
      const alternativeFormatsResponse = await fetch('/api/suggest-alternative-formats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, contentType }),
      });
      const alternativeFormatsData = await alternativeFormatsResponse.json();
      setAlternativeFormats(alternativeFormatsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAlternativeFormat = async (format: string) => {
    try {
      const response = await fetch('/api/generate-alternative-format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, contentType, format }),
      });
      const data = await response.json();
      if (format === 'video') {
        setVideo(data.video);
      } else if (format === 'audio') {
        setImage(data.audio);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <SEO title="AI-Powered Content Optimizer" />
      <PageHeader />
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
      {alternativeFormats && (
        <AlternativeFormats
          alternativeFormats={alternativeFormats}
          onAlternativeFormat={handleAlternativeFormat}
        />
      )}
      {engagement && (
        <EngagementTracker engagement={engagement} />
      )}
    </div>
  );
};

export default ContentAnalyzerPage;