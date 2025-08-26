import type { StudentProfile, TopicAttempt } from './schemas';

export const mockStudentProfile: StudentProfile = {
  userId: 'demo_user_123',
  name: 'Alex Johnson',
  targetScore: 1450,
  targetTestDateISO: '2025-12-01T00:00:00.000Z',
  sessionLengthMin: 60,
  sectionPriority: { RW: 4, Math: 3 },
  topicPriority: {
    'Standard English Conventions – Punctuation': 5,
    'Linear Equations in 1 Variable': 4,
    'Central Ideas and Details': 3,
  },
  strengths: 'Strong in reading comprehension and basic algebra',
  gaps: 'Needs work on grammar rules and advanced math concepts',
};

export const mockTopicAttempts: TopicAttempt[] = [
  // Priority gaps - need most attention
  {
    userId: 'demo_user_123',
    section: 'RW',
    topic: 'Standard English Conventions – Punctuation',
    mastery: 'PRIORITY_GAP',
    createdAtISO: '2025-08-20T10:00:00.000Z',
  },
  {
    userId: 'demo_user_123',
    section: 'Math',
    topic: 'Systems of 2 Linear Equations in 2 Variables',
    mastery: 'PRIORITY_GAP',
    createdAtISO: '2025-08-20T10:00:00.000Z',
  },
  
  // Developing areas
  {
    userId: 'demo_user_123',
    section: 'RW',
    topic: 'Rhetorical Synthesis',
    mastery: 'DEVELOPING',
    createdAtISO: '2025-08-20T10:00:00.000Z',
  },
  {
    userId: 'demo_user_123',
    section: 'Math',
    topic: 'Linear Equations in 1 Variable',
    mastery: 'DEVELOPING',
    createdAtISO: '2025-08-20T10:00:00.000Z',
  },
  {
    userId: 'demo_user_123',
    section: 'Math',
    topic: 'Nonlinear Functions',
    mastery: 'DEVELOPING',
    createdAtISO: '2025-08-20T10:00:00.000Z',
  },
  
  // Proficient areas
  {
    userId: 'demo_user_123',
    section: 'RW',
    topic: 'Central Ideas and Details',
    mastery: 'PROFICIENT',
    createdAtISO: '2025-08-20T10:00:00.000Z',
  },
  {
    userId: 'demo_user_123',
    section: 'RW',
    topic: 'Inferences',
    mastery: 'PROFICIENT',
    createdAtISO: '2025-08-20T10:00:00.000Z',
  },
  {
    userId: 'demo_user_123',
    section: 'Math',
    topic: 'Percentages',
    mastery: 'PROFICIENT',
    createdAtISO: '2025-08-20T10:00:00.000Z',
  },
  
  // Mastered areas
  {
    userId: 'demo_user_123',
    section: 'RW',
    topic: 'Word in Context',
    mastery: 'MASTERED',
    createdAtISO: '2025-08-20T10:00:00.000Z',
  },
  {
    userId: 'demo_user_123',
    section: 'Math',
    topic: 'Linear Functions',
    mastery: 'MASTERED',
    createdAtISO: '2025-08-20T10:00:00.000Z',
  },
  
  // Unknown areas
  {
    userId: 'demo_user_123',
    section: 'Math',
    topic: 'Probability and Conditional Probability',
    mastery: 'UNKNOWN',
    createdAtISO: '2025-08-20T10:00:00.000Z',
  },
];

export const mockStudents = [
  {
    id: 'student_001',
    name: 'Alex Johnson',
  },
  {
    id: 'student_002',
    name: 'Emma Davis',
  },
  {
    id: 'student_003',
    name: 'Michael Chen',
  },
  {
    id: 'student_004',
    name: 'Sarah Williams',
  },
  {
    id: 'student_005',
    name: 'David Martinez',
  },
  {
    id: 'student_006',
    name: 'Jessica Taylor',
  },
];

export const mockResourceCatalog: Record<string, string[]> = {
  'Standard English Conventions – Punctuation': ['rw-punct-basics', 'rw-punct-advanced'],
  'Linear Equations in 1 Variable': ['math-linear1-intro', 'math-linear1-practice'],
  'Central Ideas and Details': ['rw-main-ideas', 'rw-details-practice'],
  'Rhetorical Synthesis': ['rw-rhetoric-intro', 'rw-synthesis-practice'],
  'Systems of 2 Linear Equations in 2 Variables': ['math-systems-intro', 'math-systems-practice'],
  'Nonlinear Functions': ['math-nonlinear-basics', 'math-nonlinear-advanced'],
  'Inferences': ['rw-inference-strategies', 'rw-inference-practice'],
  'Percentages': ['math-percent-basics', 'math-percent-word-problems'],
  'Word in Context': ['rw-vocab-context', 'rw-vocab-practice'],
  'Linear Functions': ['math-functions-review', 'math-functions-graphs'],
  'Probability and Conditional Probability': ['math-prob-intro', 'math-conditional-prob'],
};