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
    fleschKincaidGradeLevel: calculateFleschKincaidGradeLevel(analysis.text),
    gunningFogIndex: calculateGunningFogIndex(analysis.text),
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

const calculateFleschKincaidGradeLevel = (text: string) => {
  const words = text.split(' ');
  const sentences = text.split('.').filter((sentence) => sentence !== '');
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);
  const fleschKincaidGradeLevel = 0.39 * (words.length / sentences.length) + 0.11 * (syllables / words.length) + 0.58;
  return fleschKincaidGradeLevel;
};

const calculateGunningFogIndex = (text: string) => {
  const words = text.split(' ');
  const sentences = text.split('.').filter((sentence) => sentence !== '');
  const complexWords = words.filter((word) => countSyllables(word) >= 3);
  const gunningFogIndex = 0.4 * ((words.length / sentences.length) + (complexWords.length / words.length));
  return gunningFogIndex;
};

const countSyllables = (word: string) => {
  word = word.toLowerCase();
  const vowels = 'aeiouy';
  let syllableCount = 0;
  let lastCharWasVowel = false;
  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      if (!lastCharWasVowel) {
        syllableCount++;
      }
      lastCharWasVowel = true;
    } else {
      lastCharWasVowel = false;
    }
  }
  if (word.endsWith('e')) {
    syllableCount--;
  }
  if (syllableCount === 0) {
    syllableCount = 1;
  }
  return syllableCount;
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

  return (
    <div>
      <SEO title="Content Analyzer" />
      <PageHeader title="Content Analyzer" />
      <ContentAnalyzerForm
        content={content}
        contentType={contentType}
        onContentChange={(newContent) => setContent(newContent)}
        onContentTypeChange={(newContentType) => setContentType(newContentType)}
        onAnalyze={(text) => advancedContentAnalysis({ text }).then((analysis) => setAnalysis(analysis))}
      />
      {analysis && (
        <div>
          <h2>Analysis Results</h2>
          <p>Readability Score: {analysis.readabilityScore}</p>
          <p>Flesch-Kincaid Grade Level: {analysis.fleschKincaidGradeLevel}</p>
          <p>Gunning-Fog Index: {analysis.gunningFogIndex}</p>
          <p>Sentiment Analysis: {JSON.stringify(analysis.sentimentAnalysis)}</p>
          <p>Entity Recognition: {JSON.stringify(analysis.entityRecognition)}</p>
          <p>Topic Modeling: {JSON.stringify(analysis.topicModeling)}</p>
        </div>
      )}
      {suggestions && (
        <OptimizationSuggestions suggestions={suggestions} />
      )}
      {engagement && (
        <EngagementTracker engagement={engagement} />
      )}
      {alternativeFormats && (
        <AlternativeFormats alternativeFormats={alternativeFormats} />
      )}
    </div>
  );
};

export default ContentAnalyzerPage;