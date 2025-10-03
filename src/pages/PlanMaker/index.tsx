import React from 'react';
import StudyPlanMaker from './StudyPlanMaker';
import Navbar from '../../layouts/Navbar';

const PlanMaker: React.FC = () => {

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <Navbar title="Study Plan Maker" subtitle="Generate personalized SAT study plans" />
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <StudyPlanMaker />
      </div>
    </div>
  );
}

export default PlanMaker;
