import dayjs from 'dayjs';
import type { TopicAttempt, StudyPlan, PlanBlock, Mastery, Priority } from './schemas';
import { prescriptions } from './constants';

export function shortGoal(topic: string, mastery: Mastery): string {
  const goals = {
    PRIORITY_GAP: `Rebuild foundation in ${topic} with scaffolded drills`,
    DEVELOPING:   `Tighten concepts in ${topic} using worked examples`,
    PROFICIENT:   `Light review + mixed practice for ${topic}`,
    MASTERED:     `Spaced retrieval to cement ${topic}`,
    UNKNOWN:      `Sample ${topic} to assess level`,
  } as const;
  return goals[mastery];
}

export function composePlan(
  userId: string,
  attempts: TopicAttempt[],
  startDateISO: string,
  weeks = 3,
  capPerWeek = 360,
  sectionSplit = { RW: 0.5, Math: 0.5 },
  sectionPriority = { RW: 3 as Priority, Math: 3 as Priority },
  topicPriority: Record<string, Priority> = {},
  catalog: Record<string, string[]> = {}
): StudyPlan {
  const start = dayjs(startDateISO);

  // 1) Build blocks from attempts
  const blocks = attempts.map((attempt) => {
    const prescription = prescriptions[attempt.mastery];
    const dueDate = start.add(prescription.retestDays, 'day').toISOString();
    
    return {
      section: attempt.section,
      topic: attempt.topic,
      mastery: attempt.mastery,
      minutes: prescription.minutes,
      practiceItems: prescription.items,
      resourceSlugs: catalog[attempt.topic] ?? [`TBD:${attempt.topic}`],
      dueDateISO: dueDate,
      goal: shortGoal(attempt.topic, attempt.mastery),
    } as PlanBlock;
  });

  // 2) Sort by severity → section priority → topic priority → alphabetical
  const severityOrder = { 
    PRIORITY_GAP: 0, 
    DEVELOPING: 1, 
    PROFICIENT: 2, 
    MASTERED: 3, 
    UNKNOWN: 4 
  } as const;

  blocks.sort((a, b) => {
    // Primary sort: mastery severity
    const severityA = severityOrder[a.mastery];
    const severityB = severityOrder[b.mastery];
    if (severityA !== severityB) return severityA - severityB;

    // Secondary sort: section priority (higher priority first)
    const sectionPriorityA = sectionPriority[a.section];
    const sectionPriorityB = sectionPriority[b.section];
    if (sectionPriorityA !== sectionPriorityB) {
      return (5 - sectionPriorityA) - (5 - sectionPriorityB);
    }

    // Tertiary sort: topic priority (higher priority first)
    const topicPriorityA = topicPriority[a.topic] ?? 3;
    const topicPriorityB = topicPriority[b.topic] ?? 3;
    if (topicPriorityA !== topicPriorityB) {
      return (5 - topicPriorityA) - (5 - topicPriorityB);
    }

    // Final sort: alphabetical
    return a.topic.localeCompare(b.topic);
  });

  // 3) Distribute blocks into weeks respecting section budgets
  const weeksArray: { week: number; blocks: PlanBlock[] }[] = Array.from(
    { length: weeks }, 
    (_, i) => ({ week: i + 1, blocks: [] })
  );

  const weeklyBudgets = Array.from({ length: weeks }, () => ({
    RW: capPerWeek * sectionSplit.RW,
    Math: capPerWeek * sectionSplit.Math,
  }));

  // Pack blocks into weeks
  for (const block of blocks) {
    let placed = false;
    
    // Try to place in earliest week with available budget
    for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
      if (weeklyBudgets[weekIndex][block.section] >= block.minutes) {
        weeksArray[weekIndex].blocks.push(block);
        weeklyBudgets[weekIndex][block.section] -= block.minutes;
        placed = true;
        break;
      }
    }
    
    // If no week has budget, place in last week (overflow)
    if (!placed) {
      weeksArray[weeks - 1].blocks.push(block);
    }
  }

  return {
    userId,
    weeks: weeksArray,
    meta: {
      generatedAtISO: new Date().toISOString(),
      capMinutesPerWeek: capPerWeek,
      rulesVersion: 'v1.0',
    },
  };
}

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