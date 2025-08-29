import { Button } from '../../components/Button';
import { Printer, Save } from 'lucide-react';
import type { StudyPlan } from '../../types/plan';

interface ExportButtonsProps {
  plan: StudyPlan;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ plan }: ExportButtonsProps) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = generatePrintHTML(plan);
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-2" style={{ color: '#00213e' }} />
        Print Plan
      </Button>
    </div>
  );
}

function generatePrintHTML(plan: StudyPlan): string {
  const totalMinutes = plan.weeks.reduce((sum, week) => 
    sum + week.blocks.reduce((blockSum, block) => blockSum + block.minutes, 0), 0
  );

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SAT Study Plan - ${plan.userId}</title>
      <style>
        body { font-family: system-ui, sans-serif; margin: 40px; line-height: 1.6; }
        .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
        .week { margin-bottom: 30px; break-inside: avoid; }
        .week-title { background: #f3f4f6; padding: 10px; margin-bottom: 15px; border-radius: 4px; }
        .block { border: 1px solid #e5e7eb; padding: 15px; margin-bottom: 10px; border-radius: 4px; }
        .block-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .mastery-badge { 
          background: #f3f4f6; 
          padding: 4px 8px; 
          border-radius: 4px; 
          font-size: 12px; 
          text-transform: uppercase;
        }
        .meta { display: flex; gap: 20px; font-size: 14px; color: #6b7280; }
        @media print { body { margin: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SAT Study Plan</h1>
        <div class="meta">
          <span>User: ${plan.userId}</span>
          <span>Generated: ${new Date(plan.meta.generated_at).toLocaleDateString()}</span>
          <span>Total Time: ${Math.round(totalMinutes / 60 * 10) / 10} hours</span>
          <span>Weekly Cap: ${plan.meta.cap_per_week} minutes</span>
        </div>
      </div>
      
      ${plan.weeks.map(week => `
        <div class="week">
          <div class="week-title">
            <h2>Week ${week.week} (${week.blocks.length} topics, ${week.blocks.reduce((sum, b) => sum + b.minutes, 0)} minutes)</h2>
          </div>
          ${week.blocks.map(block => `
            <div class="block">
              <div class="block-header">
                <strong>${block.topic}</strong>
                <span class="mastery-badge">${block.mastery.replace('_', ' ')}</span>
              </div>
              <p>${block.goal}</p>
              <div class="meta">
                <span>${block.section}</span>
                <span>${block.minutes} minutes</span>
                <span>${block.practice_items} practice items</span>
                <span>Due: ${new Date(block.due_date).toLocaleDateString()}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </body>
    </html>
  `;
}

export default ExportButtons;