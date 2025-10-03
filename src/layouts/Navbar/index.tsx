import React from 'react';
import { Button } from '../../components/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

interface NavbarProps {
  title: string;
  subtitle: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-200 shadow-sm bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Button
            onClick={() => navigate('/portal')}
            variant="ghost"
            className="flex items-center gap-2 mr-4 hover:opacity-90 transition-opacity bg-transparent text-foreground rounded-lg"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-h2 font-bold text-foreground">
              {title}
            </h1>
            <p className="text-small text-muted-foreground">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar;
