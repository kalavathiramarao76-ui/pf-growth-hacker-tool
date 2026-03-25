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
    case 'nl':
      readabilityScore = 180.0 - 58.5 * sentenceLength - 1.015 * wordLength;
      break;
    case 'ru':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.85;
      break;
    case 'ar':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.9;
      break;
    case 'he':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.8;
      break;
    case 'hi':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.7;
      break;
    case 'ja':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.6;
      break;
    case 'ko':
      readabilityScore = 206.835 - 1.015 * sentenceLength - 84.6 * wordLength * 0.65;
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
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58;
      break;
    case 'fr':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58;
      break;
    case 'de':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58;
      break;
    case 'it':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58 * 0.8;
      break;
    case 'pt':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58 * 0.9;
      break;
    case 'zh':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58 * 0.7;
      break;
    case 'nl':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58;
      break;
    case 'ru':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58 * 0.85;
      break;
    case 'ar':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58 * 0.9;
      break;
    case 'he':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58 * 0.8;
      break;
    case 'hi':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58 * 0.7;
      break;
    case 'ja':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58 * 0.6;
      break;
    case 'ko':
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.1 * wordLength + 0.58 * 0.65;
      break;
    default:
      fleschKincaidGradeLevel = 0.39 * sentenceLength + 0.11 * wordLength + 0.58;
      break;
  }
  return fleschKincaidGradeLevel;
};