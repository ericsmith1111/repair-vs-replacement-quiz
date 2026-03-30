import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, AlertTriangle } from 'lucide-react';

const RoofRepairOrReplacementQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showHome, setShowHome] = useState(true);

  const allQuestions = [
    {
      id: 'age',
      question: 'How old is your roof?',
      options: [
        { text: 'Less than 10 years', value: 0, repairScore: 3, replacementScore: 0 },
        { text: '10-15 years', value: 1, repairScore: 2, replacementScore: 1 },
        { text: '15-20 years', value: 2, repairScore: 1, replacementScore: 2 },
        { text: '20-25 years', value: 3, repairScore: 0, replacementScore: 4 },
        { text: 'More than 25 years', value: 4, repairScore: 0, replacementScore: 6 }
      ]
    },
    {
      id: 'roof_type',
      question: 'What type of roof do you have?',
      options: [
        { text: 'Asphalt Shingles', value: 0, repairScore: 2, replacementScore: 1 },
        { text: 'Metal', value: 1, repairScore: 3, replacementScore: 0 },
        { text: 'Tile', value: 2, repairScore: 3, replacementScore: 0 },
        { text: 'Wood Shake', value: 3, repairScore: 1, replacementScore: 2 },
        { text: 'Flat/TPO/EPDM', value: 4, repairScore: 2, replacementScore: 1 },
        { text: 'Not sure', value: 5, repairScore: 0, replacementScore: 0 }
      ]
    },
    {
      id: 'granules',
      question: 'Are granules missing from your shingles?',
      conditional: true,
      showIf: (answers) => answers.roof_type && answers.roof_type.value === 0, // Only show for Asphalt Shingles
      options: [
        { text: 'No granule loss visible', value: 0, repairScore: 3, replacementScore: 0 },
        { text: 'Minor granule loss', value: 1, repairScore: 2, replacementScore: 1 },
        { text: 'Moderate granule loss', value: 2, repairScore: 0, replacementScore: 4 },
        { text: 'Significant granule loss', value: 3, repairScore: 0, replacementScore: 6 },
        { text: 'Unsure', value: 4, repairScore: 0, replacementScore: 0 }
      ]
    },
    {
      id: 'leaks',
      question: 'Have you noticed any active leaks or water stains inside your home?',
      options: [
        { text: 'No leaks or stains', value: 0, repairScore: 3, replacementScore: 0 },
        { text: 'Old water stains (not active)', value: 1, repairScore: 3, replacementScore: 1 },
        { text: 'One active leak', value: 2, repairScore: 2, replacementScore: 2 },
        { text: 'Multiple active leaks', value: 3, repairScore: 0, replacementScore: 5 },
        { text: 'Recurring leaks in same spots', value: 4, repairScore: 0, replacementScore: 6 },
        { text: 'Unsure', value: 5, repairScore: 0, replacementScore: 0 }
      ]
    },
    {
      id: 'visible_damage',
      question: 'How much material damage is visible on your roof?',
      options: [
        { text: 'No visible damage', value: 0, repairScore: 3, replacementScore: 0 },
        { text: 'Minor damage - Less than 10 areas', value: 1, repairScore: 4, replacementScore: 0 },
        { text: 'Moderate damage - 10 to 30 areas', value: 2, repairScore: 2, replacementScore: 2 },
        { text: 'Significant damage - 30+ areas', value: 3, repairScore: 1, replacementScore: 4 },
        { text: 'Widespread damage across the entire roof', value: 4, repairScore: 0, replacementScore: 6 },
        { text: 'Unsure', value: 5, repairScore: 0, replacementScore: 0 }
      ]
    },
    {
      id: 'previous_work',
      question: 'Have you had roof work or repairs done in the past?',
      options: [
        { text: 'No previous work', value: 0, repairScore: 2, replacementScore: 0 },
        { text: 'One repair that solved the problem', value: 1, repairScore: 3, replacementScore: 0 },
        { text: '2-3 repairs over the years', value: 2, repairScore: 1, replacementScore: 2 },
        { text: 'Multiple repairs with ongoing issues', value: 3, repairScore: 0, replacementScore: 5 },
        { text: 'Unsure', value: 4, repairScore: 0, replacementScore: 0 }
      ]
    },
    {
      id: 'stay_duration',
      question: 'Do you plan to stay in your home for the next 5+ years?',
      options: [
        { text: 'Yes, long-term home (5+ years)', value: 0, repairScore: 0, replacementScore: 2 },
        { text: 'Probably (3-5 years)', value: 1, repairScore: 1, replacementScore: 1 },
        { text: 'Uncertain', value: 2, repairScore: 2, replacementScore: 1 },
        { text: 'No, selling soon (within 2 years)', value: 3, repairScore: 3, replacementScore: 0 }
      ]
    }
  ];

  // Filter questions based on conditional logic
  const questions = allQuestions.filter(q => {
    if (!q.conditional) return true;
    return q.showIf(answers);
  });

  const calculateResults = () => {
    let repairScore = 0;
    let replacementScore = 0;

    allQuestions.forEach(q => {
      const answer = answers[q.id];
      if (answer !== undefined) {
        repairScore += answer.repairScore;
        replacementScore += answer.replacementScore;
      }
    });

    // Critical factors that heavily influence replacement
    const roofAge = answers['age'];
    const leaks = answers['leaks'];
    const visibleDamage = answers['visible_damage'];
    const previousWork = answers['previous_work'];
    const granules = answers['granules'];

    // ALWAYS recommend replacement for 20+ year roofs
    if (roofAge && roofAge.value >= 3) {
      return {
        recommendation: 'replacement',
        repairScore,
        replacementScore,
        reason: 'Roof is 20+ years old'
      };
    }

    // Other auto-replacement triggers (only if roof age is under 20 years)
    const needsReplacement = 
      (leaks && leaks.value >= 3) || // Multiple active leaks or recurring
      (visibleDamage && visibleDamage.value >= 4) || // Widespread damage
      (previousWork && previousWork.value === 3) || // Multiple repairs with ongoing issues
      (granules && granules.value >= 2) || // Moderate or significant granule loss
      replacementScore > repairScore + 3; // Replacement score significantly higher

    return {
      recommendation: needsReplacement ? 'replacement' : 'repair',
      repairScore,
      replacementScore
    };
  };

  const handleAnswer = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowResults(false);
    }
  };

  // Home Screen
  if (showHome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
            {/* Logo */}
            <div className="text-center mb-8">
              <a href="https://www.pakroofs.com" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/PAkExteriorsLogo.png" 
                  alt="Pak Exteriors Logo" 
                  className="mx-auto h-24 object-contain cursor-pointer hover:opacity-80 transition"
                />
              </a>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Repair vs. Replacement Quiz
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Answer a few expert diagnostic questions and get a professional recommendation on whether your roof needs a simple repair or full replacement.
              </p>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-lg text-gray-900 mb-3">What You'll Discover:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Whether your roof can be repaired or needs full replacement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Expert assessment based on industry standards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Clear next steps to protect your home</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Direct access to schedule a free inspection</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setShowHome(false)}
              className="w-full bg-orange-600 text-white py-6 px-8 rounded-xl font-bold text-xl hover:bg-orange-700 transition shadow-lg flex items-center justify-center gap-3"
            >
              Start Assessment
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const results = calculateResults();
    const isReplacement = results.recommendation === 'replacement';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
            {/* Logo */}
            <div className="text-center mb-8">
              <a href="https://www.pakroofs.com" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/PAkExteriorsLogo.png" 
                  alt="Pak Exteriors Logo" 
                  className="mx-auto h-20 object-contain cursor-pointer hover:opacity-80 transition"
                />
              </a>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Your Roof Assessment Results</h1>

            {/* Main Recommendation */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-6" style={{ color: isReplacement ? '#dc2626' : '#16a34a' }}>
                {isReplacement ? 'It looks like you need a replacement.' : 'It looks like you need a repair.'}
              </h2>

              {/* Special message if 20+ year roof */}
              {isReplacement && answers['age'] && answers['age'].value >= 3 && (
                <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6 mb-6">
                  <p className="text-gray-800 font-semibold text-lg">
                    ⚠️ Your roof is 20+ years old, which has reached or exceeded the typical lifespan for most roofing materials. 
                    Replacement is strongly recommended regardless of current condition.
                  </p>
                </div>
              )}

              {isReplacement ? (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 mb-8">
                  <div className="flex items-start gap-4 mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <h3 className="font-bold text-xl text-gray-900 mb-3">Why Replacement is Recommended:</h3>
                      <p className="text-gray-700 mb-4">
                        Based on your responses, your roof is showing signs that repairs alone won't provide a long-term solution. A full replacement will:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">•</span>
                          <span>Protect your home from further water damage and costly interior repairs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">•</span>
                          <span>Restore your insurance coverage and home value</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">•</span>
                          <span>Improve energy efficiency and reduce utility costs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">•</span>
                          <span>Provide 20-50 years of worry-free protection</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 mb-8">
                  <div className="text-left">
                    <h3 className="font-bold text-xl text-gray-900 mb-3">Good News - Repairs Can Work!</h3>
                    <p className="text-gray-700 mb-4">
                      Based on your responses, targeted repairs should address your current issues effectively. A professional repair will:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Fix isolated damage and prevent it from spreading</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Cost significantly less than a full replacement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Extend the life of your current roof by years</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Be completed quickly with minimal disruption</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="mb-8">
              <button 
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setShowResults(false);
                  setShowHome(true);
                }}
                className="w-full bg-gray-200 text-gray-800 py-4 px-6 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question Screen
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <a href="https://www.pakroofs.com" target="_blank" rel="noopener noreferrer">
            <img 
              src="/PAkExteriorsLogo.png" 
              alt="Pak Exteriors Logo" 
              className="mx-auto h-16 object-contain cursor-pointer hover:opacity-80 transition"
            />
          </a>
        </div>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Repair or Replacement Assessment</h1>
          <p className="text-gray-700 text-lg">Expert diagnostic questions to determine your roof's needs</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-gray-700">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="font-bold text-orange-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-orange-600 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            {question.question}
          </h2>
          {question.subtitle && (
            <p className="text-gray-600 mb-6 text-center italic">{question.subtitle}</p>
          )}

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option)}
                className="w-full bg-white border-2 border-gray-300 rounded-lg p-6 hover:border-orange-600 hover:bg-orange-50 transition flex items-center justify-between group shadow-sm"
              >
                <span className="text-left font-semibold text-lg text-gray-900 group-hover:text-orange-600">
                  {option.text}
                </span>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-orange-600 flex-shrink-0 ml-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {currentQuestion > 0 && (
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-bold transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous Question
          </button>
        )}
      </div>
    </div>
  );
};

export default RoofRepairOrReplacementQuiz;
