import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Input } from '../../components/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs';
import { Badge } from '../../components/Badge';
import { Search, Users, GraduationCap, Mail, Phone, Calendar } from 'lucide-react';
import Navbar from '../../layouts/Navbar';

const UserDirectory: React.FC = ({}) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar title="User Directory" subtitle="View all registered students and teachers" />

    </div>
  );
};

export default UserDirectory;
