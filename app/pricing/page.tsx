use client;

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineCheck } from 'react-icons/ai';
import { PricingPlan } from '../types/pricing';

const pricingPlans: PricingPlan[] = [
  {
    id: 1,
    name: 'Basic',
    price: 9.99,
    features: [
      'AI-powered content analysis',
      'Personalized optimization suggestions',
      'Engagement tracking and analytics',
    ],
  },
  {
    id: 2,
    name: 'Pro',
    price: 19.99,
    features: [
      'AI-powered content analysis',
      'Personalized optimization suggestions',
      'Engagement tracking and analytics',
      'Content calendar and planning',
      'Collaboration tools for teams',
    ],
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 49.99,
    features: [
      'AI-powered content analysis',
      'Personalized optimization suggestions',
      'Engagement tracking and analytics',
      'Content calendar and planning',
      'Collaboration tools for teams',
      'Integration with popular marketing platforms',
    ],
  },
];

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const router = useRouter();

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = () => {
    if (selectedPlan) {
      localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md ${
              selectedPlan?.id === plan.id ? 'border-2 border-blue-500' : ''
            }`}
          >
            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            <p className="text-lg font-bold mb-4">${plan.price}/month</p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center mb-2">
                  <AiOutlineCheck className="text-blue-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
              onClick={() => handleSelectPlan(plan)}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
      {selectedPlan && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Summary</h2>
          <p className="text-lg font-bold mb-4">
            You have selected the {selectedPlan.name} plan for ${selectedPlan.price}/month.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            onClick={handleSubscribe}
          >
            Subscribe
          </button>
        </div>
      )}
    </div>
  );
};

export default PricingPage;