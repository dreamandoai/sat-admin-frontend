import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/Select';
import { Label } from '../../components/Label';
import { BookOpen, Calculator, Save, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Pair, TeacherShort } from '../../types/pair';
import { pairService } from '../../services/pairService';
import { setPairs, setTeachers } from '../../store/pairSlice';
import type { ApiError } from '../../types/api';
import Header from './Header';

const TeachersAssignment: React.FC = () => {
  const dispatch = useDispatch();
  const { pairs, teachers } = useSelector((state: RootState) => state.pair);
  const [selectedPair, setSelectedPair] = useState<Pair | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMathTeacher, setSelectedMathTeacher] = useState<string>('');
  const [selectedEnglishTeacher, setSelectedEnglishTeacher] = useState<string>('');
  const [error, setError] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

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

  const mathTeachers = useMemo(() => {
    return teachers.filter(t => t.subject === 'Math');
  }, [teachers]);

  const englishTeachers = useMemo(() => {
    return teachers.filter(t => t.subject === 'RW');
  }, [teachers]);
  
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
    <div className="min-h-screen" style={{ backgroundColor: '#b2dafb' }}>
      {/* Header */}
      <Header />
      {/* Main Content */}
      {selectedPair ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Students List */}
            <div className="lg:col-span-1">
              <Card 
                className="card-custom border-0 shadow-lg h-full"
                style={{ backgroundColor: '#ffffff' }}
              >
                <CardHeader className="pb-4">
                  <CardTitle style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#00213e',
                    marginBottom: '16px'
                  }}>
                    Students
                  </CardTitle>
                  {/* Search Bar */}
                  <div className="relative">
                    <Search 
                      size={16} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="focus:ring-2 focus:ring-[#3fa3f6] focus:border-[#3fa3f6] rounded-md text-sm px-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {filteredPairs.map((p: Pair, index: number) => (
                      <div
                        key={index}
                        onClick={() => handlePairSelect(p)}
                        className={`p-4 cursor-pointer transition-all duration-200 border-b border-gray-100 hover:bg-gray-50 ${
                          selectedPair.student.id === p.student.id ? 'bg-blue-50 border-l-4' : ''
                        }`}
                        style={selectedPair.student.id === p.student.id ? { borderLeftColor: '#3fa3f6' } : {}}
                      >
                        <div className="flex items-center gap-3">
                          {/* Student Info */}
                          <div className="flex-1 min-w-0">
                            <h4 style={{ 
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#00213e',
                              marginBottom: '2px'
                            }}>
                              {p.student.first_name} {p.student.last_name}
                            </h4>
                            
                            {/* Mini Progress Bars */}
                            <div className="space-y-1">
                              {/* Math Progress */}
                              <div className="flex items-center gap-2">
                                <Calculator size={10} color="#3fa3f6" />
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="h-1.5 rounded-full transition-all duration-300"
                                    style={{ 
                                      backgroundColor: '#3fa3f6',
                                      width: `70%`
                                    }}
                                  />
                                </div>
                                <span style={{ 
                                  fontFamily: 'Poppins, sans-serif',
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  color: '#00213e'
                                }}>
                                  70%
                                </span>
                              </div>
                              
                              {/* English Progress */}
                              <div className="flex items-center gap-2">
                                <BookOpen size={10} color="#fcda49" />
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="h-1.5 rounded-full transition-all duration-300"
                                    style={{ 
                                      backgroundColor: '#fcda49',
                                      width: `80%`
                                    }}
                                  />
                                </div>
                                <span style={{ 
                                  fontFamily: 'Poppins, sans-serif',
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  color: '#00213e'
                                }}>
                                  70%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Student Details and Teacher Assignment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Student Profile Card */}
              <Card 
                className="card-custom border-0 shadow-lg"
                style={{ backgroundColor: '#ffffff' }}
              >
                <CardHeader className="text-center">
                  <h3 style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#00213e',
                    marginBottom: '4px'
                  }}>
                    {selectedPair.student.first_name} {selectedPair.student.last_name}
                  </h3>
                  <p style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    color: '#00213e',
                    opacity: 0.7
                  }}>
                    {selectedPair.student.email}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Student Photo and Basic Info */}

                  {/* Progress Section */}
                  <div className="space-y-4">
                    <h4 style={{ 
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#00213e',
                      marginBottom: '12px'
                    }}>
                      Academic Progress
                    </h4>
                    
                    {/* Math Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calculator size={16} color="#3fa3f6" />
                          <span style={{ 
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#00213e'
                          }}>
                            Mathematics
                          </span>
                        </div>
                        <span style={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#00213e'
                        }}>
                          {80}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: '#3fa3f6',
                            width: `80%`
                          }}
                        />
                      </div>
                    </div>

                    {/* English Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} color="#fcda49" />
                          <span style={{ 
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#00213e'
                          }}>
                            English
                          </span>
                        </div>
                        <span style={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#00213e'
                        }}>
                          {70}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: '#fcda49',
                            width: `70%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Teacher Assignment Card */}
              <Card 
                className="card-custom border-0 shadow-lg"
                style={{ backgroundColor: '#ffffff' }}
              >
                <CardHeader className="text-center pb-6">
                  <CardTitle style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#00213e',
                    marginBottom: '16px'
                  }}>
                    Teacher Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Math Teacher Selection */}
                  <div className="space-y-3">
                    <Label 
                      htmlFor="math-teacher"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#00213e'
                      }}
                    >
                      Mathematics Teacher
                    </Label>
                    {mathTeachers.length > 0 ? (
                      <>
                        <Select value={selectedMathTeacher} onValueChange={setSelectedMathTeacher}>
                          <SelectTrigger 
                            id="math-teacher"
                            className="w-full"
                            style={{
                              backgroundColor: '#ffffff',
                              borderColor: '#3fa3f6',
                              borderRadius: '8px',
                              height: '44px',
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: '16px'
                            }}
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
                        <p style={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '12px',
                          color: '#3fa3f6'
                        }}>
                          {selectedMathTeacher ? `Currently assigned: ${getTeacherName(selectedMathTeacher)}`: 'No Assigned Teacher'} 
                        </p>
                      </>
                    ): (
                      <p style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        color: '#ff4d4f'
                      }}>
                        No Math teachers. Please add teachers first.
                      </p>
                    )}
                  </div>

                  {/* English Teacher Selection */}
                  <div className="space-y-3">
                    <Label 
                      htmlFor="english-teacher"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#00213e'
                      }}
                    >
                      English Teacher
                    </Label>
                    {englishTeachers.length > 0 ? (
                      <>
                        <Select value={selectedEnglishTeacher} onValueChange={setSelectedEnglishTeacher}>
                          <SelectTrigger 
                            id="english-teacher"
                            className="w-full"
                            style={{
                              backgroundColor: '#ffffff',
                              borderColor: '#fcda49',
                              borderRadius: '8px',
                              height: '44px',
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: '16px'
                            }}
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
                          <p style={{ 
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '12px',
                            color: '#fcda49'
                          }}>
                            {selectedEnglishTeacher ? `Currently assigned: ${getTeacherName(selectedEnglishTeacher)}`: 'No Assigned Teacher'}
                          </p>
                        )}
                      </>
                    ): (
                      <p style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        color: '#ff4d4f'
                      }}>
                        No English teachers. Please add teachers first.
                      </p>
                    )}
                  </div>

                  {/* Current Assignments Summary */}
                  {teachers.length > 0 ? (
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#feefad' }}>
                      <h4 style={{ 
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#00213e',
                        marginBottom: '8px'
                      }}>
                        Assignment Summary
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span style={{ 
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            color: '#00213e'
                          }}>
                            Math Teacher:
                          </span>
                          <span style={{ 
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#00213e'
                          }}>
                            {selectedMathTeacher ? getTeacherName(selectedMathTeacher): 'No Assigned Teacher'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ 
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            color: '#00213e'
                          }}>
                            English Teacher:
                          </span>
                          <span style={{ 
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#00213e'
                          }}>
                            {selectedEnglishTeacher ? getTeacherName(selectedEnglishTeacher): 'No Assigned Teacher'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Save Button */}
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || (!selectedMathTeacher && !selectedEnglishTeacher)}
                    className="w-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: '#00213e',
                      color: '#ffffff',
                      height: '48px',
                      borderRadius: '8px',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
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
            </div>
          </div>
        </main>
      ): null}
    </div>
  )
}

export default TeachersAssignment;
