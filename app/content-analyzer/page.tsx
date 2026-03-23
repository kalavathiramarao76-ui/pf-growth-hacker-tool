use client;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '../utils/local-storage';
import { SEO } from '../components/seo';
import { PageHeader } from '../components/page-header';
import { ContentAnalyzerForm } from '../components/content-analyzer-form';
import { OptimizationSuggestions } from '../components/optimization-suggestions';
import { EngagementTracker } from '../components/engagement-tracker';
import { AlternativeFormats } from '../components/alternative-formats';

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
  const response = await fetch('/api/advanced-sentiment-analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const sentimentAnalysis = await response.json();
  return sentimentAnalysis;
};

const performEntityRecognition = async (text: string) => {
  const response = await fetch('/api/entity-recognition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const entityRecognition = await response.json();
  return entityRecognition;
};

const performTopicModeling = async (text: string) => {
  const response = await fetch('/api/topic-modeling', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const topicModeling = await response.json();
  return topicModeling;
};

const ContentAnalyzerPage = () => {
  const [analysisResults, setAnalysisResults] = useState([]);
  const [savedResults, setSavedResults] = useState(() => LocalStorage.get('savedResults', []));
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const router = useRouter();

  const handleAnalysis = async (text: string) => {
    const analysis = await advancedContentAnalysis({ text });
    setCurrentAnalysis(analysis);
  };

  const handleSaveResult = () => {
    if (currentAnalysis) {
      const newSavedResults = [...savedResults, currentAnalysis];
      LocalStorage.set('savedResults', newSavedResults);
      setSavedResults(newSavedResults);
    }
  };

  const handleCompareResults = () => {
    if (savedResults.length > 1) {
      const comparisonResults = savedResults.map((result) => ({
        readabilityScore: result.readabilityScore,
        fleschKincaidGradeLevel: result.fleschKincaidGradeLevel,
        gunningFogIndex: result.gunningFogIndex,
        sentimentAnalysis: result.sentimentAnalysis,
      }));
      setAnalysisResults(comparisonResults);
    }
  };

  return (
    <div>
      <SEO title="AI-Powered Content Optimizer" />
      <PageHeader title="AI-Powered Content Optimizer" />
      <ContentAnalyzerForm onAnalyze={handleAnalysis} />
      {currentAnalysis && (
        <div>
          <OptimizationSuggestions analysis={currentAnalysis} />
          <EngagementTracker analysis={currentAnalysis} />
          <AlternativeFormats analysis={currentAnalysis} />
          <button onClick={handleSaveResult}>Save Result</button>
        </div>
      )}
      {savedResults.length > 0 && (
        <div>
          <h2>Saved Results</h2>
          <ul>
            {savedResults.map((result, index) => (
              <li key={index}>
                <p>Readability Score: {result.readabilityScore}</p>
                <p>Flesch-Kincaid Grade Level: {result.fleschKincaidGradeLevel}</p>
                <p>Gunning-Fog Index: {result.gunningFogIndex}</p>
                <p>Sentiment Analysis: {result.sentimentAnalysis}</p>
              </li>
            ))}
          </ul>
          <button onClick={handleCompareResults}>Compare Results</button>
        </div>
      )}
      {analysisResults.length > 0 && (
        <div>
          <h2>Comparison Results</h2>
          <table>
            <thead>
              <tr>
                <th>Readability Score</th>
                <th>Flesch-Kincaid Grade Level</th>
                <th>Gunning-Fog Index</th>
                <th>Sentiment Analysis</th>
              </tr>
            </thead>
            <tbody>
              {analysisResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.readabilityScore}</td>
                  <td>{result.fleschKincaidGradeLevel}</td>
                  <td>{result.gunningFogIndex}</td>
                  <td>{result.sentimentAnalysis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContentAnalyzerPage;