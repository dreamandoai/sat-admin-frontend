import React, { useCallback } from 'react';
import { Button } from "../../components/Button";
import { LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router';
import StudyPlanMaker from './StudyPlanMaker';

const PlanMaker: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    authService.logout();
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              className="bg-card border-border hover:bg-secondary/50 text-foreground rounded-lg"
            >
              ← Back to Dashboard
            </Button>
            <div>
              <h1 className="text-foreground">Study Plan Maker</h1>
              <p className="text-foreground mt-2">Generate personalized SAT study plans</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-card border-border hover:bg-secondary/50 text-foreground rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        <StudyPlanMaker />
      </div>
    </div>
  );
}

export default PlanMaker;
