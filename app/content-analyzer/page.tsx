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
  };
  return advancedAnalysis;
};

const calculateReadabilityScore = (text: string, language: string) => {
  let readabilityScore;
  const words = text.split(' ');
  const sentences = text.split('.').filter((sentence) => sentence !== '');
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);

  switch (language) {
    case 'en':
      readabilityScore = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (sentences.length / words.length);
      break;
    case 'es':
      readabilityScore = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (sentences.length / words.length);
      break;
    case 'fr':
      readabilityScore = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (sentences.length / words.length);
      break;
    default:
      readabilityScore = 0;
      break;
  }

  // Apply language-specific adjustments
  switch (language) {
    case 'en':
      readabilityScore *= 1.0; // English
      break;
    case 'es':
      readabilityScore *= 0.95; // Spanish
      break;
    case 'fr':
      readabilityScore *= 0.9; // French
      break;
    default:
      readabilityScore *= 1.0; // Default adjustment
      break;
  }

  // Apply syllable-based adjustment
  readabilityScore += (syllables / words.length) * 0.1;

  return readabilityScore;
};

const calculateFleschKincaidGradeLevel = (text: string, language: string) => {
  let fleschKincaidGradeLevel;
  const words = text.split(' ');
  const sentences = text.split('.').filter((sentence) => sentence !== '');
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);

  switch (language) {
    case 'en':
      fleschKincaidGradeLevel = 0.39 * (words.length / sentences.length) + 0.11 * (syllables / words.length) + 0.58;
      break;
    case 'es':
      fleschKincaidGradeLevel = 0.39 * (words.length / sentences.length) + 0.11 * (syllables / words.length) + 0.58;
      break;
    case 'fr':
      fleschKincaidGradeLevel = 0.39 * (words.length / sentences.length) + 0.11 * (syllables / words.length) + 0.58;
      break;
    default:
      fleschKincaidGradeLevel = 0;
      break;
  }

  // Apply language-specific adjustments
  switch (language) {
    case 'en':
      fleschKincaidGradeLevel *= 1.0; // English
      break;
    case 'es':
      fleschKincaidGradeLevel *= 0.95; // Spanish
      break;
    case 'fr':
      fleschKincaidGradeLevel *= 0.9; // French
      break;
    default:
      fleschKincaidGradeLevel *= 1.0; // Default adjustment
      break;
  }

  return fleschKincaidGradeLevel;
};

const calculateGunningFogIndex = (text: string, language: string) => {
  let gunningFogIndex;
  const words = text.split(' ');
  const sentences = text.split('.').filter((sentence) => sentence !== '');
  const complexWords = words.filter((word) => countSyllables(word) >= 3);

  switch (language) {
    case 'en':
      gunningFogIndex = 0.4 * ((words.length / sentences.length) + (complexWords.length / words.length));
      break;
    case 'es':
      gunningFogIndex = 0.4 * ((words.length / sentences.length) + (complexWords.length / words.length));
      break;
    case 'fr':
      gunningFogIndex = 0.4 * ((words.length / sentences.length) + (complexWords.length / words.length));
      break;
    default:
      gunningFogIndex = 0;
      break;
  }

  // Apply language-specific adjustments
  switch (language) {
    case 'en':
      gunningFogIndex *= 1.0; // English
      break;
    case 'es':
      gunningFogIndex *= 0.95; // Spanish
      break;
    case 'fr':
      gunningFogIndex *= 0.9; // French
      break;
    default:
      gunningFogIndex *= 1.0; // Default adjustment
      break;
  }

  return gunningFogIndex;
};

const countSyllables = (word: string) => {
  word = word.toLowerCase();
  const vowels = 'aeiouy';
  let count = 0;
  let prevVowel = false;

  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      if (!prevVowel) {
        count++;
      }
      prevVowel = true;
    } else {
      prevVowel = false;
    }
  }

  if (word.endsWith('e')) {
    count--;
  }

  if (count === 0) {
    count = 1;
  }

  return count;
};

const performSentimentAnalysisWithHuggingFace = async (text: string) => {
  const pipeline = await transformers.pipeline('sentiment-analysis');
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
  const topics = doc.vector;
  return topics;
};

export default function ContentAnalyzerPage() {
  const [analysis, setAnalysis] = useState<any>({});
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const router = useRouter();

  const handleTextChange = (event: any) => {
    setText(event.target.value);
  };

  const handleLanguageChange = (event: any) => {
    setLanguage(event.target.value);
  };

  const handleAnalyze = async () => {
    const analysisResult = await advancedContentAnalysis({ text, language });
    setAnalysis(analysisResult);
  };

  return (
    <div>
      <SEO title="Content Analyzer" />
      <PageHeader title="Content Analyzer" />
      <ContentAnalyzerForm
        text={text}
        language={language}
        onTextChange={handleTextChange}
        onLanguageChange={handleLanguageChange}
        onAnalyze={handleAnalyze}
      />
      {analysis && (
        <div>
          <OptimizationSuggestions analysis={analysis} />
          <EngagementTracker analysis={analysis} />
          <AlternativeFormats analysis={analysis} />
        </div>
      )}
    </div>
  );
}