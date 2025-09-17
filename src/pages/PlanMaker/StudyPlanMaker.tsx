import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, AlertCircle } from 'lucide-react';
import { planService } from '../../services/planService';
import { setLoading, setPlan, setTestedStudents } from '../../store/planSlice';
import type { ApiError } from '../../types/api';
import type { RootState } from '../../store';

import PlanControls from './PlanControls';
import WeekAccordion from './WeekAccordion';
import SummaryBar from './SummaryBar';
import ExportButtons from './ExportButtons';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Alert, AlertDescription } from '../../components/Alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs';
import type { PlanRequest } from '../../types/plan';

const StudyPlanMaker: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoading, testedStudents, selectedStudent, plan } = useSelector((state: RootState) => state.plan);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleGetStudents();
    return () => {
      dispatch(setPlan(null));
    }
  }, []);

  const handleGetStudents = async () => {
    try {
      dispatch(setLoading(true));
      const response = await planService.getStudents();
      dispatch(setTestedStudents(response));
    } catch (error: unknown) {
      dispatch(setLoading(false));
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const apiError = error as ApiError;
        setError(apiError.data.detail);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  const handleGeneratePlan = async (request: PlanRequest) => {
    try {
      const response = await planService.generatePlan(request);
      dispatch(setPlan(response));
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const apiError = error as ApiError;
        setError(apiError.data.detail);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  return (
    <div className="space-y-8">
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
      {error && (
        <Alert className="border-red-200 bg-red-50 rounded-lg" variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {isLoading
        ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-3" />
        : testedStudents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <PlanControls 
                  students={testedStudents}
                  onGeneratePlan={handleGeneratePlan}
                />
                <Card className="border-border rounded-lg bg-card">
                  <CardHeader className="bg-accent/30 rounded-t-lg">
                    <CardTitle className="text-body-large font-bold text-foreground">Profile Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h4 className="text-body-standard font-medium text-green-700 mb-2">Strengths</h4>
                      <p className="text-small text-foreground leading-relaxed">{selectedStudent?.strengths}</p>
                    </div>
                    <div>
                      <h4 className="text-body-standard font-medium text-red-700 mb-2">Gaps</h4>
                      <p className="text-small text-foreground leading-relaxed">{selectedStudent?.gaps}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2">
                {plan ? (
                  <Tabs defaultValue="plan" className="w-full">
                    <div className="flex items-center justify-between mb-6">
                      <TabsList className="bg-secondary rounded-lg p-1">
                        <TabsTrigger value="plan" className="rounded-md px-4 py-2 font-medium">Study Plan</TabsTrigger>
                        <TabsTrigger value="summary" className="rounded-md px-4 py-2 font-medium">Summary</TabsTrigger>
                      </TabsList>
                      <ExportButtons plan={plan} />
                    </div>

                    <TabsContent value="plan" className="space-y-6">
                      <SummaryBar plan={plan} />
                      <WeekAccordion plan={plan} />
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
                                    {new Date(plan.meta.generated_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Rules Version:</span>
                                  <span className="font-medium text-foreground">1.0</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Total Weeks:</span>
                                  <span className="font-medium text-foreground">{plan.weeks.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Weekly Cap:</span>
                                  <span className="font-medium text-foreground">{plan.meta.cap_per_week} minutes</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-body-large font-medium text-foreground mb-4">Week Breakdown</h4>
                              <div className="space-y-3">
                                {plan.weeks.map(week => (
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
          ): <div className='text-center'> There are no students for generating a study plan </div>
      }
    </div>
  );
}

export default StudyPlanMaker;