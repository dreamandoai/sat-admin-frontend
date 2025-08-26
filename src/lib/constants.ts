export const READING_WRITING_TOPICS = [
  "Central Ideas and Details",
  "Inferences", 
  "Cross Text Connections",
  "Information and Ideas",
  "Overall Structure",
  "Purpose",
  "Command of Evidence – Quantitative",
  "Rhetorical Synthesis",
  "Command of Evidence – Textual",
  "Word in Context",
  "Transitions",
  "Underlined Sentence",
  "Standard English Conventions – Punctuation",
  "Standard English Conventions"
] as const;

export const MATH_TOPICS = [
  "Linear Equations in 1 Variable",
  "Linear Equations in 2 Variables", 
  "Equivalent Expressions",
  "Linear Functions",
  "Linear Inequalities in 1 or 2 Variables",
  "Percentages",
  "Ratios, Rates, Proportional Relationships, and Units",
  "Systems of 2 Linear Equations in 2 Variables",
  "Nonlinear Equations in 1 Variable",
  "Nonlinear Functions",
  "Lines, Angles, Triangles",
  "Circles",
  "Area and Volume Formulas",
  "Right Angle Triangles and Trigonometry",
  "Systems of 2 Equations in 2 Variables",
  "One-variable Data: Distributions and Measures of Center and Spread",
  "Two-variable Data: Models and Scatterplots",
  "Probability and Conditional Probability",
  "Inference from Sample Statistics and Margin of Error"
] as const;

export const ALL_TOPICS = [...READING_WRITING_TOPICS, ...MATH_TOPICS] as const;

export const prescriptions = {
  PRIORITY_GAP: { minutes: 90, items: 16, retestDays: 2 },
  DEVELOPING:   { minutes: 60, items: 12, retestDays: 3 },
  PROFICIENT:   { minutes: 25, items: 8,  retestDays: 7 },
  MASTERED:     { minutes: 15, items: 5,  retestDays: 7 },
  UNKNOWN:      { minutes: 20, items: 6,  retestDays: 7 },
} as const;