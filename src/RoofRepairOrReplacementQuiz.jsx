/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

const PAK_NAVY = "#082A3B";
const PAK_ORANGE = "#F2692D";
const PAK_CREAM = "#f7f8fa";

const RoofRepairOrReplacementQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showHome, setShowHome] = useState(true);
  // funnel shows directly below results - no separate state needed

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
      showIf: (answers) => answers.roof_type && answers.roof_type.value === 0,
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

    const roofAge = answers['age'];
    const leaks = answers['leaks'];
    const visibleDamage = answers['visible_damage'];
    const previousWork = answers['previous_work'];
    const granules = answers['granules'];

    if (roofAge && roofAge.value >= 3) {
      return {
        recommendation: 'replacement',
        repairScore,
        replacementScore,
        reason: 'Roof is 20+ years old'
      };
    }

    const needsReplacement =
      (leaks && leaks.value >= 3) ||
      (visibleDamage && visibleDamage.value >= 4) ||
      (previousWork && previousWork.value === 3) ||
      (granules && granules.value >= 2) ||
      replacementScore > repairScore + 3;

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

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setShowHome(true);
  };

  // HOME SCREEN
  if (showHome) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: "32px 16px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{
            background: "white",
            borderRadius: 20,
            padding: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <img
                src="/images/logo.png"
                alt="Pak Exteriors Logo"
                style={{ height: 80, objectFit: "contain", margin: "0 auto" }}
              />
            </div>

            <h1 style={{
              fontSize: 32,
              fontWeight: 800,
              color: PAK_NAVY,
              marginBottom: 16,
              textAlign: "center"
            }}>
              Repair vs. Replacement Quiz
            </h1>

            <p style={{
              fontSize: 16,
              color: "#475569",
              lineHeight: 1.6,
              marginBottom: 24,
              textAlign: "center"
            }}>
              Answer a few expert diagnostic questions and get a professional recommendation on whether your roof needs a simple repair or full replacement.
            </p>

            <div style={{
              background: PAK_CREAM,
              borderRadius: 12,
              padding: "18px 20px",
              borderLeft: "4px solid " + PAK_NAVY,
              marginBottom: 24
            }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 12
              }}>
                What You'll Discover:
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, marginRight: 8 }}>✓</span>
                  Whether your roof can be repaired or needs full replacement
                </li>
                <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, marginRight: 8 }}>✓</span>
                  Expert assessment based on industry standards
                </li>
                <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, marginRight: 8 }}>✓</span>
                  Clear next steps to protect your home
                </li>
                <li style={{ fontSize: 14, color: "#475569" }}>
                  <span style={{ fontWeight: 800, marginRight: 8 }}>✓</span>
                  Direct access to schedule a free inspection
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowHome(false)}
              style={{
                width: "100%",
                padding: "18px 24px",
                borderRadius: 12,
                background: PAK_ORANGE,
                color: "white",
                fontWeight: 800,
                fontSize: 17,
                border: "none",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 2px 8px rgba(242,105,45,0.3)"
              }}
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RESULTS SCREEN + FUNNEL
  if (showResults) {
    const results = calculateResults();
    const isReplacement = results.recommendation === 'replacement';
    const showFinancing = isReplacement;

    return (
        <div style={{
          minHeight: "100vh",
          background: "#f0f2f5",
          padding: "32px 16px",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        }}>
          <div className="results-container" style={{ maxWidth: 600, margin: "0 auto" }}>

            {/* RESULTS CARDS */}
            <div style={{
              background: "white",
              borderRadius: 20,
              padding: "24px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              marginBottom: 10
            }}>
              <div style={{ textAlign: "center" }}>
                <h2 style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: isReplacement ? PAK_ORANGE : "#16a34a",
                  marginBottom: 16
                }}>
                  {isReplacement ? 'Roof Replacement Recommended' : 'Roof Repair Recommended'}
                </h2>

                {isReplacement && answers['age'] && answers['age'].value >= 3 && (
                  <div style={{
                    background: "#FFF8E1",
                    borderRadius: 12,
                    padding: "18px 20px",
                    borderLeft: "4px solid #FFC107",
                    marginBottom: 16
                  }}>
                    <p style={{
                      fontSize: 14,
                      color: "#475569",
                      lineHeight: 1.6,
                      margin: 0
                    }}>
                      <span style={{ fontWeight: 700 }}>⚠ Your roof is 20+ years old</span>, which has reached or exceeded the typical lifespan for most roofing materials. Replacement is strongly recommended regardless of current condition.
                    </p>
                  </div>
                )}

                {isReplacement ? (
                  <div>
                    <h3 style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: PAK_NAVY,
                      marginBottom: 12,
                      textAlign: "left"
                    }}>
                      Why Replacement is Recommended:
                    </h3>
                    <p style={{
                      fontSize: 14,
                      color: "#475569",
                      lineHeight: 1.6,
                      marginBottom: 12,
                      textAlign: "left"
                    }}>
                      Based on your responses, your roof is showing signs that repairs alone won't provide a long-term solution. A full replacement will:
                    </p>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", textAlign: "left" }}>
                      <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                        <span style={{ fontWeight: 800, marginRight: 8, color: PAK_ORANGE }}>•</span>
                        Protect your home from further water damage and costly interior repairs
                      </li>
                      <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                        <span style={{ fontWeight: 800, marginRight: 8, color: PAK_ORANGE }}>•</span>
                        Restore your insurance coverage and home value
                      </li>
                      <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                        <span style={{ fontWeight: 800, marginRight: 8, color: PAK_ORANGE }}>•</span>
                        Improve energy efficiency and reduce utility costs
                      </li>
                      <li style={{ fontSize: 14, color: "#475569" }}>
                        <span style={{ fontWeight: 800, marginRight: 8, color: PAK_ORANGE }}>•</span>
                        Provide 20-50 years of worry-free protection
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <h3 style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: PAK_NAVY,
                      marginBottom: 12,
                      textAlign: "left"
                    }}>
                      Good News - Repairs Can Work!
                    </h3>
                    <p style={{
                      fontSize: 14,
                      color: "#475569",
                      lineHeight: 1.6,
                      marginBottom: 12,
                      textAlign: "left"
                    }}>
                      Based on your responses, targeted repairs should address your current issues effectively. A professional repair will:
                    </p>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", textAlign: "left" }}>
                      <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                        <span style={{ fontWeight: 800, marginRight: 8, color: "#16a34a" }}>•</span>
                        Fix isolated damage and prevent it from spreading
                      </li>
                      <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                        <span style={{ fontWeight: 800, marginRight: 8, color: "#16a34a" }}>•</span>
                        Cost significantly less than a full replacement
                      </li>
                      <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                        <span style={{ fontWeight: 800, marginRight: 8, color: "#16a34a" }}>•</span>
                        Extend the life of your current roof by years
                      </li>
                      <li style={{ fontSize: 14, color: "#475569" }}>
                        <span style={{ fontWeight: 800, marginRight: 8, color: "#16a34a" }}>•</span>
                        Be completed quickly with minimal disruption
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* FINANCING SECTION */}
            {showFinancing && (
              <div style={{
                background: "white",
                borderRadius: 20,
                padding: "24px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                marginBottom: 10
              }}>
                <h3 style={{
                  fontSize: 19,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 14
                }}>
                  Flexible Financing Available
                </h3>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  marginBottom: 12
                }}>
                  We understand that a roof replacement is a significant investment. We offer flexible financing options to help make your new roof work within your budget, so cost doesn't have to be a barrier to protecting your home.
                </p>
              </div>
            )}

            {/* FIRST CTA BLOCK */}
            <div style={{
              background: PAK_NAVY,
              borderRadius: 20,
              padding: "28px 24px",
              marginBottom: 10
            }}>
              <button style={{
                width: "100%",
                padding: "18px 24px",
                borderRadius: 12,
                background: PAK_ORANGE,
                color: "white",
                fontWeight: 800,
                fontSize: 17,
                border: "none",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 2px 8px rgba(242,105,45,0.3)",
                marginBottom: 10
              }}>
                <a href="#" style={{ color: "white", textDecoration: "none" }}>
                  Schedule a Consultation
                </a>
              </button>
              <button style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: 12,
                background: "transparent",
                color: "white",
                fontWeight: 700,
                fontSize: 15,
                border: "2px solid white",
                cursor: "pointer"
              }}>
                <a href="#" style={{ color: "white", textDecoration: "none" }}>
                  See Our Pricing
                </a>
              </button>
            </div>

            {/* DIVIDER & FUNNEL INTRO */}
            <div style={{
              borderTop: "1px solid #e5e7eb",
              margin: "20px 0",
              paddingTop: 20,
              marginBottom: 10
            }}>
              <h2 style={{
                fontSize: 24,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 8,
                textAlign: "center"
              }}>
                What Does a Roof Replacement Actually Cost in Colorado?
              </h2>
              <p style={{
                fontSize: 14,
                color: "#64748b",
                lineHeight: 1.7,
                textAlign: "center",
                margin: 0
              }}>
                Real pricing from a Colorado contractor. No form to fill out. No one's going to call you. Just the information you need to make a clear-headed decision on your own terms.
              </p>
            </div>

            {/* TRUST BADGES */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              justifyContent: "center",
              marginBottom: 10
            }}>
              {["7 Manufacturer Certifications", "Locally Owned", "Transparent Pricing", "10-Year Workmanship Guarantee"].map((badge, idx) => (
                <span key={idx} style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: PAK_NAVY,
                  background: PAK_CREAM,
                  border: "1px solid #dde4ea",
                  borderRadius: 999,
                  padding: "6px 14px"
                }}>
                  {badge}
                </span>
              ))}
            </div>

            {/* PRICING SECTION */}
            <div style={{
              background: "white",
              borderRadius: 20,
              padding: "24px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              marginBottom: 10
            }}>
              <h3 style={{
                fontSize: 19,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 14
              }}>
                Real Pricing for Colorado Roof Replacements
              </h3>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                Most roofing companies keep their pricing vague. "It depends." "We'd need to come out and see." "Every roof is different." All true, but none of that helps you when you're just trying to get a ballpark.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                We think you should have more to go on than a smooth pitch and a yard sign. So we publish our actual pricing online. Real installed price ranges by material type, roof size, and location. We break out Front Range and mountain pricing separately because the costs are different and the reasons matter.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                Five things drive the number: material type, roof size, slope and complexity, location, and code requirements. We explain all of that on our pricing page so you can see exactly what applies to your situation.
              </p>

              <div style={{
                background: PAK_CREAM,
                borderRadius: 12,
                padding: "18px 20px",
                borderLeft: "4px solid " + PAK_NAVY,
                marginBottom: 12
              }}>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  <span style={{ fontWeight: 700 }}>Why location matters:</span> Mountain roofing involves stricter code requirements, full ice and water shield coverage, engineered ventilation, and materials that need to handle extreme UV, freeze-thaw cycles, and snow loads. Along the Front Range, hail, UV intensity, and daily temperature swings are the primary concerns. Both environments demand more from a roof than most of the country, and the pricing reflects what it takes to build a system that actually performs.
                </p>
              </div>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 0
              }}>
                We also offer flexible financing to help make a roof replacement work for your budget. We try to meet homeowners where they are.
              </p>
            </div>

            {/* CTA BREAK 1 */}
            <div style={{
              textAlign: "center",
              paddingTop: 20,
              paddingBottom: 20,
              marginBottom: 10
            }}>
              <p style={{
                fontSize: 14,
                color: "#64748b",
                marginBottom: 16
              }}>
                Want to see what your specific roof would cost?
              </p>
              <button style={{
                width: "100%",
                padding: "18px 24px",
                borderRadius: 12,
                background: PAK_ORANGE,
                color: "white",
                fontWeight: 800,
                fontSize: 17,
                border: "none",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 2px 8px rgba(242,105,45,0.3)",
                marginBottom: 10
              }}>
                <a href="#" style={{ color: "white", textDecoration: "none" }}>
                  See Our Full Pricing Guide
                </a>
              </button>
              <button style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: 12,
                background: "white",
                color: PAK_NAVY,
                fontWeight: 700,
                fontSize: 15,
                border: "2px solid " + PAK_NAVY,
                cursor: "pointer"
              }}>
                <a href="#" style={{ color: PAK_NAVY, textDecoration: "none" }}>
                  Try Our Instant Roof Estimator
                </a>
              </button>
            </div>

            {/* MATERIAL OPTIONS SECTION */}
            <div style={{
              background: "white",
              borderRadius: 20,
              padding: "24px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              marginBottom: 10
            }}>
              <h3 style={{
                fontSize: 19,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 14
              }}>
                Material Options for Colorado Homes
              </h3>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                When it's time for a new roof, you have more options than you might think. The right choice depends on where you live, what your roof deals with season to season, and what matters most to you in terms of longevity, appearance, and cost.
              </p>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Impact-Resistant Asphalt (Class 3 and Class 4)
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  The most common choice for Colorado homes. Impact-resistant shingles are built with better materials overall, which means they hold up to hail, UV exposure, freeze-thaw cycles, and temperature swings significantly better than standard shingles. Class 4 is the highest impact rating and often qualifies for insurance premium discounts, which can offset a meaningful portion of the cost difference over time. For most Colorado homes, impact-resistant asphalt is the sweet spot between weather performance and cost.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Stone-Coated Steel
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  One of the strongest options available, and often overlooked. Stone-coated steel is installed on a batten system, which creates an air gap between the roof deck and the panels. That air gap has real energy efficiency benefits because it reduces heat transfer through the roof assembly. The stone granules on the surface also provide built-in snow retention in mountain areas, and the traditional look blends well with most neighborhoods. It handles hail, UV, and temperature swings as well as anything on the market, and it lasts significantly longer than asphalt.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Standing Seam Metal
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  Standing seam is a long-term play. It lasts 40-60+ years, handles extreme weather well, and requires minimal maintenance. Its smooth surface releases ice and snow quickly, which keeps loads off the roof in mountain areas. In mountain installations, a robust snow retention setup with snow fencing and snow guards is needed to keep ice and snow from sliding off in dangerous sheets. Along the Front Range, the primary benefits are longevity and hail performance. When it's designed correctly, it's one of the longest-lasting roofing systems you can install.
                </p>
              </div>

              <div style={{
                background: PAK_CREAM,
                borderRadius: 12,
                padding: "18px 20px",
                borderLeft: "4px solid " + PAK_NAVY,
                marginBottom: 16
              }}>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  <span style={{ fontWeight: 700 }}>Metal vs. Asphalt:</span> Both metal options handle Colorado weather differently than asphalt. Asphalt absorbs impact and eventually cracks or loses granules. Metal deflects impact. A hail event that would total an asphalt roof might leave cosmetic marks on metal but no functional damage. Both metal options also pair well with heat cable systems in mountain areas, because the heat from the cables dissipates into the surrounding metal, making the system significantly more effective than on asphalt.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Synthetic Composite
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  Engineered to look like natural slate, cedar shake, clay tile, or barrel tile, but built to handle Colorado conditions. Lighter than real stone or clay, longer-lasting than wood, and designed to resist the UV and temperature cycling that breaks down natural materials. Premium price, but it's a long-term investment with very low maintenance.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Concrete and Clay Tile
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  Tile roofs are common in parts of Colorado and can last 50 years or more when installed correctly. Concrete tile is heavier and more affordable. Clay tile is lighter and typically more expensive, with a distinctive barrel or flat profile. Both handle UV and temperature swings well, but weight matters. Your roof structure needs to support tile, and not every home was framed for it. If your home already has tile, replacement is usually straightforward. If you're considering a switch to tile, we'll check your framing and let you know whether it's realistic before you commit to anything.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Designer Asphalt
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  For homeowners who want a distinctive architectural look without moving to metal or synthetic. Thicker profiles, richer textures, and a wider range of color options. These sit between standard impact-resistant and premium synthetic in both price and curb appeal.
                </p>
              </div>

              <div style={{
                background: PAK_CREAM,
                borderRadius: 12,
                padding: "18px 20px",
                borderLeft: "4px solid " + PAK_NAVY
              }}>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  <span style={{ fontWeight: 700 }}>Manufacturer Certifications:</span> We're certified across seven manufacturers. That means when we recommend a product, it's based on what fits your home, your climate, your exposure, and your budget. Not on what one brand pays us to sell. That matters more than most people realize.
                </p>
              </div>
            </div>

            {/* CTA BREAK 2 */}
            <div style={{
              textAlign: "center",
              paddingTop: 20,
              paddingBottom: 20,
              marginBottom: 10
            }}>
              <p style={{
                fontSize: 14,
                color: "#64748b",
                marginBottom: 16
              }}>
                Not sure which material makes sense for your home?
              </p>
              <button style={{
                width: "100%",
                padding: "18px 24px",
                borderRadius: 12,
                background: PAK_ORANGE,
                color: "white",
                fontWeight: 800,
                fontSize: 17,
                border: "none",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 2px 8px rgba(242,105,45,0.3)",
                marginBottom: 10
              }}>
                <a href="#" style={{ color: "white", textDecoration: "none" }}>
                  Schedule a Consultation
                </a>
              </button>
              <button style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: 12,
                background: "white",
                color: PAK_NAVY,
                fontWeight: 700,
                fontSize: 15,
                border: "2px solid " + PAK_NAVY,
                cursor: "pointer"
              }}>
                <a href="#" style={{ color: PAK_NAVY, textDecoration: "none" }}>
                  Try Our Instant Roof Estimator
                </a>
              </button>
            </div>

            {/* VENTILATION SECTION */}
            <div style={{
              background: "white",
              borderRadius: 20,
              padding: "24px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              marginBottom: 10
            }}>
              <h3 style={{
                fontSize: 19,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 14
              }}>
                The Second Most Important Function of Your Roof (That Most Contractors Skip)
              </h3>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                Your roof keeps weather out. That's the obvious job. But the second most important function of your roof system is moving air through your attic. And this is where most contractors, even good ones, cut corners or just don't think about it.
              </p>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                Your attic ventilation affects how long your roof lasts, how comfortable your home feels, and whether you end up with condensation, mold, ice dams, or premature failures. In Colorado, where temperature swings are extreme and conditions vary dramatically by location, this isn't optional. It's essential.
              </p>

              <h4 style={{
                fontSize: 15,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 12
              }}>
                What Proper Ventilation Actually Does
              </h4>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                A well-designed attic allows consistent air exchange: fresh, cool air enters through intake vents near the eaves, and warm air exits through exhaust vents near the ridge. This balance does four critical things:
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                It extends the life of your roof by reducing trapped heat and moisture. It reduces the risk of condensation, ice dams, and attic mold growth. It helps prevent shingles from curling or cracking prematurely. And it improves indoor comfort and HVAC efficiency, which shows up in lower energy costs over time.
              </p>

              <h4 style={{
                fontSize: 15,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 12
              }}>
                Condensation and Mold
              </h4>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                When warm, moist air gets trapped in an attic that can't breathe, condensation forms on the underside of the roof deck. Over time, that moisture damages insulation, rots framing, and creates conditions for mold growth. In Colorado, where the temperature difference between inside and outside can be significant, this can develop faster than most people realize.
              </p>

              <h4 style={{
                fontSize: 15,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 12
              }}>
                Ice Dams
              </h4>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                Heat escaping into the attic melts snow on the roof. The meltwater runs down to colder eave areas and refreezes. That ice buildup dams additional water, forcing it under your shingles and into your home. This is most common in mountain homes but happens along the Front Range too, especially after heavy wet snow. The root cause isn't snow. It's uneven roof temperature from inadequate ventilation.
              </p>

              <h4 style={{
                fontSize: 15,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 12
              }}>
                Energy Efficiency
              </h4>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                Proper ventilation keeps your attic cooler in summer and drier in winter, which means your HVAC system doesn't have to work as hard. That shows up in lower energy costs over time. In Colorado, where you're running heat and AC in meaningful amounts, this matters.
              </p>

              <h4 style={{
                fontSize: 15,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 12
              }}>
                "My Ventilation Has Been Fine for Years. Why Can't I Just Keep What I Have?"
              </h4>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                Maybe it has been fine. But a roof replacement changes the equation.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                Modern underlayment is significantly more effective at sealing out water than what was on your roof before. That's a good thing. But it also seals off airflow. Older underlayment breathed more. In mountain jurisdictions, full peel-and-stick ice and water shield is now required, which really tightens up the roof assembly. Even along the Front Range, the newer materials going on top create a tighter system than what was there before.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                The roof you're putting on is not the same system as the one you're taking off, even if the ventilation hardware looks identical. This is why ventilation needs to be evaluated during every roof replacement, not just assumed to be fine because it was fine before.
              </p>

              <h4 style={{
                fontSize: 15,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 12
              }}>
                What Most Contractors Get Wrong
              </h4>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                The problem is that most ventilation gets installed using general rules of thumb. That might be fine for some homes, but it doesn't account for your specific roof design, attic layout, or how air actually moves through the space. Using the wrong combination of products or the wrong quantities can actually make things worse instead of better.
              </p>

              <div style={{
                background: "#FFF8E1",
                borderRadius: 12,
                padding: "18px 20px",
                borderLeft: "4px solid #FFC107",
                marginBottom: 16
              }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Common Ventilation Mistakes We See in Colorado
                </h4>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 8 }}>
                  <span style={{ fontWeight: 700 }}>Insufficient intake.</span> Many homes lack adequate soffit vents or have blocked intake because insulation was pushed too far toward the eaves.
                </p>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 8 }}>
                  <span style={{ fontWeight: 700 }}>Mismatched exhaust.</span> Ridge vents, gable vents, or roof vents that don't move enough air relative to intake, throwing off the balance.
                </p>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 8 }}>
                  <span style={{ fontWeight: 700 }}>Multiple attic sections treated as one.</span> Homes with complex roof geometry often have separate attic spaces that aren't connected. Each one needs its own ventilation. Most contractors miss this.
                </p>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 8 }}>
                  <span style={{ fontWeight: 700 }}>Vaulted ceilings ignored.</span> Cathedral ceilings and vaulted spaces create ventilation challenges because traditional soffit-to-ridge airflow doesn't work the same way.
                </p>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 0 }}>
                  <span style={{ fontWeight: 700 }}>Assuming the old ventilation still works under new materials.</span> The roof going on is not the same system as the one coming off. Modern underlayment and ice and water shield seal the roof deck much tighter than older products did. A ventilation setup that worked fine under your previous roof may not be adequate under the new one. If the ventilation isn't redesigned to account for the change, moisture has nowhere to go.
                </p>
              </div>

              <h4 style={{
                fontSize: 15,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 12
              }}>
                How We Handle Ventilation (Two-Stage Design)
              </h4>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                We don't guess. Ventilation is calculated based on your attic's actual needs, not rules of thumb.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                <span style={{ fontWeight: 700 }}>Stage 1: Planning.</span> We use your roof measurements to calculate intake and exhaust requirements based on attic square footage, roof geometry, and vent performance ratings. This tells us how much airflow is needed and what types of vents should work.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                <span style={{ fontWeight: 700 }}>Stage 2: On-site verification.</span> Once work begins, the attic gets physically inspected to confirm the layout, check for obstructions, and trace actual airflow paths. Some homes have multiple attic sections that aren't connected to each other, which means each space needs its own ventilation. Adjustments get made based on what the house actually looks like, not just what the measurements suggested.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                margin: 0
              }}>
                Skipping either stage is how you end up with ventilation that looks right on paper but doesn't actually work. Ventilation should be part of the plan, not something that gets tacked on at the end.
              </p>
            </div>

            {/* CTA BREAK 3 */}
            <div style={{
              textAlign: "center",
              paddingTop: 20,
              paddingBottom: 20,
              marginBottom: 10
            }}>
              <p style={{
                fontSize: 14,
                color: "#64748b",
                marginBottom: 16
              }}>
                Curious whether your current ventilation is working the way it should?
              </p>
              <button style={{
                width: "100%",
                padding: "18px 24px",
                borderRadius: 12,
                background: PAK_ORANGE,
                color: "white",
                fontWeight: 800,
                fontSize: 17,
                border: "none",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 2px 8px rgba(242,105,45,0.3)",
                marginBottom: 10
              }}>
                <a href="#" style={{ color: "white", textDecoration: "none" }}>
                  Schedule a Consultation
                </a>
              </button>
              <button style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: 12,
                background: "white",
                color: PAK_NAVY,
                fontWeight: 700,
                fontSize: 15,
                border: "2px solid " + PAK_NAVY,
                cursor: "pointer"
              }}>
                <a href="#" style={{ color: PAK_NAVY, textDecoration: "none" }}>
                  Try Our Instant Roof Estimator
                </a>
              </button>
            </div>

            {/* A ROOF IS A SYSTEM */}
            <div style={{
              background: "white",
              borderRadius: 20,
              padding: "24px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              marginBottom: 10
            }}>
              <h3 style={{
                fontSize: 19,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 14
              }}>
                A Roof Is a System, Not Just Shingles
              </h3>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                A roof works best when every part of it is designed together. The shingles on top are the visible part, but underneath that you have underlayment, ice and water shield, flashing, decking, and ventilation all working as a system. If one piece is wrong, it affects everything else.
              </p>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                In Colorado, this matters more than most places. Whether it's hail along the Front Range, snow loads in the mountains, or the UV and temperature swings that hit everywhere in between, these conditions stress every layer of the roof assembly, not just the surface. A roof with great shingles but poor ventilation or inadequate underlayment will still fail early.
              </p>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                This is why we evaluate ventilation as part of every roof replacement. It's not a separate service we upsell. It's part of how a roof should be built.
              </p>

              <div style={{
                background: PAK_CREAM,
                borderRadius: 12,
                padding: "18px 20px",
                borderLeft: "4px solid " + PAK_NAVY
              }}>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  <span style={{ fontWeight: 700 }}>Every project gets a dedicated construction manager.</span> Not a rotating crew. You'll have one person who knows your project, your roof, and your situation. We update photos throughout the day via our online portal so you can see what's happening without wondering or calling. Most homeowners have never had that kind of visibility into their project.
                </p>
              </div>
            </div>

            {/* CTA BREAK 4 */}
            <div style={{
              textAlign: "center",
              paddingTop: 20,
              paddingBottom: 20,
              marginBottom: 10
            }}>
              <p style={{
                fontSize: 14,
                color: "#64748b",
                marginBottom: 16
              }}>
                Ready to talk about your roof? Or still have questions?
              </p>
              <button style={{
                width: "100%",
                padding: "18px 24px",
                borderRadius: 12,
                background: PAK_ORANGE,
                color: "white",
                fontWeight: 800,
                fontSize: 17,
                border: "none",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 2px 8px rgba(242,105,45,0.3)",
                marginBottom: 10
              }}>
                <a href="#" style={{ color: "white", textDecoration: "none" }}>
                  Schedule a Consultation
                </a>
              </button>
              <button style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: 12,
                background: "white",
                color: PAK_NAVY,
                fontWeight: 700,
                fontSize: 15,
                border: "2px solid " + PAK_NAVY,
                cursor: "pointer"
              }}>
                <a href="#" style={{ color: PAK_NAVY, textDecoration: "none" }}>
                  Try Our Instant Roof Estimator
                </a>
              </button>
            </div>

            {/* CONTRACTOR SECTION */}
            <div style={{
              background: "white",
              borderRadius: 20,
              padding: "24px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              marginBottom: 10
            }}>
              <h3 style={{
                fontSize: 19,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 14
              }}>
                What to Look for in a Colorado Roofing Contractor
              </h3>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                Not every roofer who shows up with a truck and a business card knows what they're doing. Here are the questions worth asking before you hire anyone:
              </p>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Do they understand ventilation?
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  Ask them: "Is the ventilation design based on calculation of my attic's actual needs? How will intake and exhaust balance be verified on-site?" A contractor who can answer these questions thoroughly understands ventilation. One who uses generic layouts or "standard" products may not. This is the most revealing question you can ask a roofer, and it's the one most homeowners don't think to bring up.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Are they certified across multiple manufacturers?
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  A contractor locked into one manufacturer is going to recommend that brand. It might not be the best fit for your home. Multi-manufacturer certification means the recommendation is based on your situation, not their business relationship.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Do they define scope and pricing up front?
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  You should know exactly what work is being done, what materials are being used, and what it costs before anything starts. If a contractor won't put that in front of you before you sign, that's a red flag.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Do they know your area?
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  Mountain communities have different building codes, different enforcement levels, and different requirements than the Front Range. A contractor familiar with your specific area will know the current requirements and can navigate the permit process without surprises.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Have you verified their insurance?
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  Ask to see their certificate of insurance. Then call the agent or broker listed on the certificate and confirm the coverage is active and written primarily for roofing. That last step matters more than most people realize. There's a known practice in the trades where contractors get insured under a cheaper trade category to reduce their premiums, get a certificate and then cancel the policy, or in some cases present a forged certificate. A five-minute phone call removes all of that uncertainty.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Will they be around for warranty work?
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  Ask where they're based and how long they've been in business. Not how long their brand has existed, but how long this specific company has been operating under this name, at this location. A locally owned company with a physical presence is more likely to stand behind their warranty than a crew that showed up for the season.
                </p>
              </div>

              <div style={{
                background: PAK_CREAM,
                borderRadius: 12,
                padding: "18px 20px",
                borderLeft: "4px solid " + PAK_NAVY
              }}>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  <span style={{ fontWeight: 700 }}>A note about "We'll cover your deductible" offers:</span> Any contractor who offers to pay or waive your insurance deductible is asking you to participate in insurance fraud. It's illegal in Colorado, and it's a red flag about how the rest of the job will be handled. If someone offers this, walk away.
                </p>
              </div>
            </div>

            {/* WHY HOMEOWNERS WORK WITH US */}
            <div style={{
              background: "white",
              borderRadius: 20,
              padding: "24px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              marginBottom: 10
            }}>
              <h3 style={{
                fontSize: 19,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 14
              }}>
                Why Homeowners Work With Us
              </h3>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                <span style={{ fontWeight: 700 }}>Calculation-based ventilation design, not rules of thumb.</span> We calculate what your attic actually needs and verify it on-site. Ventilation is designed as part of the roofing system, not added as an afterthought.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                <span style={{ fontWeight: 700 }}>Certified across seven manufacturers.</span> Our recommendation is based on what fits your home, not what one brand pays us to sell.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                <span style={{ fontWeight: 700 }}>Transparent pricing published online.</span> You can see what your roof should cost before you ever talk to anyone. No form, no email required.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                <span style={{ fontWeight: 700 }}>Defined scope and pricing before work starts.</span> You know exactly what we're doing and what it costs. No vague estimates, no surprises.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                <span style={{ fontWeight: 700 }}>Dedicated construction manager on every project.</span> One person who knows your job, with photos updated throughout the day via our online portal.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                <span style={{ fontWeight: 700 }}>10-year workmanship guarantee.</span> We're locally owned, we're not going anywhere, and we stand behind every roof we install.
              </p>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 0
              }}>
                <span style={{ fontWeight: 700 }}>Flexible financing available.</span> We try to meet homeowners where they are to make a roof replacement work for their budget.
              </p>
            </div>

            {/* FINAL CTA BLOCK */}
            <div style={{
              background: PAK_NAVY,
              borderRadius: 20,
              padding: "28px 24px",
              marginBottom: 10
            }}>
              <h2 style={{
                fontSize: 24,
                fontWeight: 800,
                color: "white",
                marginBottom: 8,
                textAlign: "center"
              }}>
                Ready When You Are
              </h2>
              <p style={{
                fontSize: 14,
                color: "#cbd5e1",
                lineHeight: 1.6,
                textAlign: "center",
                marginBottom: 16
              }}>
                Whether you're still researching or ready to have a real conversation about your roof, we're here. No pressure, no pitch. Just straight answers from people who work on these roofs every day.
              </p>
              <button style={{
                width: "100%",
                padding: "18px 24px",
                borderRadius: 12,
                background: PAK_ORANGE,
                color: "white",
                fontWeight: 800,
                fontSize: 17,
                border: "none",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 2px 8px rgba(242,105,45,0.3)",
                marginBottom: 10
              }}>
                <a href="#" style={{ color: "white", textDecoration: "none" }}>
                  Schedule a Consultation
                </a>
              </button>
              <button style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: 12,
                background: "transparent",
                color: "white",
                fontWeight: 700,
                fontSize: 15,
                border: "2px solid white",
                cursor: "pointer"
              }}>
                <a href="#" style={{ color: "white", textDecoration: "none" }}>
                  Try Our Instant Roof Estimator
                </a>
              </button>
            </div>

            {/* DISCLAIMER */}
            <div style={{
              textAlign: "center",
              paddingTop: 20,
              paddingBottom: 20,
              marginBottom: 10
            }}>
              <p style={{
                fontSize: 12,
                color: "#94a3b8",
                margin: 0
              }}>
                Pak Exteriors | pakroofs.com | Locally owned. Licensed and insured. Colorado Roofing Association member. Certified across seven manufacturers.
              </p>
            </div>

            {/* START OVER LINK */}
            <div style={{ textAlign: "center" }}>
              <button
                onClick={resetQuiz}
                style={{
                  background: "none",
                  border: "none",
                  color: PAK_NAVY,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Start Over
              </button>
            </div>

          </div>
        </div>
      );
  }

  // QUESTION SCREEN
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f2f5",
      padding: "32px 16px",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src="/images/logo.png"
            alt="Pak Exteriors Logo"
            style={{ height: 48, objectFit: "contain" }}
          />
        </div>

        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          color: PAK_NAVY,
          marginBottom: 8,
          textAlign: "center"
        }}>
          Repair or Replacement Assessment
        </h1>
        <p style={{
          fontSize: 14,
          color: "#64748b",
          textAlign: "center",
          marginBottom: 24
        }}>
          Expert diagnostic questions to determine your roof's needs
        </p>

        {/* Progress Bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: PAK_ORANGE }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{ background: "#e5e7eb", borderRadius: 9999, height: 8, overflow: "hidden" }}>
            <div
              style={{
                background: PAK_ORANGE,
                height: "100%",
                width: `${progress}%`,
                transition: "width 0.3s ease"
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "24px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          marginBottom: 10
        }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 800,
            color: PAK_NAVY,
            marginBottom: 16,
            textAlign: "center"
          }}>
            {question.question}
          </h2>

          <div>
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  marginBottom: 10,
                  background: "white",
                  border: "2px solid #e5e7eb",
                  borderRadius: 12,
                  fontSize: 14,
                  color: "#475569",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = PAK_ORANGE;
                  e.target.style.background = "#f7f8fa";
                  e.target.style.color = PAK_NAVY;
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.background = "white";
                  e.target.style.color = "#475569";
                }}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {currentQuestion > 0 && (
          <button
            onClick={handleBack}
            style={{
              background: "none",
              border: "none",
              color: "#475569",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              padding: "8px 0",
              textDecoration: "underline"
            }}
          >
            ← Previous Question
          </button>
        )}
      </div>
    </div>
  );
};

export default RoofRepairOrReplacementQuiz;
