import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Pair } from '../../types/pair';
import { pairService } from '../../services/pairService';
import { setPairs, setTeachers } from '../../store/pairSlice';
import type { ApiError } from '../../types/api';
import Header from './Header';
import LeftPanel from './LeftPanel';
import StudentProfileCard from './StudentProfileCard';
import TeacherAssignmentCard from './TeacherAssignmentCard';

const TeachersAssignment: React.FC = () => {
  const dispatch = useDispatch();
  const { pairs, teachers } = useSelector((state: RootState) => state.pair);
  const [selectedPair, setSelectedPair] = useState<Pair | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMathTeacher, setSelectedMathTeacher] = useState<string>('');
  const [selectedEnglishTeacher, setSelectedEnglishTeacher] = useState<string>('');
  const [error, setError] = useState<string>("");

  const handlePairSelect = (pair: Pair) => {
    setSelectedPair(pair);
    setSelectedMathTeacher(pair.math_teacher_id || '');
    setSelectedEnglishTeacher(pair.rw_teacher_id || '');
  };

  const filteredPairs: Pair[] = useMemo(() => {
    if (!searchQuery.trim()) return pairs;
    return pairs.filter(p => 
      `${p.student.first_name} ${p.student.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, pairs]);
  
  const handleGetPairsAndTeachers = async () => {
    try {
      const response = await pairService.getPairs();
      dispatch(setPairs(response));
      const responseTeachers = await pairService.getTeachers();
      dispatch(setTeachers(responseTeachers));
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const apiError = error as ApiError;
        setError(apiError.data.detail);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  useEffect(() => {
    if (filteredPairs.length > 0 && teachers.length > 0) {
      setSelectedPair(filteredPairs[0]);
      setSelectedMathTeacher(filteredPairs[0].math_teacher_id || '');
      setSelectedEnglishTeacher(filteredPairs[0].rw_teacher_id || '');
    }
  }, [filteredPairs, teachers]);

  useEffect(() => {
    handleGetPairsAndTeachers();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#b2dafb' }}>
      {/* Header */}
      <Header />
      {/* Main Content */}
      {selectedPair ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Students List */}
            <LeftPanel 
              pairs={filteredPairs} 
              selectedPair={selectedPair} 
              onSelectedPair={handlePairSelect} 
              searchQuery={searchQuery}
              onSearchQuery={setSearchQuery}
            />
            
            {/* Right Column - Student Details and Teacher Assignment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Student Profile Card */}
              <StudentProfileCard 
                pair={selectedPair}
              />

              {/* Teacher Assignment Card */}
              <TeacherAssignmentCard
                selectedMathTeacher={selectedMathTeacher}
                selectedEnglishTeacher={selectedEnglishTeacher}
                onSelectedMathTeacher={setSelectedMathTeacher}
                onSelectedEnglishTeacher={setSelectedEnglishTeacher}
                teachers={teachers}
                selectedPair={selectedPair}
              />
            </div>
          </div>
        </main>
      ): null}
    </div>
  )
}

export default TeachersAssignment;
