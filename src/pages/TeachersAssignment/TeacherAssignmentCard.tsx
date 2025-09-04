import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/Select';
import { Label } from '../../components/Label';
import { Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Pair, TeacherShort } from '../../types/pair';
import { pairService } from '../../services/pairService';
import { setPairs } from '../../store/pairSlice';

interface TeacherAssignmentCardProps {
  selectedMathTeacher: string;
  onSelectedMathTeacher: (value: string) => void;
  selectedEnglishTeacher: string;
  onSelectedEnglishTeacher: (value: string) => void;
  teachers: TeacherShort[];
  selectedPair: Pair;
}

const TeacherAssignmentCard: React.FC<TeacherAssignmentCardProps> = ({
  selectedMathTeacher,
  onSelectedMathTeacher,
  selectedEnglishTeacher,
  onSelectedEnglishTeacher,
  teachers,
  selectedPair,
}) => {
  const dispatch = useDispatch();
  const { pairs } = useSelector((state: RootState) => state.pair);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const mathTeachers = useMemo(() => {
    return teachers.filter(t => t.subject === 'Math');
  }, [teachers]);

  const englishTeachers = useMemo(() => {
    return teachers.filter(t => t.subject === 'RW');
  }, [teachers]);

  const getTeacherName = (teacherId: string) => {
    const selectedTeacher = teachers.find(t => t.id === teacherId);
    if (selectedTeacher) {
      return `Dr. ${selectedTeacher.first_name} ${selectedTeacher.last_name}`;
    }
    else return '';
  }

  const handleSave = async () => {
    if(selectedPair) {
      setIsSaving(true);
      try {
        await pairService.generatePair({
          student_id: selectedPair.student.id,
          math_teacher_id: selectedMathTeacher || null,
          rw_teacher_id: selectedEnglishTeacher || null
        });
        const updatedPairs = pairs.map(p => {
          if (p.student.id === selectedPair.student.id) {
            return {
              ...p,
              math_teacher_id: selectedMathTeacher || null,
              rw_teacher_id: selectedEnglishTeacher || null
            };
          }
          return p;
        });
        dispatch(setPairs(updatedPairs));
        setIsSaving(false);
      } catch (error) {
        setIsSaving(false);
      }
    }
  };

  return (
    <Card className="bg-card border-border rounded-lg shadow-lg">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-h3 font-bold text-foreground mb-4">
          Teacher Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Math Teacher Selection */}
        <div className="space-y-3">
          <Label 
            htmlFor="math-teacher"
            className="text-body-standard font-medium text-foreground"
          >
            Mathematics Teacher
          </Label>
          {mathTeachers.length > 0 ? (
            <>
              <Select value={selectedMathTeacher} onValueChange={onSelectedMathTeacher}>
                <SelectTrigger 
                  id="math-teacher"
                  className="w-full bg-card border-primary rounded-lg h-11 text-body-standard"
                >
                  <SelectValue placeholder="Select a math teacher" />
                </SelectTrigger>
                <SelectContent>
                  {mathTeachers.map((t: TeacherShort) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.first_name} {t.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-small text-primary">
                {selectedMathTeacher ? `Currently assigned: ${getTeacherName(selectedMathTeacher)}`: 'No Assigned Teacher'} 
              </p>
            </>
          ): (
            <p className="text-small text-red-700">
              No Math teachers. Please add teachers first.
            </p>
          )}
        </div>

        {/* English Teacher Selection */}
        <div className="space-y-3">
          <Label 
            htmlFor="english-teacher"
            className="text-body-standard font-medium text-foreground"
          >
            English Teacher
          </Label>
          {englishTeachers.length > 0 ? (
            <>
              <Select value={selectedEnglishTeacher} onValueChange={onSelectedEnglishTeacher}>
                <SelectTrigger 
                  id="english-teacher"
                  className="w-full bg-card border-highlight rounded-lg h-11 text-body-standard"
                >
                  <SelectValue placeholder="Select an English teacher" />
                </SelectTrigger>
                <SelectContent>
                  {englishTeachers.map((t: TeacherShort) => (
                    <SelectItem key={t.id} value={t.id}>
                        {t.first_name} {t.last_name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {selectedEnglishTeacher && (
                <p className="text-small text-yellow-500">
                  {selectedEnglishTeacher ? `Currently assigned: ${getTeacherName(selectedEnglishTeacher)}`: 'No Assigned Teacher'}
                </p>
              )}
            </>
          ): (
            <p className="text-small text-red-700">
              No English teachers. Please add teachers first.
            </p>
          )}
        </div>

        {/* Current Assignments Summary */}
        {teachers.length > 0 ? (
          <div className="p-4 rounded-lg bg-secondary">
            <h4 className="text-body-standard font-medium text-foreground mb-2">
              Assignment Summary
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-body-standard text-foreground">
                  Math Teacher:
                </span>
                <span className="text-body-standard font-medium text-foreground">
                  {selectedMathTeacher ? getTeacherName(selectedMathTeacher): 'No Assigned Teacher'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-standard text-foreground">
                  English Teacher:
                </span>
                <span className="text-body-standard font-medium text-foreground">
                  {selectedEnglishTeacher ? getTeacherName(selectedEnglishTeacher): 'No Assigned Teacher'}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <Button
          onClick={handleSave}
          disabled={isSaving || (!selectedMathTeacher && !selectedEnglishTeacher)}
          className="w-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity bg-foreground hover:bg-foreground/90 text-card rounded-lg h-12 text-white font-medium"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Assignment
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default TeacherAssignmentCard;
