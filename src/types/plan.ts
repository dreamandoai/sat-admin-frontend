export interface StudentProfile {
  id: string;
  first_name: string;
  last_name: string;
  section_priority: {
    RW: number,
    Math: number
  },
  session_length_min: number;
  strengths?: string;
  gaps?: string;
}

export interface PlanBlock {
  section: "RW"| "Math";
  topic_id: string;
  topic: string;
  mastery: 'MASTERED' | 'PROFICIENT' | 'DEVELOPING' | 'PRIORITY_GAP' | 'UNKNOWN';
  minutes: number;
  practice_items: number;
  resource_slugs?: string[];
  due_date: string;
  goal: string;
}

export interface StudyPlan {
  userId: string;
  weeks: {
    week: number;
    blocks: PlanBlock[];
  }[];
  meta: {
    generated_at: string;
    cap_per_week: number;
    student_name?: string;
  };
}

export interface PlanRequest {
  student_id: string;
  start_date: string;
  weeks: number;
  cap_per_week: number;
  section_split: { RW: number; Math: number };
}