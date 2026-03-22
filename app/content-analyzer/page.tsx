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

const advancedContentAnalysis = async (analysis: any) => {
  const advancedAnalysis = {
    ...analysis,
    readabilityScore: calculateReadabilityScore(analysis.text),
    sentimentAnalysis: await performSentimentAnalysis(analysis.text),
    entityRecognition: await performEntityRecognition(analysis.text),
    topicModeling: await performTopicModeling(analysis.text),
  };
  return advancedAnalysis;
};

const calculateReadabilityScore = (text: string) => {
  const words = text.split(' ');
  const sentences = text.split('.').filter((sentence) => sentence !== '');
  const readabilityScore = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (sentences.length / words.length);
  return readabilityScore;
};

const performSentimentAnalysis = async (text: string) => {
  const response = await fetch('/api/sentiment-analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const sentimentAnalysis = await response.json();
  return sentimentAnalysis;
};

const performEntityRecognition = async (text: string) => {
  const response = await fetch('/api/entity-recognition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const entityRecognition = await response.json();
  return entityRecognition;
};

const performTopicModeling = async (text: string) => {
  const response = await fetch('/api/topic-modeling', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const topicModeling = await response.json();
  return topicModeling;
};

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
          const advancedAnalysis = await advancedContentAnalysis(data.analysis);
          setRealTimeAnalysis(advancedAnalysis);
          setAnalysis(data.analysis);
          setSuggestions(data.suggestions);
        } catch (error) {
          console.error(error);
        }
      };
      analyzeContent();
    }
  }, [content, contentType, image, video, audio, pdf, podcast, socialMediaPost]);

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
        onChangeContent={(newContent) => setContent(newContent)}
        onChangeContentType={(newContentType) => setContentType(newContentType)}
        onChangeImage={(newImage) => setImage(newImage)}
        onChangeVideo={(newVideo) => setVideo(newVideo)}
        onChangeAudio={(newAudio) => setAudio(newAudio)}
        onChangePdf={(newPdf) => setPdf(newPdf)}
        onChangePodcast={(newPodcast) => setPodcast(newPodcast)}
        onChangeSocialMediaPost={(newSocialMediaPost) => setSocialMediaPost(newSocialMediaPost)}
      />
      {analysis && (
        <OptimizationSuggestions suggestions={suggestions} analysis={analysis} />
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