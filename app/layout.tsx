use client;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Header from './header';
import Footer from './footer';

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <Head>
        <title>AI-Powered Content Optimizer</title>
        <meta name="description" content="AI-powered content optimization tool for better engagement and conversion rates" />
        <meta name="keywords" content="content optimization, ai marketing tools, growth hacking, digital marketing strategy, content creation" />
        <meta name="author" content="AI-Powered Content Optimizer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:title" content="AI-Powered Content Optimizer" />
        <meta property="og:description" content="AI-powered content optimization tool for better engagement and conversion rates" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://ai-content-optimizer.com" />
        <meta property="og:site_name" content="AI-Powered Content Optimizer" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI-Powered Content Optimizer" />
        <meta name="twitter:description" content="AI-powered content optimization tool for better engagement and conversion rates" />
        <meta name="twitter:image" content="/twitter-image.png" />
        <meta name="twitter:site" content="@ai_content_optimizer" />
      </Head>
      <body className="font-sans text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}