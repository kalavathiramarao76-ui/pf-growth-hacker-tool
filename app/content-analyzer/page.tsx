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
  const [contentType, setContentType] = useState('text');
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [alternativeFormats, setAlternativeFormats] = useState(null);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(null);

  useEffect(() => {
    const storedContent = LocalStorage.get('content');
    const storedAnalysisHistory = LocalStorage.get('analysisHistory');
    if (storedContent) {
      setContent(storedContent);
    }
    if (storedAnalysisHistory) {
      setAnalysisHistory(storedAnalysisHistory);
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
      LocalStorage.set('analysisHistory', newAnalysisHistory);
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

  const handleTrackEngagement = async () => {
    try {
      const response = await fetch('/api/track-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      setEngagement(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRealTimeAnalysis = async (content: string) => {
    try {
      const response = await fetch('/api/real-time-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      setRealTimeAnalysis(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (content) {
        handleRealTimeAnalysis(content);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [content]);

  return (
    <div>
      <SEO title="Content Analyzer" />
      <PageHeader title="Content Analyzer" />
      <ContentAnalyzerForm
        content={content}
        contentType={contentType}
        image={image}
        video={video}
        onAnalyze={(content, contentType, image, video) => handleAnalyze(content, contentType, image, video)}
        onTrackEngagement={handleTrackEngagement}
        onContentChange={(content) => setContent(content)}
        onContentTypeChange={(contentType) => setContentType(contentType)}
        onImageChange={(image) => setImage(image)}
        onVideoChange={(video) => setVideo(video)}
      />
      {analysis && (
        <OptimizationSuggestions
          analysis={analysis}
          suggestions={suggestions}
          alternativeFormats={alternativeFormats}
        />
      )}
      {engagement && (
        <EngagementTracker engagement={engagement} />
      )}
      {realTimeAnalysis && (
        <div>
          <h2>Real-time Analysis</h2>
          <p>{realTimeAnalysis}</p>
        </div>
      )}
    </div>
  );
};

export default ContentAnalyzerPage;