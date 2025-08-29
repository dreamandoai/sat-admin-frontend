import { Badge } from '../../components/Badge';
import { Card, CardContent } from '../../components/Card';
import { Clock, Target, Calendar, BookOpen } from 'lucide-react';
import type { PlanBlock } from '../../types/plan';
import dayjs from 'dayjs';

interface BlockCardProps {
  block: PlanBlock;
}

const masteryColors = {
  PRIORITY_GAP: 'bg-red-100 text-red-800 border-red-200',
  DEVELOPING: 'bg-orange-100 text-orange-800 border-orange-200',
  PROFICIENT: 'bg-primary/10 text-primary border-primary/20',
  MASTERED: 'bg-green-100 text-green-800 border-green-200',
  UNKNOWN: 'bg-gray-100 text-gray-800 border-gray-200',
} as const;

const sectionColors = {
  RW: 'bg-secondary text-secondary-foreground border-primary/30',
  Math: 'bg-accent text-accent-foreground border-primary/30',
} as const;

export function BlockCard({ block }: BlockCardProps) {
  const dueDate = dayjs(block.due_date).format('MMM D');
  
  return (
    <Card className="h-full border-border rounded-lg bg-card hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-body-standard leading-tight mb-2 text-foreground">
              {block.topic}
            </h4>
            <p className="text-small text-muted-foreground line-clamp-2 leading-relaxed">
              {block.goal}
            </p>
          </div>
          <Badge className={`text-xs shrink-0 px-2 py-1 rounded-md font-medium ${masteryColors[block.mastery]}`}>
            {block.mastery.replace('_', ' ')}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-md text-xs font-medium ${sectionColors[block.section]}`}>
                {block.section}
              </div>
            </div>
            <div className="flex items-center gap-1 text-small text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Due {dueDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-small">
              <div className="flex items-center gap-1 text-primary">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{block.minutes} min</span>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Target className="h-4 w-4" />
                <span className="font-medium">{block.practice_items} items</span>
              </div>
            </div>
          </div>

          {block.resource_slugs && block.resource_slugs.length > 0 && (
            <div className="flex items-center gap-2 text-small text-muted-foreground pt-2 border-t border-border">
              <BookOpen className="h-3 w-3 shrink-0" />
              <span className="truncate">{block.resource_slugs.join(', ')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}