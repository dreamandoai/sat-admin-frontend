export interface StudentShort {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
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
