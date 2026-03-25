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

const calculateReadabilityScore = async (text: string) => {
  const readabilityPipeline = pipeline('text-classification', model='distilbert-base-uncased-finetuned-sst-2-english')
  const result = await readabilityPipeline(text)
  const readabilityScore = result.score

  // Using a more advanced readability score calculation using a language model
  const complexityScore = await calculateComplexityScore(text)
  const cohesionScore = await calculateCohesionScore(text)
  const clarityScore = await calculateClarityScore(text)
  const sentenceLengthScore = await calculateSentenceLengthScore(text)
  const wordLengthScore = await calculateWordLengthScore(text)
  const syllableCountScore = await calculateSyllableCountScore(text)

  // Combine the readability score, complexity score, cohesion score, clarity score, sentence length score, word length score, and syllable count score
  const combinedScore = (readabilityScore + complexityScore + cohesionScore + clarityScore + sentenceLengthScore + wordLengthScore + syllableCountScore) / 7

  return combinedScore
}

const countSyllables = (word: string) => {
  word = word.toLowerCase();
  const vowels = 'aeiouy';
  let count = 0;
  let prev = false;

  for (let i = 0; i < word.length; i++) {
    if (vowels.indexOf(word[i]) !== -1) {
      if (!prev) {
        count++;
      }
      prev = true;
    } else {
      prev = false;
    }
  }

  if (word.endsWith('e')) {
    count--;
  }

  if (count === 0) {
    count = 1;
  }

  return count
}

const calculateComplexityScore = async (text: string) => {
  const complexityPipeline = pipeline('question-answering', model='distilbert-base-uncased-distilled-squad')
  const result = await complexityPipeline({ question: 'What is the complexity of the text?', context: text })
  const complexityScore = result.score

  return complexityScore
}

const calculateCohesionScore = async (text: string) => {
  const cohesionPipeline = pipeline('text-classification', model='bert-base-uncased')
  const result = await cohesionPipeline(text)
  const cohesionScore = result.score

  return cohesionScore
}

const calculateClarityScore = async (text: string) => {
  const clarityPipeline = pipeline('text-classification', model='roberta-base')
  const result = await clarityPipeline(text)
  const clarityScore = result.score

  return clarityScore
}

const calculateSentenceLengthScore = async (text: string) => {
  const sentences = text.split('.').filter(sentence => sentence.trim() !== '');
  const averageSentenceLength = sentences.reduce((acc, sentence) => acc + sentence.split(' ').length, 0) / sentences.length;
  const sentenceLengthScore = 1 - (averageSentenceLength / 20);

  return sentenceLengthScore
}

const calculateWordLengthScore = async (text: string) => {
  const words = text.split(' ');
  const averageWordLength = words.reduce((acc, word) => acc + word.length, 0) / words.length;
  const wordLengthScore = 1 - (averageWordLength / 10);

  return wordLengthScore
}

const calculateSyllableCountScore = async (text: string) => {
  const words = text.split(' ');
  const totalSyllableCount = words.reduce((acc, word) => acc + countSyllables(word), 0);
  const averageSyllableCount = totalSyllableCount / words.length;
  const syllableCountScore = 1 - (averageSyllableCount / 2);

  return syllableCountScore
}

const ContentAnalyzerPage = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [complexityScore, setComplexityScore] = useState(0);
  const [cohesionScore, setCohesionScore] = useState(0);
  const [clarityScore, setClarityScore] = useState(0);
  const [sentenceLengthScore, setSentenceLengthScore] = useState(0);
  const [wordLengthScore, setWordLengthScore] = useState(0);
  const [syllableCountScore, setSyllableCountScore] = useState(0);

  useEffect(() => {
    const storedText = LocalStorage.getItem('text');
    if (storedText) {
      setText(storedText);
    }
  }, []);

  const handleTextChange = (event: any) => {
    setText(event.target.value);
    LocalStorage.setItem('text', event.target.value);
  };

  const handleAnalyze = async () => {
    const readabilityScoreResult = await calculateReadabilityScore(text);
    setReadabilityScore(readabilityScoreResult);
    const complexityScoreResult = await calculateComplexityScore(text);
    setComplexityScore(complexityScoreResult);
    const cohesionScoreResult = await calculateCohesionScore(text);
    setCohesionScore(cohesionScoreResult);
    const clarityScoreResult = await calculateClarityScore(text);
    setClarityScore(clarityScoreResult);
    const sentenceLengthScoreResult = await calculateSentenceLengthScore(text);
    setSentenceLengthScore(sentenceLengthScoreResult);
    const wordLengthScoreResult = await calculateWordLengthScore(text);
    setWordLengthScore(wordLengthScoreResult);
    const syllableCountScoreResult = await calculateSyllableCountScore(text);
    setSyllableCountScore(syllableCountScoreResult);
  };

  return (
    <div>
      <SEO title="Content Analyzer" />
      <PageHeader title="Content Analyzer" />
      <ContentAnalyzerForm text={text} onChange={handleTextChange} onAnalyze={handleAnalyze} />
      <OptimizationSuggestions readabilityScore={readabilityScore} complexityScore={complexityScore} cohesionScore={cohesionScore} clarityScore={clarityScore} sentenceLengthScore={sentenceLengthScore} wordLengthScore={wordLengthScore} syllableCountScore={syllableCountScore} />
      <EngagementTracker />
      <AlternativeFormats />
    </div>
  );
};

export default ContentAnalyzerPage;