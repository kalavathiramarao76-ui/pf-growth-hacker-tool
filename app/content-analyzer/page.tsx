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
import { LanguageModel } from 'langchain';
import { HuggingFaceHub } from 'huggingface-hub';
import { Transformers } from 'transformers';

import { pipeline } from 'transformers';

const calculateReadabilityScore = (text: string, language: string) => {
  let readabilityScore;
  const words = text.split(' ');
  const sentences = text.split('.').filter((sentence) => sentence !== '');
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);
  const complexityScore = calculateComplexityScore(text, language);
  const sentenceLength = words.length / sentences.length;
  const wordLength = syllables / words.length;

  switch (language) {
    case 'en':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength;
      break;
    case 'es':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength;
      break;
    case 'fr':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength;
      break;
    case 'de':
      readabilityScore = 180.0 - 58.5 * sentenceLength - 1.015 * wordLength;
      break;
    case 'it':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.8;
      break;
    case 'pt':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.9;
      break;
    case 'zh':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.7;
      break;
    default:
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength;
      break;
  }
  return readabilityScore;
};

const calculateFleschKincaidGradeLevel = (text: string, language: string) => {
  const words = text.split(' ');
  const sentences = text.split('.').filter((sentence) => sentence !== '');
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);
  const sentenceLength = words.length / sentences.length;
  const wordLength = syllables / words.length;

  let fleschKincaidGradeLevel;
  switch (language) {
    case 'en':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.11 * wordLength + 0.58;
      break;
    case 'es':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.11 * wordLength + 0.58;
      break;
    case 'fr':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.11 * wordLength + 0.58;
      break;
    case 'de':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.11 * wordLength + 0.58;
      break;
    case 'it':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.11 * wordLength + 0.58;
      break;
    case 'pt':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.11 * wordLength + 0.58;
      break;
    case 'zh':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.11 * wordLength + 0.58;
      break;
    default:
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.11 * wordLength + 0.58;
      break;
  }
  return fleschKincaidGradeLevel;
};

const calculateGunningFogIndex = (text: string, language: string) => {
  const words = text.split(' ');
  const sentences = text.split('.').filter((sentence) => sentence !== '');
  const complexWords = words.filter((word) => countSyllables(word) >= 3);
  const percentageComplexWords = (complexWords.length / words.length) * 100;
  const averageSentenceLength = words.length / sentences.length;

  let gunningFogIndex;
  switch (language) {
    case 'en':
      gunningFogIndex = 0.4 * (averageSentenceLength + percentageComplexWords);
      break;
    case 'es':
      gunningFogIndex = 0.4 * (averageSentenceLength + percentageComplexWords);
      break;
    case 'fr':
      gunningFogIndex = 0.4 * (averageSentenceLength + percentageComplexWords);
      break;
    case 'de':
      gunningFogIndex = 0.4 * (averageSentenceLength + percentageComplexWords);
      break;
    case 'it':
      gunningFogIndex = 0.4 * (averageSentenceLength + percentageComplexWords);
      break;
    case 'pt':
      gunningFogIndex = 0.4 * (averageSentenceLength + percentageComplexWords);
      break;
    case 'zh':
      gunningFogIndex = 0.4 * (averageSentenceLength + percentageComplexWords);
      break;
    default:
      gunningFogIndex = 0.4 * (averageSentenceLength + percentageComplexWords);
      break;
  }
  return gunningFogIndex;
};

const countSyllables = (word: string) => {
  word = word.toLowerCase();
  const vowels = 'aeiouy';
  let syllableCount = 0;
  let prevVowel = false;

  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      if (!prevVowel) {
        syllableCount++;
      }
      prevVowel = true;
    } else {
      prevVowel = false;
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

const calculateComplexityScore = (text: string, language: string) => {
  const words = text.split(' ');
  const complexWords = words.filter((word) => countSyllables(word) >= 3);
  const percentageComplexWords = (complexWords.length / words.length) * 100;
  return percentageComplexWords;
};

const performSentimentAnalysisWithHuggingFace = async (text: string) => {
  const pipeline = await pipeline('sentiment-analysis');
  const result = await pipeline(text);
  return result;
};

const performEntityRecognitionWithSpacy = async (text: string) => {
  const nlp = await spacy.load('en_core_web_sm');
  const doc = nlp(text);
  const entities = doc.ents;
  return entities;
};

const performTopicModeling = async (text: string) => {
  const nlp = new NlpManager({ languages: ['en'] });
  const result = await nlp.process('en', text);
  return result;
};

const suggestAlternativeFormats = (readabilityScore: number, sentimentAnalysis: any) => {
  const suggestions = [];
  if (readabilityScore < 60) {
    suggestions.push('Consider rewriting the text to make it more readable.');
  }
  if (sentimentAnalysis.score < 0.5) {
    suggestions.push('Consider rewriting the text to make it more positive.');
  }
  return suggestions;
};

const advancedContentAnalysis = async (analysis: any) => {
  const advancedAnalysis = {
    ...analysis,
    readabilityScore: calculateReadabilityScore(analysis.text, analysis.language),
    fleschKincaidGradeLevel: calculateFleschKincaidGradeLevel(analysis.text, analysis.language),
    gunningFogIndex: calculateGunningFogIndex(analysis.text, analysis.language),
    sentimentAnalysis: await performSentimentAnalysisWithHuggingFace(analysis.text),
    entityRecognition: await performEntityRecognitionWithSpacy(analysis.text),
    topicModeling: await performTopicModeling(analysis.text),
    suggestedAlternativeFormats: suggestAlternativeFormats(analysis.readabilityScore, analysis.sentimentAnalysis),
  };
  return advancedAnalysis;
};

const Page = () => {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (text: string, language: string) => {
    setLoading(true);
    const result = await advancedContentAnalysis({ text, language });
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div>
      <SEO title="AI-Powered Content Optimizer" />
      <PageHeader title="AI-Powered Content Optimizer" />
      <ContentAnalyzerForm onAnalyze={handleAnalyze} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <OptimizationSuggestions analysis={analysis} />
          <EngagementTracker analysis={analysis} />
          <AlternativeFormats analysis={analysis} />
        </div>
      )}
    </div>
  );
};

export default Page;