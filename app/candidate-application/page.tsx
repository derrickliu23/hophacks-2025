'use client'

import { useState } from "react";

const generalStats = {
  DSA: 85,
  ML: 70,
  Probability: 90,
  SQL: 80,
  "Numerical Reasoning": 75,
};

const detailedStats = {
  DSA: { Arrays: 90, Graphs: 80, Trees: 85, DynamicProgramming: 70 },
  ML: { Regression: 80, Classification: 75, NeuralNetworks: 70, NLP: 60 },
  Probability: { Combinatorics: 95, Bayes: 90, Distributions: 85 },
  SQL: { Joins: 90, Aggregates: 80, Transactions: 70 },
  "Numerical Reasoning": { Algebra: 80, Geometry: 70, Calculus: 60 },
};

const categories = ["DSA", "ML", "Probability", "SQL", "Numerical Reasoning"];

export default function CandidateApplications() {
  const [currentCard, setCurrentCard] = useState(0);

  const nextCard = () => setCurrentCard((prev) => (prev + 1) % 6);
  const prevCard = () => setCurrentCard((prev) => (prev - 1 + 6) % 6);

  const renderCardContent = () => {
    if (currentCard === 0) {
      // General stats
      return (
        <div className="space-y-4">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400">
            General Stats
          </h2>
          {Object.entries(generalStats).map(([key, value]) => (
            <div key={key} className="flex justify-between text-white text-xl border-b border-indigo-500/50 pb-2">
              <span>{key}</span>
              <span>{value}%</span>
            </div>
          ))}
        </div>
      );
    } else {
      // Detailed stats
      const category = categories[currentCard - 1];
      const stats = detailedStats[category];
      return (
        <div className="space-y-4">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400">
            {category} Deep Dive
          </h2>
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="flex justify-between text-white text-xl border-b border-purple-500/50 pb-2">
              <span>{key}</span>
              <span>{value}%</span>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-75"
        style={{ backgroundImage: "url('/hero-tech-city.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-12">
        {/* Carousel Card */}
        <div className="bg-black/60 backdrop-blur-lg border border-gray-700 rounded-3xl p-12 w-full max-w-3xl shadow-2xl transition-transform duration-500 hover:scale-105">
          {renderCardContent()}

          <div className="flex justify-between mt-8">
            <button
              onClick={prevCard}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              ← Previous
            </button>
            <button
              onClick={nextCard}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              Next →
            </button>
          </div>
        </div>

        <a
          href="/candidate-dashboard"
          className="mt-8 inline-block px-4 py-2 rounded-xl bg-black/50 text-white font-mono shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}
