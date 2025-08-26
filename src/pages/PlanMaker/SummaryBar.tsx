import { Card, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Clock, Target, BookOpen, TrendingUp, User } from 'lucide-react';
import type { StudyPlan } from '../../lib/schemas';
import { calculatePlanSummary } from '../../lib/planComposer';

interface SummaryBarProps {
  plan: StudyPlan;
}

const masteryColors = {
  PRIORITY_GAP: 'bg-red-100 text-red-800 border-red-200',
  DEVELOPING: 'bg-orange-100 text-orange-800 border-orange-200',
  PROFICIENT: 'bg-primary/10 text-primary border-primary/20',
  MASTERED: 'bg-green-100 text-green-800 border-green-200',
  UNKNOWN: 'bg-gray-100 text-gray-800 border-gray-200',
} as const;

const SummaryBar: React.FC<SummaryBarProps> = ({ plan }: SummaryBarProps) => {
  const summary = calculatePlanSummary(plan);
  
  return (
    <Card className="border-border rounded-lg bg-card">
      <CardContent className="p-6">
        {/* Student Info Header */}
        {plan.meta.studentName && (
          <div className="mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-body-large text-foreground">{plan.meta.studentName}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Time */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-small text-muted-foreground mb-1">Total Time</p>
              <p className="font-bold text-body-large text-foreground">
                {Math.round((summary.totalMinutes.RW + summary.totalMinutes.Math) / 60 * 10) / 10}h
              </p>
              <p className="text-small text-muted-foreground">
                RW: {Math.round(summary.totalMinutes.RW / 60 * 10) / 10}h • 
                Math: {Math.round(summary.totalMinutes.Math / 60 * 10) / 10}h
              </p>
            </div>
          </div>

          {/* Total Items */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent rounded-lg">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-small text-muted-foreground mb-1">Practice Items</p>
              <p className="font-bold text-body-large text-foreground">
                {plan.weeks.reduce((sum, week) => 
                  sum + week.blocks.reduce((blockSum, block) => blockSum + block.practiceItems, 0), 0
                )}
              </p>
            </div>
          </div>

          {/* Topics Count */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-highlight/40 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-small text-muted-foreground mb-1">Topics Covered</p>
              <p className="font-bold text-body-large text-foreground">{summary.totalBlocks}</p>
            </div>
          </div>

          {/* Weekly Cap */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-small text-muted-foreground mb-1">Weekly Cap</p>
              <p className="font-bold text-body-large text-foreground">{plan.meta.capMinutesPerWeek} min</p>
              <p className="text-small text-muted-foreground">
                {Math.round(plan.meta.capMinutesPerWeek / 60 * 10) / 10} hours
              </p>
            </div>
          </div>
        </div>

        {/* Mastery Distribution */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-small text-muted-foreground mb-3 font-medium">Mastery Distribution</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(summary.masteryDistribution).map(([mastery, count]) => (
              count > 0 && (
                <Badge 
                  key={mastery} 
                  className={`text-xs px-3 py-1 rounded-md font-medium ${masteryColors[mastery as keyof typeof masteryColors]}`}
                >
                  {mastery.replace('_', ' ')}: {count}
                </Badge>
              )
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SummaryBar;