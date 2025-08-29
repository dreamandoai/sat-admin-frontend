import type { StudyPlan } from '../types/plan';

export function calculatePlanSummary(plan: StudyPlan) {
  const totalMinutes = { RW: 0, Math: 0 };
  const masteryDistribution = {
    PRIORITY_GAP: 0,
    DEVELOPING: 0,
    PROFICIENT: 0,
    MASTERED: 0,
    UNKNOWN: 0,
  };

  plan.weeks.forEach(week => {
    week.blocks.forEach(block => {
      totalMinutes[block.section] += block.minutes;
      masteryDistribution[block.mastery]++;
    });
  });

  return {
    totalMinutes,
    masteryDistribution,
    totalBlocks: plan.weeks.reduce((sum, week) => sum + week.blocks.length, 0),
  };
}