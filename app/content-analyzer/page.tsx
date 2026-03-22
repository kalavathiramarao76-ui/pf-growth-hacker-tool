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
  const [audio, setAudio] = useState(null);
  const [pdf, setPdf] = useState(null);
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

  const handleAnalyze = async (content: string, contentType: string, image: any, video: any, audio: any, pdf: any) => {
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
      if (audio) {
        formData.append('audio', audio);
      }
      if (pdf) {
        formData.append('pdf', pdf);
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
    } catch (error) {
      console.error(error);
    }
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
        audio={audio}
        pdf={pdf}
        onAnalyze={(content, contentType, image, video, audio, pdf) => handleAnalyze(content, contentType, image, video, audio, pdf)}
        onContentTypeChange={(contentType) => setContentType(contentType)}
        onImageChange={(image) => setImage(image)}
        onVideoChange={(video) => setVideo(video)}
        onAudioChange={(audio) => setAudio(audio)}
        onPdfChange={(pdf) => setPdf(pdf)}
      />
      {analysis && (
        <OptimizationSuggestions suggestions={suggestions} />
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