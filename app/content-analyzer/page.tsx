import client from '../client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '../utils/local-storage';
import { SEO } from '../components/seo';
import { PageHeader } from '../components/page-header';
import { ContentAnalyzerForm } from '../components/content-analyzer-form';
import { OptimizationSuggestions } from '../components/optimization-suggestions';
import { EngagementTracker } from '../components/engagement-tracker';
import { AlternativeFormats } from '../components/alternative-formats';
import * as natural from 'natural';
import { v1 as uuidv1 } from 'uuid';
import axios from 'axios';
import { spaCy } from '@spacyjs/spacy';
import * as tf from '@tensorflow/tfjs';
import { NlpManager } from 'node-nlp';
import * as spacy from 'spacy';

const advancedContentAnalysis = async (analysis: any) => {
  const advancedAnalysis = {
    ...analysis,
    readabilityScore: calculateReadabilityScore(analysis.text),
    fleschKincaidGradeLevel: calculateFleschKincaidGradeLevel(analysis.text),
    gunningFogIndex: calculateGunningFogIndex(analysis.text),
    sentimentAnalysis: await performSentimentAnalysisWithSpacy(analysis.text),
    entityRecognition: await performEntityRecognitionWithSpacy(analysis.text),
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

const getAISuggestions = async (text: string) => {
  const response = await axios.post('/api/ai-suggestions', { text });
  return response.data;
};

const Page = () => {
  const router = useRouter();
  const [analysis, setAnalysis] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const storedAnalysis = LocalStorage.get('analysis');
    if (storedAnalysis) {
      setAnalysis(storedAnalysis);
    }
  }, []);

  const handleTextChange = (text: string) => {
    setText(text);
  };

  const handleAnalyze = async () => {
    const advancedAnalysis = await advancedContentAnalysis({ text });
    setAnalysis(advancedAnalysis);
    LocalStorage.set('analysis', advancedAnalysis);
    const suggestions = await getAISuggestions(text);
    setAiSuggestions(suggestions);
  };

  return (
    <div>
      <SEO title="Content Analyzer" />
      <PageHeader title="Content Analyzer" />
      <ContentAnalyzerForm
        text={text}
        onTextChange={handleTextChange}
        onAnalyze={handleAnalyze}
      />
      {analysis.text && (
        <div>
          <OptimizationSuggestions analysis={analysis} aiSuggestions={aiSuggestions} />
          <EngagementTracker analysis={analysis} />
          <AlternativeFormats analysis={analysis} />
        </div>
      )}
    </div>
  );
};

export default Page;