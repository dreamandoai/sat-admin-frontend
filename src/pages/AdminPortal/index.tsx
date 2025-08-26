import { useNavigate } from 'react-router';
import { Card, CardContent } from '../../components/Card';
import Header from '../../layouts/Header';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Brain, 
  FileText,
  BarChart3,
  Clock,
  TrendingUp
} from 'lucide-react';

const AdminPortal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <Header />
        {/* Main Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-primary rounded-lg"
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-card/20 rounded-xl backdrop-blur-sm">
                  <Calendar className="h-8 w-8 text-foreground" />
                </div>
                <BarChart3 className="h-5 w-5 text-foreground/70" />
              </div>
              <h3 className="text-body-large font-medium text-foreground mb-3">
                Class Calendar
              </h3>
              <p className="text-small text-foreground/80 mb-4 leading-relaxed">
                Schedule and manage your SAT prep classes
              </p>
              <div className="flex items-center justify-between">
                <span className="text-small text-foreground/70">
                  8 classes this week
                </span>
                <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-secondary rounded-lg"
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
                Monitor student progress and performance
              </p>
              <div className="flex items-center justify-between">
                <span className="text-small text-foreground/70">
                  24 active students
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
                  45+ resources
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
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-card/30 rounded-xl backdrop-blur-sm">
                  <BarChart3 className="h-8 w-8 text-foreground" />
                </div>
                <TrendingUp className="h-5 w-5 text-foreground/70" />
              </div>
              <h3 className="text-body-large font-medium text-foreground mb-3">
                Analytics
              </h3>
              <p className="text-small text-foreground/80 mb-4 leading-relaxed">
                View performance insights and reports
              </p>
              <div className="flex items-center justify-between">
                <span className="text-small text-foreground/70">
                  Real-time data
                </span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-foreground rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-primary/10 rounded-lg inline-block mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-body-standard font-medium text-foreground mb-1">
                Total Students
              </h4>
              <p className="text-h2 font-bold text-primary">24</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-highlight/20 rounded-lg inline-block mb-3">
                <Calendar className="h-6 w-6 text-foreground" />
              </div>
              <h4 className="text-body-standard font-medium text-foreground mb-1">
                Classes Today
              </h4>
              <p className="text-h2 font-bold text-foreground">3</p>
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
              <p className="text-h2 font-bold text-foreground">12</p>
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
              <p className="text-h2 font-bold text-primary">1420</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminPortal;
