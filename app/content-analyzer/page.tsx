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
  switch (language) {
    case 'en':
      const words = text.split(' ');
      const sentences = text.split('.').filter((sentence) => sentence !== '');
      readabilityScore = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (sentences.length / words.length);
      break;
    case 'es':
      const wordsEs = text.split(' ');
      const sentencesEs = text.split('.').filter((sentence) => sentence !== '');
      readabilityScore = 206.835 - 1.015 * (wordsEs.length / sentencesEs.length) - 84.6 * (sentencesEs.length / wordsEs.length);
      break;
    case 'fr':
      const wordsFr = text.split(' ');
      const sentencesFr = text.split('.').filter((sentence) => sentence !== '');
      readabilityScore = 206.835 - 1.015 * (wordsFr.length / sentencesFr.length) - 84.6 * (sentencesFr.length / wordsFr.length);
      break;
    default:
      readabilityScore = 0;
      break;
  }
  return readabilityScore;
};

const calculateFleschKincaidGradeLevel = (text: string, language: string) => {
  let fleschKincaidGradeLevel;
  switch (language) {
    case 'en':
      const words = text.split(' ');
      const sentences = text.split('.').filter((sentence) => sentence !== '');
      const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);
      fleschKincaidGradeLevel = 0.39 * (words.length / sentences.length) + 0.11 * (syllables / words.length) + 0.58;
      break;
    case 'es':
      const wordsEs = text.split(' ');
      const sentencesEs = text.split('.').filter((sentence) => sentence !== '');
      const syllablesEs = wordsEs.reduce((acc, word) => acc + countSyllablesEs(word), 0);
      fleschKincaidGradeLevel = 0.39 * (wordsEs.length / sentencesEs.length) + 0.11 * (syllablesEs / wordsEs.length) + 0.58;
      break;
    case 'fr':
      const wordsFr = text.split(' ');
      const sentencesFr = text.split('.').filter((sentence) => sentence !== '');
      const syllablesFr = wordsFr.reduce((acc, word) => acc + countSyllablesFr(word), 0);
      fleschKincaidGradeLevel = 0.39 * (wordsFr.length / sentencesFr.length) + 0.11 * (syllablesFr / wordsFr.length) + 0.58;
      break;
    default:
      fleschKincaidGradeLevel = 0;
      break;
  }
  return fleschKincaidGradeLevel;
};

const calculateGunningFogIndex = (text: string, language: string) => {
  let gunningFogIndex;
  switch (language) {
    case 'en':
      const words = text.split(' ');
      const sentences = text.split('.').filter((sentence) => sentence !== '');
      const complexWords = words.filter((word) => countSyllables(word) >= 3);
      gunningFogIndex = 0.4 * ((words.length / sentences.length) + (complexWords.length / words.length));
      break;
    case 'es':
      const wordsEs = text.split(' ');
      const sentencesEs = text.split('.').filter((sentence) => sentence !== '');
      const complexWordsEs = wordsEs.filter((word) => countSyllablesEs(word) >= 3);
      gunningFogIndex = 0.4 * ((wordsEs.length / sentencesEs.length) + (complexWordsEs.length / wordsEs.length));
      break;
    case 'fr':
      const wordsFr = text.split(' ');
      const sentencesFr = text.split('.').filter((sentence) => sentence !== '');
      const complexWordsFr = wordsFr.filter((word) => countSyllablesFr(word) >= 3);
      gunningFogIndex = 0.4 * ((wordsFr.length / sentencesFr.length) + (complexWordsFr.length / wordsFr.length));
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
    syllableCount++;
  }
  return syllableCount;
};

const countSyllablesEs = (word: string) => {
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
  if (word.endsWith('a') || word.endsWith('o') || word.endsWith('i') || word.endsWith('u')) {
    syllableCount++;
  }
  if (syllableCount === 0) {
    syllableCount++;
  }
  return syllableCount;
};

const countSyllablesFr = (word: string) => {
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
  if (word.endsWith('a') || word.endsWith('o') || word.endsWith('i') || word.endsWith('u')) {
    syllableCount++;
  }
  if (syllableCount === 0) {
    syllableCount++;
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
  const nlp = await spacy.load('en_core_web_sm');
  const doc = nlp(text);
  const topics = doc.vector;
  return topics;
};