import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/Select';
import { Label } from '../../components/Label';
import { BookOpen, Calculator, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Pair, TeacherShort } from '../../types/pair';
import { pairService } from '../../services/pairService';
import { setPairs, setTeachers } from '../../store/pairSlice';
import type { ApiError } from '../../types/api';

interface StudentProfileCardProps {
  pair: Pair
}

const StudentProfileCard: React.FC<StudentProfileCardProps> = ({ pair }) => {
  return (
    <Card className="bg-card border-border rounded-lg shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-h1 font-bold text-foreground">
          Student Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Student Basic Info */}
        <div className="text-center">
          <h3 className="text-h3 font-bold text-foreground mb-1">
            {pair.student.first_name} {pair.student.last_name}
          </h3>
          <p className="text-body-standard text-muted-foreground">
            {pair.student.email}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default StudentProfileCard