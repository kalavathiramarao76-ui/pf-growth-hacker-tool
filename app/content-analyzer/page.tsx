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
  const model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/sentiment_analysis/model.json');
  const tensor = tf.tensor2d([text.split(' ').map((word) => word.charCodeAt(0))]);
  const prediction = await model.predict(tensor);
  const sentiment = prediction.dataSync()[0] > 0.5 ? 'Positive' : 'Negative';
  return sentiment;
};

const performEntityRecognition = async (text: string) => {
  const entities = await spaCy.load('en_core_web_sm').then((nlp) => nlp(text));
  return entities;
};

const performTopicModeling = async (text: string) => {
  const topics = await axios.post('https://api.example.com/topic-modeling', { text });
  return topics.data;
};

const Page = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async (text: string) => {
    setLoading(true);
    const analysis = await advancedContentAnalysis({ text });
    setAnalysis(analysis);
    setLoading(false);
  };

  return (
    <div>
      <SEO title="Content Analyzer" />
      <PageHeader title="Content Analyzer" />
      <ContentAnalyzerForm onAnalyze={handleAnalyze} />
      {analysis && (
        <div>
          <OptimizationSuggestions analysis={analysis} />
          <EngagementTracker analysis={analysis} />
          <AlternativeFormats analysis={analysis} />
        </div>
      )}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Page;