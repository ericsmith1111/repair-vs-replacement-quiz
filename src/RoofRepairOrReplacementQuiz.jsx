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
                Real Pricing
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
                Material Options
              </h3>

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
                  Impact-resistant shingles meet UL 2218 standards and provide superior protection against hail and wind damage common in Colorado. Class 3 and Class 4 ratings indicate the level of impact resistance.
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
                  Steel roofing with stone aggregate coating offers the durability of metal with the aesthetic appeal of traditional shingles. Excellent for Colorado's extreme weather conditions.
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
                  Premium metal roofing with vertical seams for maximum weather protection and modern aesthetics. Ideal for mountain areas and contemporary homes.
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
                  Engineered materials that mimic the look of premium slate or wood shake with superior durability and weather resistance. Great for homeowners seeking distinctive aesthetics without maintenance hassles.
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
                  Traditional tile roofing offers exceptional longevity (50+ years) and distinctive character. Requires specialized installation and structural assessment due to weight.
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
                  Premium asphalt shingles with enhanced aesthetics and improved durability. Offers a middle ground between standard asphalt and metal or composite options.
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
                Your roof's primary job is obvious—keep the weather out. But its second job is equally critical: manage the air and moisture that naturally accumulates in your attic. Proper roof ventilation is how you prevent expensive problems that develop over years inside your home, where you can't see them.
              </p>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                Many roofing contractors focus only on the visible part of the installation—the shingles and flashing. They skip or shortcut the ventilation system. Your roof looks fine, so you don't notice. But inside, moisture is accumulating, and mold is beginning to grow. Two or three years later, you're dealing with wood rot, structural damage, and an expensive nightmare.
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
                marginBottom: 16
              }}>
                A properly ventilated attic maintains a temperature and humidity level that keeps your shingles healthier and your home structurally sound. Ventilation brings in fresh air through soffit vents (under the eaves) and lets warm, moist air escape through ridge vents (at the peak). This continuous air exchange reduces the lifespan-killing effects of heat buildup and prevents moisture accumulation.
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
                Without proper ventilation, warm moist air from your home (from showers, cooking, laundry, even respiration) rises into the attic. When it hits cold surfaces—especially in winter or at night—it condenses into liquid water. That water soaks into insulation, rots wood, and provides the perfect breeding ground for mold. Mold compromises both your health and your home's structural integrity.
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
                Poor attic ventilation and insulation lead to uneven roof temperatures. When your attic stays warmer than it should, snow melts unevenly on your roof. Water runs down and refreezes at the cold eaves, creating ice dams. Ice dams cause water to back up under your shingles and leak into your home. Proper ventilation keeps your attic cooler, preventing this cycle.
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
                An overheated attic in summer forces your air conditioning system to work harder to cool your home. Proper ventilation exhausts that heat before it radiates down through your ceiling. In winter, a well-ventilated attic keeps cold air from being pushed into your living spaces. Both effects reduce your energy costs.
              </p>

              <h4 style={{
                fontSize: 15,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 12
              }}>
                My Ventilation Has Been Fine for Years. Why Can't I Just Keep What I Have?
              </h4>
              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                Your old ventilation system may have been adequate for your old roof, but it was designed for different materials, different weather exposure, and different home insulation levels. Modern building codes and best practices have evolved. A new roof is your opportunity to install a ventilation system that actually matches your home's current configuration, not one based on what worked 20 years ago.
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
                Most contractors size ventilation based on attic square footage alone. But Colorado's mountain areas require different calculations than the Front Range. Wind speeds, temperature swings, snow load, UV intensity—all these factors require adjustments. A contractor who doesn't account for your specific climate zone is gambling with your roof.
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
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                    <span style={{ fontWeight: 800, marginRight: 8 }}>•</span>
                    Undersized ridge vents (homeowners worry about leaks, so contractors install small vents that don't work)
                  </li>
                  <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                    <span style={{ fontWeight: 800, marginRight: 8 }}>•</span>
                    Blocked or insufficient soffit vents (can't pull air in if there's nowhere to pull from)
                  </li>
                  <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                    <span style={{ fontWeight: 800, marginRight: 8 }}>•</span>
                    Attic fans installed without proper intake (pulls in from your living space, costs you money on heating/cooling)
                  </li>
                  <li style={{ fontSize: 14, color: "#475569", marginBottom: 8 }}>
                    <span style={{ fontWeight: 800, marginRight: 8 }}>•</span>
                    Ventilation not designed for your roof pitch or attic layout
                  </li>
                  <li style={{ fontSize: 14, color: "#475569" }}>
                    <span style={{ fontWeight: 800, marginRight: 8 }}>•</span>
                    Ductwork from bathroom or dryer vented into the attic instead of outside (adds moisture and defeats ventilation)
                  </li>
                </ul>
              </div>

              <h4 style={{
                fontSize: 15,
                fontWeight: 800,
                color: PAK_NAVY,
                marginBottom: 12
              }}>
                How We Handle Ventilation (Two-Stage Design)
              </h4>

              <div style={{ marginBottom: 16 }}>
                <h5 style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Stage 1: Assessment and Calculation
                </h5>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  We inspect your current attic conditions, measure your roof area, assess your climate zone (mountain or Front Range), and calculate the exact ventilation requirements. We verify that your soffit and ridge vents can work together effectively given your roof geometry.
                </p>
              </div>

              <div>
                <h5 style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: PAK_NAVY,
                  marginBottom: 8
                }}>
                  Stage 2: Installation with Quality Materials
                </h5>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  We install properly sized ridge vents and soffit vents using materials rated for your climate. We ensure all vents are unobstructed, properly sealed to prevent water penetration, and designed to work together as a system. If you have any ductwork venting into the attic, we relocate it to the exterior to prevent moisture problems.
                </p>
              </div>
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
                A Roof Is a System
              </h3>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                A roof isn't just shingles. It's a system of materials and techniques—underlayment, flashing, ventilation, insulation, structural support—that work together. Install great shingles on a roof with poor ventilation and inadequate flashing, and you'll still have problems.
              </p>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                When we design a roof replacement, we treat it as a complete system. We assess every component, not just what's visible. We recommend materials and techniques that work together for your climate and your home's specific conditions.
              </p>

              <p style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.7,
                marginBottom: 12
              }}>
                Once your new roof is installed, we assign you a dedicated construction manager who oversees the project and handles any questions or issues. That person is your single point of contact through the entire process. They're not a salesperson—they're responsible for making sure your roof is built right.
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
                  <span style={{ fontWeight: 700 }}>Your dedicated construction manager</span> will be your main contact from contract signature through final walkthrough and beyond. One person, known to you, responsible for your roof.
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
                What to Look for in a Contractor
              </h3>

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
                  If a contractor talks only about shingles and flashing, they're not thinking about your complete system. Ask them how they'll assess and design your roof's ventilation. If they can't explain it clearly, move on.
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
                  A contractor certified by multiple manufacturers is more likely to recommend based on what's best for your home, not brand loyalty or commission rates.
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
                  You should know exactly what's included in your contract and what it costs. No surprises mid-project because "we found more damage." Legitimate changes to scope happen, but they should be documented in writing with updated pricing before work begins.
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
                  A contractor based in your region understands local climate challenges, code requirements, and typical home configurations. That knowledge is part of why you're hiring them.
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
                  Ask to see proof of liability insurance and workers' compensation coverage. Call their insurance company directly to verify the policy is active. This protects you if someone is injured on your property.
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
                  A warranty is only as good as the company backing it. Work with an established local contractor you can reach in 5 years when you need warranty service, not a fly-by-night outfit that moves on to the next town.
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

              <div style={{ marginBottom: 16 }}>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  marginBottom: 0
                }}>
                  <span style={{ fontWeight: 700 }}>We're local.</span> Pak Exteriors has been serving Colorado homes for over a decade. We know the climate. We know the codes. We know what works here, because we live here.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  marginBottom: 0
                }}>
                  <span style={{ fontWeight: 700 }}>We're transparent about pricing.</span> We publish our pricing online. We don't hide numbers behind a consultation. You can see exactly what a roof costs and why. That doesn't mean there are no variables—there always are—but you understand the pricing framework before we ever meet.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  marginBottom: 0
                }}>
                  <span style={{ fontWeight: 700 }}>We design for your climate.</span> A roof that works in Florida doesn't work in a Colorado mountain pass. We account for your elevation, your snow load, your wind exposure, your hail risk, and your UV intensity. That's not standard for every contractor. It's non-negotiable for us.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  marginBottom: 0
                }}>
                  <span style={{ fontWeight: 700 }}>We handle ventilation properly.</span> Most contractors skip it. We don't. A well-ventilated roof lasts longer, performs better, and protects your home's structure.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  marginBottom: 0
                }}>
                  <span style={{ fontWeight: 700 }}>We're certified across multiple manufacturers.</span> We don't have a favorite. We have the skills to install any major roofing material at a high standard. We recommend based on what makes sense for your home.
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  marginBottom: 0
                }}>
                  <span style={{ fontWeight: 700 }}>We back it up with a 10-year workmanship guarantee.</span> We stand behind our work. That guarantee isn't just a certificate—it's a commitment. We're here, we're local, and we'll honor it.
                </p>
              </div>

              <div style={{ marginBottom: 0 }}>
                <p style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.7,
                  marginBottom: 0
                }}>
                  <span style={{ fontWeight: 700 }}>You get a dedicated construction manager.</span> One person handles your entire project. Not a salesperson who disappears after signing. Not a rotating crew. One experienced person responsible for your roof from start to finish and beyond.
                </p>
              </div>
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
