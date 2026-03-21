use client;

import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { motion } from 'framer-motion';

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', darkMode ? 'false' : 'true');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Hero />
      <Features />
      <Pricing />
      <Faq />
      <Footer />
      <button
        className="fixed bottom-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
        onClick={toggleDarkMode}
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m6 16.368V4m6.354 8.354a9 9 0 017.5-7.5h-2m6-16v2m0 0h-2m-6-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

function Hero() {
  return (
    <section
      className="h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex justify-center items-center"
    >
      <div className="max-w-5xl mx-auto p-4 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          AI-Powered Content Optimizer
        </h1>
        <p className="text-2xl text-gray-200 mb-8">
          Analyze and optimize your marketing content for better engagement and
          conversion rates using AI-powered algorithms.
        </p>
        <Link href="/dashboard">
          <a className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
            Get Started
          </a>
        </Link>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-200 mb-8">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Feature
            title="AI-Powered Content Analysis"
            description="Analyze your marketing content and get actionable insights to improve your strategy."
          />
          <Feature
            title="Personalized Optimization Suggestions"
            description="Get personalized suggestions to optimize your content for better engagement and conversion rates."
          />
          <Feature
            title="Engagement Tracking and Analytics"
            description="Track your content's performance and get insights to adjust your strategy accordingly."
          />
          <Feature
            title="Content Calendar and Planning"
            description="Plan and schedule your content in advance to save time and increase productivity."
          />
          <Feature
            title="Collaboration Tools for Teams"
            description="Collaborate with your team members and work together to create and optimize content."
          />
          <Feature
            title="Integration with Popular Marketing Platforms"
            description="Integrate with popular marketing platforms to streamline your workflow and increase efficiency."
          />
        </div>
      </div>
    </section>
  );
}

function Feature({ title, description }) {
  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function Pricing() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-200 mb-8">
          Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PricingPlan
            title="Basic"
            price="$9.99"
            features={[
              'AI-Powered Content Analysis',
              'Personalized Optimization Suggestions',
              'Engagement Tracking and Analytics',
            ]}
          />
          <PricingPlan
            title="Pro"
            price="$19.99"
            features={[
              'AI-Powered Content Analysis',
              'Personalized Optimization Suggestions',
              'Engagement Tracking and Analytics',
              'Content Calendar and Planning',
              'Collaboration Tools for Teams',
            ]}
          />
          <PricingPlan
            title="Enterprise"
            price="Custom"
            features={[
              'AI-Powered Content Analysis',
              'Personalized Optimization Suggestions',
              'Engagement Tracking and Analytics',
              'Content Calendar and Planning',
              'Collaboration Tools for Teams',
              'Integration with Popular Marketing Platforms',
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function PricingPlan({ title, price, features }) {
  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-4">
        {price}
      </p>
      <ul>
        {features.map((feature) => (
          <li key={feature} className="text-gray-600 dark:text-gray-400">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Faq() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-200 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FaqQuestion
            question="What is AI-Powered Content Optimizer?"
            answer="AI-Powered Content Optimizer is a tool that analyzes and optimizes marketing content for better engagement and conversion rates using AI-powered algorithms."
          />
          <FaqQuestion
            question="How does it work?"
            answer="It works by analyzing your marketing content and providing actionable insights and suggestions to improve your strategy."
          />
          <FaqQuestion
            question="What features does it have?"
            answer="It has features such as AI-Powered Content Analysis, Personalized Optimization Suggestions, Engagement Tracking and Analytics, Content Calendar and Planning, Collaboration Tools for Teams, and Integration with Popular Marketing Platforms."
          />
          <FaqQuestion
            question="How much does it cost?"
            answer="The pricing plans are as follows: Basic ($9.99), Pro ($19.99), and Enterprise (Custom)."
          />
        </div>
      </div>
    </section>
  );
}

function FaqQuestion({ question, answer }) {
  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">
        {question}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{answer}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 p-4 text-center">
      <p className="text-gray-600 dark:text-gray-400">
        &copy; 2024 AI-Powered Content Optimizer. All rights reserved.
      </p>
    </footer>
  );
}