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

  // Apply complexity adjustment
  const complexityAdjustment = calculateComplexityAdjustment(complexityScore);
  readabilityScore *= complexityAdjustment;

  return readabilityScore;
};

const calculateComplexityScore = (text: string, language: string) => {
  const words = text.split(' ');
  const sentences = text.split('.').filter((sentence) => sentence !== '');
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);
  const sentenceLength = words.length / sentences.length;
  const wordLength = syllables / words.length;

  let complexityScore;
  switch (language) {
    case 'en':
      complexityScore = 0.5 * sentenceLength + 0.3 * wordLength;
      break;
    case 'es':
      complexityScore = 0.6 * sentenceLength + 0.2 * wordLength;
      break;
    case 'fr':
      complexityScore = 0.7 * sentenceLength + 0.1 * wordLength;
      break;
    default:
      complexityScore = 0;
      break;
  }

  return complexityScore;
};

const calculateComplexityAdjustment = (complexityScore: number) => {
  if (complexityScore < 0.5) {
    return 1.1; // Simple text, increase readability score
  } else if (complexityScore < 0.8) {
    return 1.0; // Average text, no adjustment
  } else {
    return 0.9; // Complex text, decrease readability score
  }
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
      fleschKincaidGradeLevel = 0.42 * sentenceLength + 0.09 * wordLength + 0.55;
      break;
    case 'fr':
      fleschKincaidGradeLevel = 0.45 * sentenceLength + 0.07 * wordLength + 0.52;
      break;
    default:
      fleschKincaidGradeLevel = 0;
      break;
  }

  return fleschKincaidGradeLevel;
};

const calculateGunningFogIndex = (text: string, language: string) => {
  const words = text.split(' ');
  const sentences = text.split('.').filter((sentence) => sentence !== '');
  const complexWords = words.filter((word) => countSyllables(word) > 2);
  const percentageComplexWords = complexWords.length / words.length;

  let gunningFogIndex;
  switch (language) {
    case 'en':
      gunningFogIndex = 0.4 * (words.length / sentences.length + percentageComplexWords);
      break;
    case 'es':
      gunningFogIndex = 0.42 * (words.length / sentences.length + percentageComplexWords);
      break;
    case 'fr':
      gunningFogIndex = 0.45 * (words.length / sentences.length + percentageComplexWords);
      break;
    default:
      gunningFogIndex = 0;
      break;
  }

  return gunningFogIndex;
};

const countSyllables = (word: string) => {
  word = word.toLowerCase();
  const vowels = 'aeiouy';
  let syllableCount = 0;
  let prevCharWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      if (!prevCharWasVowel) {
        syllableCount++;
      }
      prevCharWasVowel = true;
    } else {
      prevCharWasVowel = false;
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
  const alternativeFormats = [];

  if (readabilityScore < 60) {
    alternativeFormats.push('Simplify the text to improve readability');
  }

  if (sentimentAnalysis.score < 0.5) {
    alternativeFormats.push('Use a more positive tone to improve engagement');
  }

  return alternativeFormats;
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

  const handleAnalyzeClick = async () => {
    const result = await advancedContentAnalysis({ text, language });
    setAnalysis(result);
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
        onAnalyzeClick={handleAnalyzeClick}
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