import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs';
import { Badge } from '../../components/Badge';
import { Switch } from '../../components/Switch';
import { Search, GraduationCap, Users, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setRegisteredStudents, setRegisteredTeachers } from '../../store/userDirectorySlice';
import { userDirectoryService } from '../../services/userDirectoryService';

const AIAccessManagement: React.FC = ({}) => {
  const dispatch = useDispatch();
  const { registeredTeachers, registeredStudents } = useSelector((state: RootState) => state.userDirectory);
  const [activeTab, setActiveTab] = useState<'teachers' | 'students'>('teachers');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Filter functions
  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return registeredTeachers;
    return registeredTeachers.filter(teacher => 
      `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, registeredTeachers]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return registeredStudents;
    return registeredStudents.filter(student => 
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, registeredStudents]);

  // Count users with access
  const teachersWithAccess = useMemo(() => registeredTeachers.filter(t => t.is_access_granted).length, [registeredTeachers]);
  const studentsWithAccess = useMemo(() => registeredStudents.filter(s => s.is_access_granted).length, [registeredStudents]);

  const handleGetRegisteredUsers = async () => {
    setLoading(true);
    try {
      const response = await userDirectoryService.getRegisteredTeachers();
      dispatch(setRegisteredTeachers(response));
      const responseStudents = await userDirectoryService.getRegisteredStudents();
      dispatch(setRegisteredStudents(responseStudents));
    } catch (error) {
      console.error('Error fetching registered teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetRegisteredUsers();
  }, []);

  // Toggle access functions
  const toggleTeacherAccess = async (teacherId: string) => {
    const index = registeredTeachers.findIndex(teacher => teacher.id === teacherId);
    await userDirectoryService.setUserAiAccess([{ user_id: teacherId, ai_access_granted: !registeredTeachers[index].is_access_granted }]);
    const updatedTeachers = registeredTeachers.map((teacher, i) => 
      i === index 
        ? { ...teacher, is_access_granted: !teacher.is_access_granted }
        : teacher
    );
    dispatch(setRegisteredTeachers(updatedTeachers));
  };

  const toggleStudentAccess = async (studentId: string) => {
    const index = registeredStudents.findIndex(student => student.id === studentId);
    await userDirectoryService.setUserAiAccess([{ user_id: studentId, ai_access_granted: !registeredStudents[index].is_access_granted }]);
    const updatedStudents = registeredStudents.map((student, i) => 
      i === index 
        ? { ...student, is_access_granted: !student.is_access_granted }
        : student
    );
    dispatch(setRegisteredStudents(updatedStudents));
  };

  // Grant all access functions
  const grantAllTeachersAccess = async () => {
    await userDirectoryService.setUserAiAccess(registeredTeachers.map(teacher => ({ user_id: teacher.id, ai_access_granted: true })));
    dispatch(setRegisteredTeachers(registeredTeachers.map(teacher => ({ ...teacher, is_access_granted: true }))));
  };

  const grantAllStudentsAccess = async () => {
    await userDirectoryService.setUserAiAccess(registeredStudents.map(student => ({ user_id: student.id, ai_access_granted: true })));
    dispatch(setRegisteredStudents(registeredStudents.map(student => ({ ...student, is_access_granted: true }))));
  };

  // Revoke all access functions
  const revokeAllTeachersAccess = async () => {
    await userDirectoryService.setUserAiAccess(registeredTeachers.map(teacher => ({ user_id: teacher.id, ai_access_granted: false })));
    dispatch(setRegisteredTeachers(registeredTeachers.map(teacher => ({ ...teacher, is_access_granted: false }))));
  };

  const revokeAllStudentsAccess = async () => {
    await userDirectoryService.setUserAiAccess(registeredStudents.map(student => ({ user_id: student.id, ai_access_granted: false })));
    dispatch(setRegisteredStudents(registeredStudents.map(student => ({ ...student, is_access_granted: false }))));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar title="SAT AI Access Management" subtitle="Grant or revoke access to SAT AI features" />

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ): (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'teachers' | 'students')} className="w-full">
            <TabsList className="grid w-full max-w-xl mx-auto grid-cols-2 mb-8 bg-card border border-border rounded-lg">
              <TabsTrigger 
                value="teachers" 
                className="rounded-lg [&[data-state=active]]:!bg-primary [&[data-state=active]]:!text-primary-foreground"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Teachers ({teachersWithAccess}/{registeredTeachers.length})
              </TabsTrigger>
              <TabsTrigger 
                value="students" 
                className="rounded-lg [&[data-state=active]]:!bg-primary [&[data-state=active]]:!text-primary-foreground">
                <Users className="h-4 w-4 mr-2" />
                Students ({studentsWithAccess}/{registeredStudents.length})
              </TabsTrigger>
            </TabsList>

            {/* Teachers Tab */}
            <TabsContent value="teachers">
              <Card className="bg-card border-border rounded-lg shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-h3 font-bold text-foreground">
                      Teacher Access Management
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search 
                          size={16} 
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                          type="text"
                          placeholder="Search teachers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-12 w-64 bg-input-background border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <Button
                        onClick={grantAllTeachersAccess}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                      >
                        Grant All Access
                      </Button>
                      <Button
                        onClick={revokeAllTeachersAccess}
                        variant="outline"
                        className="border-border hover:bg-secondary/50 rounded-lg"
                      >
                        Revoke All Access
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredTeachers.map((teacher) => (
                      <Card key={teacher.id} className="bg-secondary/20 border-border rounded-lg">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-body-standard font-medium text-foreground">
                                    {teacher.first_name} {teacher.last_name}
                                  </h4>
                                  <Badge className="bg-highlight text-highlight-foreground rounded-lg">
                                    {teacher.subject === "Math" ? "Math" : "English"}
                                  </Badge>
                                </div>
                                <p className="text-small text-muted-foreground">
                                  {teacher.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                {teacher.is_access_granted ? (
                                  <>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="text-body-standard text-green-600 font-medium">
                                      Access Granted
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    <span className="text-body-standard text-red-600 font-medium">
                                      No Access
                                    </span>
                                  </>
                                )}
                              </div>
                              <Switch
                                checked={teacher.is_access_granted}
                                onCheckedChange={() => toggleTeacherAccess(teacher.id)}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students">
              <Card className="bg-card border-border rounded-lg shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-h3 font-bold text-foreground">
                      Student Access Management
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search 
                          size={16} 
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                          type="text"
                          placeholder="Search students..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-12 w-64 bg-input-background border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <Button
                        onClick={grantAllStudentsAccess}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                      >
                        Grant All Access
                      </Button>
                      <Button
                        onClick={revokeAllStudentsAccess}
                        variant="outline"
                        className="border-border hover:bg-secondary/50 rounded-lg"
                      >
                        Revoke All Access
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredStudents.map((student) => (
                      <Card key={student.id} className="bg-secondary/20 border-border rounded-lg">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-body-standard font-medium text-foreground">
                                    {student.first_name} {student.last_name}
                                  </h4>
                                </div>
                                <p className="text-small text-muted-foreground">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                {student.is_access_granted ? (
                                  <>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="text-body-standard text-green-600 font-medium">
                                      Access Granted
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    <span className="text-body-standard text-red-600 font-medium">
                                      No Access
                                    </span>
                                  </>
                                )}
                              </div>
                              <Switch
                                checked={student.is_access_granted}
                                onCheckedChange={() => toggleStudentAccess(student.id)}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      )}
    </div>
  );

};

export default AIAccessManagement;
