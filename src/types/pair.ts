export interface StudentShort {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  tested_date: string;
}

export interface Pair {
  student: StudentShort;
  math_teacher_id: string | null;
  rw_teacher_id: string | null;
}

export interface TeacherShort {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  calendar_name: string;
  subject: 'Math' | 'RW';
}

export interface GeneratePairRequest {
  student_id: string,
  rw_teacher_id: string | null,
  math_teacher_id: string | null
}

export interface DiagnosticResult {
  topic_id: string,
  topic_name: string,
  section: "RW" | "Math",
  student_id: string,
  medium: {
    correct: boolean,
    time_sec: number
  },
  follow_up: {
    level: "easy" | "medium" | "hard",
    correct: boolean,
    time_sec: number
  },
  mastery: "PRIORITY_GAP" | "DEVELOPING" | "PROFICIENT" | "MASTERED" | "UNKNOWN",
}