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

  // Combine the readability score and complexity score
  const combinedScore = (readabilityScore + complexityScore) / 2

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

  return count;
}

const calculateComplexityScore = async (text: string) => {
  const complexityPipeline = pipeline('question-answering', model='distilbert-base-uncased-distilled-squad')
  const result = await complexityPipeline({ question: 'What is the complexity of the text?', context: text })
  const complexityScore = result.score

  return complexityScore
}

const getPersonalizedSuggestions = async (text: string, readabilityScore: number) => {
  const suggestionsPipeline = pipeline('text-generation', model='t5-base')
  const result = await suggestionsPipeline(`Generate suggestions to improve the readability of the text: ${text} with a readability score of ${readabilityScore}`)
  const suggestions = result[0].generated_text.split('\n')

  return suggestions
}

const Page = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [engagement, setEngagement] = useState(0);
  const [alternativeFormats, setAlternativeFormats] = useState([]);

  useEffect(() => {
    const storedText = LocalStorage.get('text');
    if (storedText) {
      setText(storedText);
    }
  }, []);

  const handleTextChange = (newText: string) => {
    setText(newText);
    LocalStorage.set('text', newText);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleAnalyze = async () => {
    const score = await calculateReadabilityScore(text);
    setReadabilityScore(score);
    const personalizedSuggestions = await getPersonalizedSuggestions(text, score);
    setSuggestions(personalizedSuggestions);
  };

  return (
    <div>
      <SEO title="AI-Powered Content Optimizer" />
      <PageHeader title="AI-Powered Content Optimizer" />
      <ContentAnalyzerForm
        text={text}
        language={language}
        onTextChange={handleTextChange}
        onLanguageChange={handleLanguageChange}
        onAnalyze={handleAnalyze}
      />
      {readabilityScore > 0 && (
        <OptimizationSuggestions
          readabilityScore={readabilityScore}
          suggestions={suggestions}
        />
      )}
      <EngagementTracker engagement={engagement} />
      <AlternativeFormats alternativeFormats={alternativeFormats} />
    </div>
  );
};

export default Page;