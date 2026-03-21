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
      setEngagement(data.engagement);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (event: any) => {
    setImage(event.target.files[0]);
  };

  const handleVideoChange = (event: any) => {
    setVideo(event.target.files[0]);
  };

  const handleContentTypeChange = (event: any) => {
    setContentType(event.target.value);
  };

  const handleLoadAnalysis = (analysis: any) => {
    setAnalysis(analysis.analysis);
    setSuggestions(analysis.suggestions);
  };

  return (
    <div>
      <SEO title="AI-Powered Content Optimizer" />
      <PageHeader title="Content Analyzer" />
      <ContentAnalyzerForm
        content={content}
        contentType={contentType}
        image={image}
        video={video}
        onAnalyze={handleAnalyze}
        onImageChange={handleImageChange}
        onVideoChange={handleVideoChange}
        onContentTypeChange={handleContentTypeChange}
      />
      {analysis && (
        <OptimizationSuggestions
          analysis={analysis}
          suggestions={suggestions}
          onTrackEngagement={handleTrackEngagement}
        />
      )}
      {alternativeFormats && (
        <div>
          <h2>Alternative Formats</h2>
          <ul>
            {alternativeFormats.map((format: any) => (
              <li key={format.id}>{format.name}</li>
            ))}
          </ul>
        </div>
      )}
      {engagement && <EngagementTracker engagement={engagement} />}
    </div>
  );
};

export default ContentAnalyzerPage;