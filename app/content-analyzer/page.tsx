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
    case 'nl':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.85;
      break;
    case 'ru':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.75;
      break;
    case 'ar':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.65;
      break;
    case 'he':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.6;
      break;
    case 'hi':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.55;
      break;
    case 'ja':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.5;
      break;
    case 'ko':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.45;
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
  const complexWords = words.filter((word) => countSyllables(word) > 2);
  const sentenceLength = words.length / sentences.length;
  const complexWordPercentage = complexWords.length / words.length;

  let gunningFogIndex;
  switch (language) {
    case 'en':
      gunningFogIndex = 0.4 * (sentenceLength + complexWordPercentage);
      break;
    case 'es':
      gunningFogIndex = 0.4 * (sentenceLength + complexWordPercentage);
      break;
    case 'fr':
      gunningFogIndex = 0.4 * (sentenceLength + complexWordPercentage);
      break;
    case 'de':
      gunningFogIndex = 0.4 * (sentenceLength + complexWordPercentage);
      break;
    case 'it':
      gunningFogIndex = 0.4 * (sentenceLength + complexWordPercentage);
      break;
    case 'pt':
      gunningFogIndex = 0.4 * (sentenceLength + complexWordPercentage);
      break;
    case 'zh':
      gunningFogIndex = 0.4 * (sentenceLength + complexWordPercentage);
      break;
    default:
      gunningFogIndex = 0.4 * (sentenceLength + complexWordPercentage);
      break;
  }
  return gunningFogIndex;
};

const countSyllables = (word: string) => {
  const vowels = 'aeiouy';
  let syllableCount = 0;
  let isVowel = false;

  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i].toLowerCase())) {
      if (!isVowel) {
        syllableCount++;
        isVowel = true;
      }
    } else {
      isVowel = false;
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
  const complexWords = words.filter((word) => countSyllables(word) > 2);
  const complexWordPercentage = complexWords.length / words.length;

  let complexityScore;
  switch (language) {
    case 'en':
      complexityScore = complexWordPercentage * 100;
      break;
    case 'es':
      complexityScore = complexWordPercentage * 100;
      break;
    case 'fr':
      complexityScore = complexWordPercentage * 100;
      break;
    case 'de':
      complexityScore = complexWordPercentage * 100;
      break;
    case 'it':
      complexityScore = complexWordPercentage * 100;
      break;
    case 'pt':
      complexityScore = complexWordPercentage * 100;
      break;
    case 'zh':
      complexityScore = complexWordPercentage * 100;
      break;
    default:
      complexityScore = complexWordPercentage * 100;
      break;
  }
  return complexityScore;
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
  const nlp = await spacy.load('en_core_web_sm');
  const doc = nlp(text);
  const topics = doc.cats;
  return topics;
};

const suggestAlternativeFormats = (readabilityScore: number, sentimentAnalysis: any) => {
  const suggestions = [];

  if (readabilityScore > 70) {
    suggestions.push('Simplify the language to improve readability');
  }

  if (sentimentAnalysis.score < 0.5) {
    suggestions.push('Improve the tone to make it more positive');
  }

  return suggestions;
};

export default function ContentAnalyzerPage() {
  const [analysis, setAnalysis] = useState(null);
  const router = useRouter();

  const handleAnalyze = async (text: string, language: string) => {
    const result = await advancedContentAnalysis({ text, language });
    setAnalysis(result);
  };

  return (
    <div>
      <SEO title="Content Analyzer" />
      <PageHeader title="Content Analyzer" />
      <ContentAnalyzerForm onAnalyze={handleAnalyze} />
      {analysis && (
        <div>
          <OptimizationSuggestions suggestions={analysis.suggestedAlternativeFormats} />
          <EngagementTracker readabilityScore={analysis.readabilityScore} sentimentAnalysis={analysis.sentimentAnalysis} />
          <AlternativeFormats formats={analysis.suggestedAlternativeFormats} />
        </div>
      )}
    </div>
  );
}