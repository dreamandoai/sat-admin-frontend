import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { CheckCircle, XCircle, Send } from 'lucide-react';
import type { RootState } from '../../store';
import type { DiagnosticResult, Pair } from '../../types/pair';
import { pairService } from '../../services/pairService';
import { setDiagnosticResults } from '../../store/pairSlice';
import type { ApiError } from '../../types/api';

interface StudentProfileCardProps {
  pair: Pair
}

const StudentProfileCard: React.FC<StudentProfileCardProps> = ({ pair }) => {
  const dispatch = useDispatch();
  const [isSendingResults, setIsSendingResults] = React.useState<boolean>(false);
  const { diagnosticResults } = useSelector((state: RootState) => state.pair);
  const mathDiagnosticResults = useMemo(() => diagnosticResults.filter((d: DiagnosticResult) => d.section === "Math"), [diagnosticResults]);
  const rwDiagnosticResults = useMemo(() => diagnosticResults.filter((d: DiagnosticResult) => d.section === "RW"), [diagnosticResults]);

  const getTopicsSummary = (topics: DiagnosticResult[]) => {
    const totalQuestions = topics.length * 2;
    let correctAnswers = 0;
    let difficultyStats = {
      easy: 0,
      medium: 0,
      hard: 0,
    };
    
    topics.forEach(topic => {
      if (topic.medium.correct) correctAnswers++;
      difficultyStats.medium++;
      
      if (topic.follow_up.correct) correctAnswers++;
      difficultyStats[topic.follow_up.level]++;
    });
    
    return { 
      correct: correctAnswers, 
      total: totalQuestions, 
      byDifficulty: difficultyStats,
      topicsCompleted: topics.length
    };
  };

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return '#fcda49';
      case 'medium': return '#3fa3f6';
      case 'hard': return '#00213e';
      default: return '#00213e';
    }
  };

  const getDifficultyIcon = (correct: boolean) => {
    if (correct) {
      return <CheckCircle size={16} color="#10b981" />;
    } else {
      return <XCircle size={16} color="#ef4444" />;
    }
  };

  const handleGetDiagnosticResults = async () => {
    try {
      const response = await pairService.getDiagnosticResults(pair.student.id);
      if (response) {
        dispatch(setDiagnosticResults(response));
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Failed to fetch diagnostic results:", apiError.message);
    }
  };

  const handleSendResults = async () => {
    setIsSendingResults(true);
    try {
      await pairService.shareStudentResultsWithTeacher({
        student: pair.student.id,
        teachers: [pair.math_teacher_id, pair.rw_teacher_id].filter(Boolean) as string[]
      });
      setIsSendingResults(false);
    } catch (error) {
      setIsSendingResults(false);
      const apiError = error as ApiError;
      console.error("Failed to send results to teachers:", apiError.message);
    }
  };

  useEffect(() => {
    handleGetDiagnosticResults();
  }, []);

  return (
    <Card className="bg-card border-border rounded-lg shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-h1 font-bold text-foreground">
          Student Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Student Basic Info */}
        <div className="text-center">
          <h3 className="text-h3 font-bold text-foreground mb-1">
            {pair.student.first_name} {pair.student.last_name}
          </h3>
          <p className="text-body-standard text-muted-foreground">
            {pair.student.email}
          </p>
        </div>
        {/* Diagnostic Test Results */}
        <div className="space-y-4">
          <h4 className="text-body-large font-medium text-foreground">
            Diagnostic Test Results
          </h4>
          
          <div className="p-4 rounded-lg bg-secondary/30">
            {/* Test Date */}
            <div className="text-center mb-4">
              <p className="text-body-standard text-foreground mb-2">
                Test completed on {new Date(pair.student.tested_date).toLocaleDateString()}
              </p>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center bg-card p-3 rounded-lg">
                <p className="text-body-standard font-medium text-foreground mb-1">
                  Math: {getTopicsSummary(mathDiagnosticResults).correct}/{getTopicsSummary(mathDiagnosticResults).total}
                </p>
                <p className="text-small text-muted-foreground">
                  {mathDiagnosticResults.length} topics • {mathDiagnosticResults.length * 2} questions
                </p>
              </div>
              <div className="text-center bg-card p-3 rounded-lg">
                <p className="text-body-standard font-medium text-foreground mb-1">
                  English: {getTopicsSummary(rwDiagnosticResults).correct}/{getTopicsSummary(rwDiagnosticResults).total}
                </p>
                <p className="text-small text-muted-foreground">
                  {rwDiagnosticResults.length} topics • {rwDiagnosticResults.length * 2} questions
                </p>
              </div>
            </div>

            {/* Send Results Button */}
            <Button
              onClick={handleSendResults}
              disabled={isSendingResults || (!pair.math_teacher_id && !pair.rw_teacher_id)}
              className="w-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-4 bg-highlight hover:bg-highlight/90 text-highlight-foreground rounded-lg"
            >
              {isSendingResults ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Sending Results...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Results to Teachers
                </>
              )}
            </Button>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-small mb-4 text-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-highlight"></div>
                <span>Easy</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-foreground"></div>
                <span>Hard</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={12} color="#10b981" />
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle size={12} color="#ef4444" />
                <span>Incorrect</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Math Topics - Always Visible */}
              <div className="bg-card p-4 rounded-lg">
                <h5 className="text-body-standard font-medium text-foreground mb-3">
                  MATH TOPICS ({mathDiagnosticResults.length} topics • {mathDiagnosticResults.length * 2} questions)
                </h5>
                <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                  {mathDiagnosticResults.map((topic, index) => (
                    <div key={index} className="border border-border rounded-lg p-3 space-y-2">
                      {/* Topic Name */}
                      <h6 className="text-small font-medium text-foreground mb-2">
                        {topic.topic_name}
                      </h6>
                      
                      {/* Question 1: Medium */}
                      <div 
                        className="flex items-center justify-between p-2 bg-muted/30 rounded border-l-4" 
                        style={{ borderLeftColor: topic.medium.correct ? '#10b981' : '#ef4444' }}>
                        <span className="text-small text-foreground flex-1">
                          Question 1 (Medium)
                        </span>
                        <div className="flex items-center gap-2">
                          <span 
                            className="px-2 py-1 rounded-full text-white font-medium text-xs"
                            style={{ 
                              backgroundColor: getDifficultyColor('medium')
                            }}
                          >
                            MEDIUM
                          </span>
                          <div className="flex items-center gap-1">
                            {getDifficultyIcon(topic.medium.correct)}
                            <span className="text-xs font-medium" style={{ 
                              color: topic.medium.correct ? '#10b981' : '#ef4444'
                            }}>
                              {topic.medium.correct ? 'CORRECT' : 'INCORRECT'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Question 2: Follow-up (Hard or Easy) */}
                      <div className="flex items-center justify-between p-2 bg-muted/30 rounded border-l-4" style={{ borderLeftColor: topic.follow_up.correct ? '#10b981' : '#ef4444' }}>
                        <span className="text-small text-foreground flex-1">
                          Question 2 ({topic.follow_up.level === "easy" ? "Easy" : "Hard"})
                        </span>
                        <div className="flex items-center gap-2">
                          <span 
                            className="px-2 py-1 rounded-full text-white font-medium text-xs"
                            style={{ 
                              backgroundColor: getDifficultyColor(topic.follow_up.level)
                            }}
                          >
                            {topic.follow_up.level.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-1">
                            {getDifficultyIcon(topic.follow_up.correct)}
                            <span className="text-xs font-medium" style={{ 
                              color: topic.follow_up.correct ? '#10b981' : '#ef4444'
                            }}>
                              {topic.follow_up.correct ? 'CORRECT' : 'INCORRECT'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* English Topics - Always Visible */}
              <div className="bg-card p-4 rounded-lg">
                <h5 className="text-body-standard font-medium text-foreground mb-3">
                  ENGLISH TOPICS ({rwDiagnosticResults.length} topics • {rwDiagnosticResults.length * 2} questions)
                </h5>
                <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                  {rwDiagnosticResults.map((topic, index) => (
                    <div key={index} className="border border-border rounded-lg p-3 space-y-2">
                      {/* Topic Name */}
                      <h6 className="text-small font-medium text-foreground mb-2">
                        {topic.topic_name}
                      </h6>
                      
                      {/* Question 1: Medium */}
                      <div className="flex items-center justify-between p-2 bg-muted/30 rounded border-l-4" style={{ borderLeftColor: topic.medium.correct ? '#10b981' : '#ef4444' }}>
                        <span className="text-small text-foreground flex-1">
                          Question 1 (Medium)
                        </span>
                        <div className="flex items-center gap-2">
                          <span 
                            className="px-2 py-1 rounded-full text-white font-medium text-xs"
                            style={{ 
                              backgroundColor: getDifficultyColor('medium')
                            }}
                          >
                            MEDIUM
                          </span>
                          <div className="flex items-center gap-1">
                            {getDifficultyIcon(topic.medium.correct)}
                            <span className="text-xs font-medium" style={{ 
                              color: topic.medium.correct ? '#10b981' : '#ef4444'
                            }}>
                              {topic.medium.correct ? 'CORRECT' : 'INCORRECT'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Question 2: Follow-up (Hard or Easy) */}
                      <div className="flex items-center justify-between p-2 bg-muted/30 rounded border-l-4" style={{ borderLeftColor: topic.follow_up.correct ? '#10b981' : '#ef4444' }}>
                        <span className="text-small text-foreground flex-1">
                          Question 2 ({topic.follow_up.level === "easy" ? "Easy" : "Hard"})
                        </span>
                        <div className="flex items-center gap-2">
                          <span 
                            className="px-2 py-1 rounded-full text-white font-medium text-xs"
                            style={{ 
                              backgroundColor: getDifficultyColor(topic.follow_up.level)
                            }}
                          >
                            {topic.follow_up.level.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-1">
                            {getDifficultyIcon(topic.follow_up.correct)}
                            <span className="text-xs font-medium" style={{ 
                              color: topic.follow_up.correct ? '#10b981' : '#ef4444'
                            }}>
                              {topic.follow_up.correct ? 'CORRECT' : 'INCORRECT'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StudentProfileCard