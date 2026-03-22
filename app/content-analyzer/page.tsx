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
  const [podcast, setPodcast] = useState(null);
  const [socialMediaPost, setSocialMediaPost] = useState(null);
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

  useEffect(() => {
    if (content) {
      const analyzeContent = async () => {
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
          if (podcast) {
            formData.append('podcast', podcast);
          }
          if (socialMediaPost) {
            formData.append('socialMediaPost', socialMediaPost);
          }
          const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          setRealTimeAnalysis(data.analysis);
        } catch (error) {
          console.error(error);
        }
      };
      analyzeContent();
    }
  }, [content, contentType, image, video, audio, pdf, podcast, socialMediaPost]);

  const handleAnalyze = async (content: string, contentType: string, image: any, video: any, audio: any, pdf: any, podcast: any, socialMediaPost: any) => {
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
      if (podcast) {
        formData.append('podcast', podcast);
      }
      if (socialMediaPost) {
        formData.append('socialMediaPost', socialMediaPost);
      }
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAnalysis(data.analysis);
      setSuggestions(data.suggestions);
      setEngagement(data.engagement);
      setAlternativeFormats(data.alternativeFormats);
    } catch (error) {
      console.error(error);
    }
  };

  const handleContentTypeChange = (event: any) => {
    setContentType(event.target.value);
  };

  const handleImageChange = (event: any) => {
    setImage(event.target.files[0]);
  };

  const handleVideoChange = (event: any) => {
    setVideo(event.target.files[0]);
  };

  const handleAudioChange = (event: any) => {
    setAudio(event.target.files[0]);
  };

  const handlePdfChange = (event: any) => {
    setPdf(event.target.files[0]);
  };

  const handlePodcastChange = (event: any) => {
    setPodcast(event.target.files[0]);
  };

  const handleSocialMediaPostChange = (event: any) => {
    setSocialMediaPost(event.target.value);
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
        audio={audio}
        pdf={pdf}
        podcast={podcast}
        socialMediaPost={socialMediaPost}
        onAnalyze={handleAnalyze}
        onContentTypeChange={handleContentTypeChange}
        onImageChange={handleImageChange}
        onVideoChange={handleVideoChange}
        onAudioChange={handleAudioChange}
        onPdfChange={handlePdfChange}
        onPodcastChange={handlePodcastChange}
        onSocialMediaPostChange={handleSocialMediaPostChange}
      />
      {analysis && <OptimizationSuggestions suggestions={analysis.suggestions} />}
      {engagement && <EngagementTracker engagement={engagement} />}
      {alternativeFormats && <AlternativeFormats formats={alternativeFormats} />}
    </div>
  );
};

export default ContentAnalyzerPage;