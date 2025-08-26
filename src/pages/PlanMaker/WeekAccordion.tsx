import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/Accordion';
import { Badge } from '../../components/Badge';
import { Clock, Target } from 'lucide-react';
import type { StudyPlan } from '../../lib/schemas';
import { BlockCard } from './BlockCard';

interface WeekAccordionProps {
  plan: StudyPlan;
}

const WeekAccordion: React.FC<WeekAccordionProps> = ({ plan }: WeekAccordionProps) => {
  return (
    <Accordion type="multiple" defaultValue={plan.weeks.map(w => `week-${w.week}`)} className="w-full space-y-4">
      {plan.weeks.map((week) => {
        const totalMinutes = week.blocks.reduce((sum, block) => sum + block.minutes, 0);
        const rwMinutes = week.blocks.filter(b => b.section === 'RW').reduce((sum, block) => sum + block.minutes, 0);
        const mathMinutes = week.blocks.filter(b => b.section === 'Math').reduce((sum, block) => sum + block.minutes, 0);
        const totalItems = week.blocks.reduce((sum, block) => sum + block.practiceItems, 0);

        return (
          <AccordionItem 
            key={week.week} 
            value={`week-${week.week}`}
            className="border border-border rounded-lg bg-card"
          >
            <AccordionTrigger className="hover:no-underline px-6 py-4 bg-secondary/30 rounded-t-lg">
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-h3 text-foreground">Week {week.week}</h3>
                  <Badge className="text-xs bg-primary/10 text-primary border-primary/20 px-2 py-1 rounded-md">
                    {week.blocks.length} topics
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-small">
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">{totalMinutes} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-medium">{totalItems} items</span>
                  </div>
                  <div className="flex gap-3 text-small">
                    <span className="text-secondary-foreground bg-secondary px-2 py-1 rounded font-medium">
                      RW: {rwMinutes}m
                    </span>
                    <span className="text-accent-foreground bg-accent px-2 py-1 rounded font-medium">
                      Math: {mathMinutes}m
                    </span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-4">
              {week.blocks.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground text-body-standard">
                    No study blocks scheduled for this week
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {week.blocks.map((block, index) => (
                    <BlockCard key={`${block.topic}-${index}`} block={block} />
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default WeekAccordion;