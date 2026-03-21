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
    setContent(analysis.content);
    setContentType(analysis.contentType);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Content Analyzer" />
      <ContentAnalyzerForm
        content={content}
        onChange={(content) => setContent(content)}
        onAnalyze={(content) => handleAnalyze(content, contentType, image, video)}
        onImageChange={handleImageChange}
        onVideoChange={handleVideoChange}
        onContentTypeChange={handleContentTypeChange}
        contentType={contentType}
      />
      {analysis && (
        <div className="mt-8">
          <h2 className="text-lg font-bold">Analysis</h2>
          <p className="text-sm text-gray-600">Your content has been analyzed.</p>
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
      <div className="mt-8">
        <h2 className="text-lg font-bold">Analysis History</h2>
        <ul>
          {analysisHistory.map((analysis, index) => (
            <li key={index} className="py-2">
              <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => handleLoadAnalysis(analysis)}>Load Analysis {index + 1}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContentAnalyzerPage;