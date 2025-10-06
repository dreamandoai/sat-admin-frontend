import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Card, CardContent } from '../../components/Card';
import Header from '../../layouts/Header';
import { studentsInfoService } from '../../services/studentsInfoService';
import { 
  UserCog, 
  Users, 
  BookOpen, 
  Brain, 
  FileText,
  BarChart3,
  Clock,
  TrendingUp,
  Loader2,
  UserCircle
} from 'lucide-react';
import { setStudentsInfo, setNumberOfTeachers } from '../../store/studentsInfoSlice';
import type { ApiError } from '../../types/api';

const AdminPortal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    numberOfStudents, 
    averageScore, 
    numberOfStudyPlans, 
    numberOfTestedStudents,
    numberOfTeachers
  } = useSelector((state: RootState) => state.studentsInfo);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  

  const handleGetStudentsInfo = async () => {
    setIsLoading(true);
    try {
      const response = await studentsInfoService.getStudentsInfo();
      const teachersResponse = await studentsInfoService.getNumberOfTeachers();
      dispatch(setNumberOfTeachers(teachersResponse));
      dispatch(setStudentsInfo(response));
      setIsLoading(false);
    } catch (error: unknown) {
      setIsLoading(false);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const apiError = error as ApiError;
        console.error('Error fetching students info:', apiError.data.detail);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  useEffect(() => {
    handleGetStudentsInfo();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <Header />
        {/* Main Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-secondary rounded-lg"
            onClick={() => navigate("/students")}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-card/30 rounded-xl backdrop-blur-sm">
                  <Users className="h-8 w-8 text-foreground" />
                </div>
                <TrendingUp className="h-5 w-5 text-foreground/70" />
              </div>
              <h3 className="text-body-large font-medium text-foreground mb-3">
                Students
              </h3>
              <p className="text-small text-foreground/80 mb-4 leading-relaxed">
                Assign teachers and view diagnostic results
              </p>
              <div className="flex items-center justify-between">
                <span className="text-small text-foreground/70">
                  {`${numberOfTestedStudents || 0} active students`}
                </span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="w-2 h-2 bg-highlight rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-card rounded-lg"
            onClick={() => navigate("/resources")}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-card/30 rounded-xl backdrop-blur-sm">
                  <BookOpen className="h-8 w-8 text-foreground" />
                </div>
                <Clock className="h-5 w-5 text-foreground/70" />
              </div>
              <h3 className="text-body-large font-medium text-foreground mb-3">
                SAT Resources
              </h3>
              <p className="text-small text-foreground/80 mb-4 leading-relaxed">
                Access teaching materials and practice tests
              </p>
              <div className="flex items-center justify-between">
                <span className="text-small text-foreground/70">
                  ✨ Click to open
                </span>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-primary rounded-lg"
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-card/20 rounded-xl backdrop-blur-sm">
                  <Brain className="h-8 w-8 text-foreground" />
                </div>
                <TrendingUp className="h-5 w-5 text-foreground/70" />
              </div>
              <h3 className="text-body-large font-medium text-foreground mb-3">
                SAT AI
              </h3>
              <p className="text-small text-foreground/80 mb-4 leading-relaxed">
                AI-powered tutoring and analysis tools
              </p>
              <div className="flex items-center justify-between">
                <span className="text-small text-foreground/70">
                  Smart insights
                </span>
                <div className="w-2 h-2 bg-highlight rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-secondary rounded-lg"
            onClick={() => navigate("/planner")}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-card/30 rounded-xl backdrop-blur-sm">
                  <FileText className="h-8 w-8 text-foreground" />
                </div>
                <BarChart3 className="h-5 w-5 text-foreground/70" />
              </div>
              <h3 className="text-body-large font-medium text-foreground mb-3">
                Study Plan Maker
              </h3>
              <p className="text-small text-foreground/80 mb-4 leading-relaxed">
                Generate personalized study plans
              </p>
              <div className="flex items-center justify-between">
                <span className="text-small text-foreground/70">
                  ✨ Click to open
                </span>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-card rounded-lg"
            onClick={() => navigate('/ai-access')}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-card/30 rounded-xl backdrop-blur-sm">
                  <UserCog className="h-8 w-8 text-foreground" />
                </div>
                <Users className="h-5 w-5 text-foreground/70" />
              </div>
              <h3 className="text-body-large font-medium text-foreground mb-3">
                SAT AI Access
              </h3>
              <p className="text-small text-foreground/80 mb-4 leading-relaxed">
                Manage user access to SAT AI features
              </p>
              <div className="flex items-center justify-between">
                <span className="text-small text-foreground/70">
                  ✨ Click to open
                </span>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-primary rounded-lg"
            onClick={() => navigate('/user-directory')}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-card/20 rounded-xl backdrop-blur-sm">
                  <UserCircle className="h-8 w-8 text-foreground" />
                </div>
                <TrendingUp className="h-5 w-5 text-foreground/70" />
              </div>
              <h3 className="text-body-large font-medium text-foreground mb-3">
                User Directory
              </h3>
              <p className="text-small text-foreground/80 mb-4 leading-relaxed">
                View registered students and teachers
              </p>
              <div className="flex items-center justify-between">
                <span className="text-small text-foreground/70">
                  {(numberOfTeachers || 0) + (numberOfStudents || 0)} total users
                </span>
                <div className="w-2 h-2 bg-highlight rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-primary/10 rounded-lg inline-block mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-body-standard font-medium text-foreground mb-1">
                Total Students
              </h4>
              <p className="text-h2 font-bold text-primary">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                ) : (
                  numberOfStudents || 0
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-secondary/50 rounded-lg inline-block mb-3">
                <FileText className="h-6 w-6 text-foreground" />
              </div>
              <h4 className="text-body-standard font-medium text-foreground mb-1">
                Study Plans
              </h4>
              <p className="text-h2 font-bold text-primary">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                ) : (
                  numberOfStudyPlans || 0
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-primary/10 rounded-lg inline-block mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-body-standard font-medium text-foreground mb-1">
                Avg. Score
              </h4>
              <p className="text-h2 font-bold text-primary">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                ) : (
                  Math.round(averageScore || 0)
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminPortal;
