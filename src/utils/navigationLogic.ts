import type { TestSection, TestProgress, DifficultyLevel } from '../types/diagnostic';
import { readingWritingQuestions } from '../data/readingWritingQuestions';
import { mathQuestions } from '../data/mathQuestions';

export const handleRWNavigation = (
  rwProgress: TestProgress,
  isCorrect: boolean,
  setRwProgress: (progress: TestProgress) => void,
  setCurrentScreen: (screen: 'math-intro') => void,
  setTimeRemaining: (time: number) => void,
  setCurrentSection: (section: TestSection) => void,
  setMathProgress: (progress: TestProgress) => void,
  selectedAnswer: number
) => {
  if (!rwProgress.hasAnsweredMedium && rwProgress.currentDifficulty === 'medium') {
    // Just answered medium question, now show hard or easy based on correctness
    setRwProgress({
      ...rwProgress,
      currentDifficulty: isCorrect ? 'hard' : 'easy',
      hasAnsweredMedium: true,
      selectedAnswer,
      isCorrect
    });
  } else {
    // Move to next question type
    const nextTypeIndex = rwProgress.questionTypeIndex + 1;
    
    if (nextTypeIndex >= readingWritingQuestions.length) {
      // Finished Reading & Writing, transition to Math
      setCurrentScreen('math-intro');
    } else {
      // Next question type, start with medium
      setRwProgress({
        questionTypeIndex: nextTypeIndex,
        currentDifficulty: 'medium',
        hasAnsweredMedium: false
      });
    }
  }
};

export const handleMathNavigation = (
  mathProgress: TestProgress,
  isCorrect: boolean,
  setMathProgress: (progress: TestProgress) => void,
  setCurrentScreen: (screen: 'results') => void,
  selectedAnswer: number
) => {
  if (!mathProgress.hasAnsweredMedium && mathProgress.currentDifficulty === 'medium') {
    // Just answered medium question, now show hard or easy based on correctness
    setMathProgress({
      ...mathProgress,
      currentDifficulty: isCorrect ? 'hard' : 'easy',
      hasAnsweredMedium: true,
      selectedAnswer,
      isCorrect
    });
  } else {
    // Move to next question type
    const nextTypeIndex = mathProgress.questionTypeIndex + 1;
    
    if (nextTypeIndex >= mathQuestions.length) {
      // Finished Math section
      setCurrentScreen('results');
    } else {
      // Next question type, start with medium
      setMathProgress({
        questionTypeIndex: nextTypeIndex,
        currentDifficulty: 'medium',
        hasAnsweredMedium: false
      });
    }
  }
};

export const handleRWPrevious = (
  rwProgress: TestProgress,
  setRwProgress: (progress: TestProgress) => void
) => {
  if (rwProgress.hasAnsweredMedium && rwProgress.currentDifficulty !== 'medium') {
    // Go back to medium question of same type
    setRwProgress({
      ...rwProgress,
      currentDifficulty: 'medium',
      hasAnsweredMedium: false
    });
  } else if (rwProgress.questionTypeIndex > 0) {
    // Go back to previous question type
    setRwProgress({
      questionTypeIndex: rwProgress.questionTypeIndex - 1,
      currentDifficulty: 'hard', // Assume we were on the second question
      hasAnsweredMedium: true
    });
  }
};

export const handleMathPrevious = (
  mathProgress: TestProgress,
  setMathProgress: (progress: TestProgress) => void,
  setCurrentSection: (section: TestSection) => void,
  setTimeRemaining: (time: number) => void,
  setRwProgress: (progress: TestProgress) => void
) => {
  if (mathProgress.hasAnsweredMedium && mathProgress.currentDifficulty !== 'medium') {
    // Go back to medium question of same type
    setMathProgress({
      ...mathProgress,
      currentDifficulty: 'medium',
      hasAnsweredMedium: false
    });
  } else if (mathProgress.questionTypeIndex > 0) {
    // Go back to previous question type
    setMathProgress({
      questionTypeIndex: mathProgress.questionTypeIndex - 1,
      currentDifficulty: 'hard', // Assume we were on the second question
      hasAnsweredMedium: true
    });
  } else {
    // Go back to Reading & Writing
    setCurrentSection('reading-writing');
    setTimeRemaining(32 * 60);
    setRwProgress({
      questionTypeIndex: readingWritingQuestions.length - 1,
      currentDifficulty: 'hard',
      hasAnsweredMedium: true
    });
  }
};

export const getProgress = (
  currentSection: TestSection,
  rwProgress: TestProgress,
  mathProgress: TestProgress
) => {
  if (currentSection === 'reading-writing') {
    const questionsAnswered = rwProgress.questionTypeIndex * 2 + (rwProgress.hasAnsweredMedium ? 2 : 1);
    return { current: questionsAnswered, total: 28 };
  } else {
    const questionsAnswered = mathProgress.questionTypeIndex * 2 + (mathProgress.hasAnsweredMedium ? 2 : 1);
    return { current: questionsAnswered, total: 38 };
  }
};

// Helper function to get the current question based on section and progress
export const getCurrentQuestion = (
  currentSection: TestSection,
  rwProgress: TestProgress,
  mathProgress: TestProgress
) => {
  if (currentSection === 'reading-writing') {
    const questionSet = readingWritingQuestions[rwProgress.questionTypeIndex];
    if (!questionSet) return null;
    
    return questionSet[rwProgress.currentDifficulty];
  } else if (currentSection === 'math') {
    const questionSet = mathQuestions[mathProgress.questionTypeIndex];
    if (!questionSet) return null;
    
    return questionSet[mathProgress.currentDifficulty];
  }
  
  return null;
};

// Helper function to check if we can go back
export const canGoBack = (
  currentSection: TestSection,
  rwProgress: TestProgress,
  mathProgress: TestProgress
) => {
  if (currentSection === 'reading-writing') {
    return rwProgress.questionTypeIndex > 0 || 
           (rwProgress.hasAnsweredMedium && rwProgress.currentDifficulty !== 'medium');
  } else if (currentSection === 'math') {
    return mathProgress.questionTypeIndex > 0 || 
           (mathProgress.hasAnsweredMedium && mathProgress.currentDifficulty !== 'medium');
  }
  
  return false;
};

// Helper function to determine if answer is correct
export const isAnswerCorrect = (
  question: any,
  selectedAnswer: number
): boolean => {
  return question && selectedAnswer === question.correctAnswer;
};

// Re-export formatTime from formatters for compatibility
export { formatTime } from './formatters';

// Helper function to get next difficulty based on current performance
export const getNextDifficulty = (
  currentDifficulty: DifficultyLevel,
  isCorrect: boolean,
  hasAnsweredMedium: boolean
): DifficultyLevel => {
  if (currentDifficulty === 'medium') {
    return isCorrect ? 'hard' : 'easy';
  } else if (currentDifficulty === 'easy' && !hasAnsweredMedium) {
    return 'medium';
  } else if (currentDifficulty === 'hard' && !hasAnsweredMedium) {
    return 'medium';
  }
  
  // Stay at current difficulty if already answered medium
  return currentDifficulty;
};