export interface RegisteredTeacher{
  id: string
  first_name: string
  last_name: string
  email: string
  subject: 'Math' | 'RW'
  calendar_link: string
  students_count: number
  joined_at: string
}

export interface RegisteredStudent{
  id: string
  first_name: string
  last_name: string
  email: string
  is_tested: boolean
  joined_at: string
}