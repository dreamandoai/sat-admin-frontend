import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Input } from '../../components/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs';
import { Badge } from '../../components/Badge';
import { Search, Users, GraduationCap, Mail, Calendar, Loader2 } from 'lucide-react';
import Navbar from '../../layouts/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { userDirectoryService } from '../../services/userDirectoryService';
import { setRegisteredTeachers, setRegisteredStudents } from '../../store/userDirectorySlice';
import type { RegisteredStudent, RegisteredTeacher } from '../../types/userDirectory';

const UserDirectory: React.FC = () => {
  const dispatch = useDispatch();
  const { registeredTeachers, registeredStudents } = useSelector((state: RootState) => state.userDirectory);
  const [ searchQuery, setSearchQuery ] = useState<string>('');
  const [ activeTab, setActiveTab ] = useState<'students' | 'teachers'>('teachers');
  const [loading, setLoading] = useState<boolean>(false);

  const filteredTeachers: RegisteredTeacher[] = useMemo(
    () => registeredTeachers.filter(
      (teacher) => teacher.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  ), [registeredTeachers, searchQuery]);

  const filteredStudents: RegisteredStudent[] = useMemo(
    () => registeredStudents.filter(
      (student) => student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  ), [registeredStudents, searchQuery]);
  
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar title="User Directory" subtitle="View all registered students and teachers" />
      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-card border-border rounded-lg shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-h3 font-bold text-foreground">
                  Registered Users
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span className="text-body-standard font-medium text-foreground">
                      {filteredStudents.length} Students
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg">
                    <Users className="h-5 w-5 text-foreground" />
                    <span className="text-body-standard font-medium text-foreground">
                      {filteredTeachers.length} Teachers
                    </span>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search 
                  size={16} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  type="text"
                  placeholder="Search by name, email, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-input-background border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'students' | 'teachers')}>
                <TabsList className="grid w-full grid-cols-2 bg-secondary/30 rounded-lg p-1 mb-6">
                  <TabsTrigger 
                    value="students" 
                    className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Students ({filteredStudents.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="teachers"
                    className="rounded-lg data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Teachers ({filteredTeachers.length})
                  </TabsTrigger>
                </TabsList>

                {/* Students Tab */}
                <TabsContent value="students" className="space-y-4">
                  {filteredStudents.map((student) => (
                    <Card key={student.id} className="bg-card border-border rounded-lg hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <GraduationCap className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-body-large font-medium text-foreground">
                                {student.first_name} {student.last_name}
                              </h4>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2 text-small text-muted-foreground">
                                  <Mail className="h-4 w-4" />
                                  {student.email}
                                </div>
                                <div className="flex items-center gap-2 text-small text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  Joined {new Date(student.joined_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge 
                            className={`rounded-lg ${
                              student.is_tested === true 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            {student.is_tested ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredStudents.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-body-standard text-muted-foreground">
                        No students found matching your search.
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* Teachers Tab */}
                <TabsContent value="teachers" className="space-y-4">
                  {filteredTeachers.map((teacher) => (
                    <Card key={teacher.id} className="bg-card border-border rounded-lg hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-secondary/50 rounded-lg">
                              <Users className="h-6 w-6 text-foreground" />
                            </div>
                            <div>
                              <h4 className="text-body-large font-medium text-foreground">
                                {teacher.first_name} {teacher.last_name}
                              </h4>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2 text-small text-muted-foreground">
                                  <Mail className="h-4 w-4" />
                                  {teacher.email}
                                </div>
                                <div className="flex items-center gap-2 text-small text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  Joined {new Date(teacher.joined_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right mr-3">
                              <p className="text-body-standard font-medium text-foreground">
                                {teacher.students_count} Students
                              </p>
                              <p className="text-small text-muted-foreground">
                                Subject: {teacher.subject === "Math" ? "Math": "English"}
                              </p>
                            </div>
                            <Badge 
                              className={`rounded-lg ${
                                teacher.subject === 'Math' 
                                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                  : teacher.subject === 'RW'
                                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                                  : 'bg-green-100 text-green-800 hover:bg-green-100'
                              }`}
                            >
                              {teacher.subject === "Math" ? "Math": "English"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredTeachers.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-body-standard text-muted-foreground">
                        No teachers found matching your search.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      )}
    </div>
  );
};

export default UserDirectory;
