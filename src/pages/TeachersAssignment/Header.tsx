import React from 'react';
import { Button } from '../../components/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-200 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={() => navigate('/portal')}
              className="flex items-center gap-2 mr-4 hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: 'transparent',
                color: '#00213e',
                height: '40px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
            <div>
              <h1 style={{ 
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '28px',
                fontWeight: '700',
                color: '#00213e'
              }}>
                Assign Teachers
              </h1>
              <p style={{ 
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                color: '#00213e',
                opacity: 0.7
              }}>
                Student Management
              </p>
            </div>
          </div>
        </div>
      </header>

  )
}

export default Header;
