import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Label } from '../../components/Label';
import { Slider } from '../../components/Slider';
import { Badge } from '../../components/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/Select';
import { Calendar, Clock, User } from 'lucide-react';
import type { StudentProfile } from '../../lib/schemas';
import { mockStudents } from '../../lib/mockData';

interface PlanControlsProps {
  profile: StudentProfile;
  onGeneratePlan: (config: {
    startDate: string;
    weeks: number;
    capPerWeek: number;
    sectionSplit: { RW: number; Math: number };
    studentInfo: {
      studentId: string;
      studentName: string;
    };
  }) => void;
  isGenerating?: boolean;
}

const PlanControls: React.FC<PlanControlsProps> = ({ profile, onGeneratePlan, isGenerating = false }: PlanControlsProps) => {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [weeks, setWeeks] = useState(3);
  const [capPerWeek, setCapPerWeek] = useState([360]);
  const [rwSplit, setRwSplit] = useState([50]);
  
  // Student selection state
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const handleGenerate = () => {
    const sectionSplit = {
      RW: rwSplit[0] / 100,
      Math: (100 - rwSplit[0]) / 100,
    };

    const selectedStudent = mockStudents.find(s => s.id === selectedStudentId);

    onGeneratePlan({
      startDate: startDate + 'T00:00:00.000Z',
      weeks,
      capPerWeek: capPerWeek[0],
      sectionSplit,
      studentInfo: {
        studentId: selectedStudentId,
        studentName: selectedStudent?.name || '',
      },
    });
  };

  const canGenerate = selectedStudentId !== '';

  return (
    <Card className="bg-card border-border rounded-lg">
      <CardHeader className="bg-secondary/50 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-h3 font-bold text-foreground">
          <User className="h-6 w-6 text-primary" />
          Study Plan Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Student Selection */}
        <div className="bg-accent/30 p-4 rounded-lg space-y-4">
          <h4 className="font-medium text-foreground mb-3">Student Information</h4>
          
          <div>
            <Label htmlFor="studentSelect" className="mb-2 block font-medium text-foreground">
              Select Student *
            </Label>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="bg-input-background border-border rounded-lg">
                <SelectValue placeholder="Choose a student" />
              </SelectTrigger>
              <SelectContent>
                {mockStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-small text-foreground">{profile.sessionLengthMin} min sessions</span>
          </div>
        </div>

        {/* Section Priorities */}
        <div>
          <Label className="mb-3 block font-medium text-foreground">Section Priorities</Label>
          <div className="flex gap-3">
            <Badge 
              variant={profile.sectionPriority.RW >= 4 ? "default" : "secondary"}
              className="text-small px-3 py-1 font-medium"
            >
              Reading & Writing: {profile.sectionPriority.RW}/5
            </Badge>
            <Badge 
              variant={profile.sectionPriority.Math >= 4 ? "default" : "secondary"}
              className="text-small px-3 py-1 font-medium"
            >
              Math: {profile.sectionPriority.Math}/5
            </Badge>
          </div>
        </div>

        {/* Plan Configuration */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="mb-2 block font-medium text-foreground">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-input-background border-border rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="weeks" className="mb-2 block font-medium text-foreground">
                Number of Weeks
              </Label>
              <Input
                id="weeks"
                type="number"
                min="1"
                max="8"
                value={weeks}
                onChange={(e) => setWeeks(parseInt(e.target.value) || 3)}
                className="bg-input-background border-border rounded-lg"
              />
            </div>
          </div>

          <div>
            <Label className="mb-3 block font-medium text-foreground">
              Weekly Time Cap: <span className="text-primary font-bold">{capPerWeek[0]} minutes</span> 
              <span className="text-small text-muted-foreground ml-2">
                ({Math.round(capPerWeek[0] / 60 * 10) / 10} hours)
              </span>
            </Label>
            <Slider
              value={capPerWeek}
              onValueChange={setCapPerWeek}
              max={480}
              min={240}
              step={30}
              className="w-full"
            />
            <div className="flex justify-between text-small text-muted-foreground mt-2">
              <span>4 hours</span>
              <span>8 hours</span>
            </div>
          </div>

          <div>
            <Label className="mb-3 block font-medium text-foreground">
              Section Split: <span className="text-primary font-bold">{rwSplit[0]}% Reading & Writing</span>, 
              <span className="text-primary font-bold ml-1">{100 - rwSplit[0]}% Math</span>
            </Label>
            <Slider
              value={rwSplit}
              onValueChange={setRwSplit}
              max={80}
              min={20}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-small text-muted-foreground mt-2">
              <span>20% RW</span>
              <span>80% RW</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !canGenerate}
          className="w-full btn-primary bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-3" />
              Generating Plan...
            </>
          ) : (
            <>
              <Calendar className="h-5 w-5 mr-3" />
              Generate Study Plan
            </>
          )}
        </Button>

        {!canGenerate && (
          <p className="text-small text-muted-foreground text-center">
            Please select a student to generate a study plan
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default PlanControls;