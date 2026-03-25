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

  // Combine the readability score, complexity score, cohesion score, and clarity score
  const combinedScore = (readabilityScore + complexityScore + cohesionScore + clarityScore) / 4

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

const App = () => {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [complexityScore, setComplexityScore] = useState(0);
  const [cohesionScore, setCohesionScore] = useState(0);
  const [clarityScore, setClarityScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [engagement, setEngagement] = useState(0);
  const [alternativeFormats, setAlternativeFormats] = useState([]);

  useEffect(() => {
    const storedContent = LocalStorage.get('content');
    if (storedContent) {
      setContent(storedContent);
    }
  }, []);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    LocalStorage.set('content', newContent);
  };

  const handleAnalyze = async () => {
    const readability = await calculateReadabilityScore(content);
    setReadabilityScore(readability);

    const complexity = await calculateComplexityScore(content);
    setComplexityScore(complexity);

    const cohesion = await calculateCohesionScore(content);
    setCohesionScore(cohesion);

    const clarity = await calculateClarityScore(content);
    setClarityScore(clarity);

    const suggestions = await getOptimizationSuggestions(content);
    setSuggestions(suggestions);

    const engagement = await getEngagementScore(content);
    setEngagement(engagement);

    const alternativeFormats = await getAlternativeFormats(content);
    setAlternativeFormats(alternativeFormats);
  };

  const getOptimizationSuggestions = async (text: string) => {
    const suggestionsPipeline = pipeline('text-generation', model='t5-base')
    const result = await suggestionsPipeline(text)
    const suggestions = result.generated_text

    return suggestions;
  }

  const getEngagementScore = async (text: string) => {
    const engagementPipeline = pipeline('text-classification', model='distilbert-base-uncased-finetuned-sst-2-english')
    const result = await engagementPipeline(text)
    const engagementScore = result.score

    return engagementScore;
  }

  const getAlternativeFormats = async (text: string) => {
    const alternativeFormatsPipeline = pipeline('text-generation', model='t5-base')
    const result = await alternativeFormatsPipeline(text)
    const alternativeFormats = result.generated_text

    return alternativeFormats;
  }

  return (
    <div>
      <SEO title="AI-Powered Content Optimizer" />
      <PageHeader />
      <ContentAnalyzerForm
        content={content}
        onChange={handleContentChange}
        onAnalyze={handleAnalyze}
      />
      <OptimizationSuggestions suggestions={suggestions} />
      <EngagementTracker engagement={engagement} />
      <AlternativeFormats formats={alternativeFormats} />
    </div>
  );
};

export default App;