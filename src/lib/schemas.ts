import { z } from 'zod';
import { ALL_TOPICS, READING_WRITING_TOPICS, MATH_TOPICS } from './constants';

export const SectionSchema = z.enum(['RW', 'Math']);
export type Section = z.infer<typeof SectionSchema>;

export const MasterySchema = z.enum(['MASTERED', 'PROFICIENT', 'DEVELOPING', 'PRIORITY_GAP', 'UNKNOWN']);
export type Mastery = z.infer<typeof MasterySchema>;

export const TopicSchema = z.enum(ALL_TOPICS as any);
export type Topic = z.infer<typeof TopicSchema>;

export const PrioritySchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);
export type Priority = z.infer<typeof PrioritySchema>;

export const StudentProfileSchema = z.object({
  userId: z.string(),
  name: z.string(),
  targetScore: z.number().nullable(),
  targetTestDateISO: z.string().nullable(),
  sessionLengthMin: z.number(),
  sectionPriority: z.object({
    RW: PrioritySchema,
    Math: PrioritySchema,
  }),
  topicPriority: z.record(z.string(), PrioritySchema),
  strengths: z.string(),
  gaps: z.string(),
});
export type StudentProfile = z.infer<typeof StudentProfileSchema>;

export const TopicAttemptSchema = z.object({
  userId: z.string(),
  section: SectionSchema,
  topic: TopicSchema,
  mastery: MasterySchema,
  createdAtISO: z.string(),
});
export type TopicAttempt = z.infer<typeof TopicAttemptSchema>;

export const PlanBlockSchema = z.object({
  section: SectionSchema,
  topic: TopicSchema,
  mastery: MasterySchema,
  minutes: z.number(),
  practiceItems: z.number(),
  resourceSlugs: z.array(z.string()),
  dueDateISO: z.string(),
  goal: z.string(),
});
export type PlanBlock = z.infer<typeof PlanBlockSchema>;

export const StudyPlanSchema = z.object({
  userId: z.string(),
  weeks: z.array(z.object({
    week: z.number(),
    blocks: z.array(PlanBlockSchema),
  })),
  meta: z.object({
    generatedAtISO: z.string(),
    capMinutesPerWeek: z.number(),
    rulesVersion: z.literal('v1.0'),
    studentName: z.string().optional(),
  }),
});
export type StudyPlan = z.infer<typeof StudyPlanSchema>;

export const GeneratePlanRequestSchema = z.object({
  userId: z.string(),
  startDateISO: z.string(),
  weeks: z.number().optional().default(3),
  capPerWeek: z.number().optional().default(360),
  sectionSplit: z.object({
    RW: z.number(),
    Math: z.number(),
  }).optional().default({ RW: 0.5, Math: 0.5 }),
});
export type GeneratePlanRequest = z.infer<typeof GeneratePlanRequestSchema>;

// Helper function to validate topics
export function validateTopic(topic: string): topic is Topic {
  return ALL_TOPICS.includes(topic as any);
}

export function getTopicSection(topic: Topic): Section {
  if (READING_WRITING_TOPICS.includes(topic as any)) return 'RW';
  if (MATH_TOPICS.includes(topic as any)) return 'Math';
  throw new Error(`Unknown topic: ${topic}`);
}