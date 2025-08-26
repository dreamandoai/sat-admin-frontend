import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Alert, AlertDescription } from '../../components/Alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs';
import PlanControls from './PlanControls';
import WeekAccordion from './WeekAccordion';
import SummaryBar from './SummaryBar';
import ExportButtons from './ExportButtons';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { composePlan } from '../../lib/planComposer';
import type { StudyPlan } from '../../lib/schemas';
import { mockStudentProfile, mockTopicAttempts, mockResourceCatalog } from '../../lib/mockData';

const StudyPlanMaker: React.FC = () => {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async (config: {
    startDate: string;
    weeks: number;
    capPerWeek: number;
    sectionSplit: { RW: number; Math: number };
    studentInfo: {
      studentId: string;
      studentName: string;
    };
  }) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const plan = composePlan(
        config.studentInfo.studentId,
        mockTopicAttempts,
        config.startDate,
        config.weeks,
        config.capPerWeek,
        config.sectionSplit,
        mockStudentProfile.sectionPriority,
        mockStudentProfile.topicPriority,
        mockResourceCatalog
      );
      
      // Update the plan with student name
      plan.meta.studentName = config.studentInfo.studentName;
      
      setStudyPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate study plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateDemo = () => {
    handleGeneratePlan({
      startDate: new Date().toISOString(),
      weeks: 3,
      capPerWeek: 360,
      sectionSplit: { RW: 0.5, Math: 0.5 },
      studentInfo: {
        studentId: 'demo_student',
        studentName: 'Demo Student',
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-h1 font-bold text-foreground">
            SAT Study Plan Maker
          </h1>
        </div>
      </div>

      {/* Demo Button */}
      {!studyPlan && (
        <div className="text-center">
          <Button 
            onClick={handleGenerateDemo} 
            className="btn-primary bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg gap-3"
          >
            <Sparkles className="h-5 w-5" />
            Generate Demo Plan
          </Button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50 rounded-lg" variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Controls */}
        <div className="lg:col-span-1 space-y-6">
          <PlanControls 
            profile={mockStudentProfile}
            onGeneratePlan={handleGeneratePlan}
            isGenerating={isGenerating}
          />

          {/* Student Strengths & Gaps */}
          <Card className="border-border rounded-lg bg-card">
            <CardHeader className="bg-accent/30 rounded-t-lg">
              <CardTitle className="text-body-large font-bold text-foreground">Profile Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h4 className="text-body-standard font-medium text-green-700 mb-2">Strengths</h4>
                <p className="text-small text-foreground leading-relaxed">{mockStudentProfile.strengths}</p>
              </div>
              <div>
                <h4 className="text-body-standard font-medium text-red-700 mb-2">Gaps</h4>
                <p className="text-small text-foreground leading-relaxed">{mockStudentProfile.gaps}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Plan Display */}
        <div className="lg:col-span-2">
          {studyPlan ? (
            <Tabs defaultValue="plan" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-secondary rounded-lg p-1">
                  <TabsTrigger value="plan" className="rounded-md px-4 py-2 font-medium">Study Plan</TabsTrigger>
                  <TabsTrigger value="summary" className="rounded-md px-4 py-2 font-medium">Summary</TabsTrigger>
                </TabsList>
                <ExportButtons plan={studyPlan} />
              </div>

              <TabsContent value="plan" className="space-y-6">
                <SummaryBar plan={studyPlan} />
                <WeekAccordion plan={studyPlan} />
              </TabsContent>

              <TabsContent value="summary">
                <Card className="border-border rounded-lg bg-card">
                  <CardHeader className="bg-secondary/30 rounded-t-lg">
                    <CardTitle className="text-h2 font-bold text-foreground">Plan Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-body-large font-medium text-foreground mb-4">Plan Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-body-standard">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Generated:</span>
                            <span className="font-medium text-foreground">
                              {new Date(studyPlan.meta.generatedAtISO).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rules Version:</span>
                            <span className="font-medium text-foreground">{studyPlan.meta.rulesVersion}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Weeks:</span>
                            <span className="font-medium text-foreground">{studyPlan.weeks.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Weekly Cap:</span>
                            <span className="font-medium text-foreground">{studyPlan.meta.capMinutesPerWeek} minutes</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-body-large font-medium text-foreground mb-4">Week Breakdown</h4>
                        <div className="space-y-3">
                          {studyPlan.weeks.map(week => (
                            <div key={week.week} className="flex justify-between items-center text-body-standard p-4 bg-muted/30 rounded-lg">
                              <span className="font-medium text-foreground">Week {week.week}</span>
                              <span className="text-muted-foreground">{week.blocks.length} topics</span>
                              <span className="font-medium text-primary">{week.blocks.reduce((sum, b) => sum + b.minutes, 0)} minutes</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-96 flex items-center justify-center border-border rounded-lg bg-card">
              <CardContent className="text-center">
                <div className="p-4 bg-muted/20 rounded-lg mb-6 inline-block">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
                </div>
                <h3 className="text-h3 font-bold text-foreground mb-3">No Study Plan Generated</h3>
                <p className="text-body-standard text-muted-foreground max-w-md">
                  Configure your preferences and generate a personalized study plan to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudyPlanMaker;