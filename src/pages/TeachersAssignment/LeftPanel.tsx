import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Input } from '../../components/Input';
import { User, Search } from 'lucide-react';
import type { Pair } from '../../types/pair';

interface LeftPanelProps {
  pairs: Pair[];
  selectedPair: Pair;
  onSelectedPair: (pair: Pair) => void;
  searchQuery: string;
  onSearchQuery: (query: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({pairs, selectedPair, onSelectedPair, searchQuery, onSearchQuery}) => {
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  return (
    <div className="lg:col-span-1">
      <Card className="bg-card border-border rounded-lg shadow-lg h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-h3 font-bold text-foreground mb-4">
            Students
          </CardTitle>
          {/* Search Bar */}
          <div className="relative">
            <Search 
              size={16} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              type="text"
              placeholder={!isSearchFocused ? "Search students..." : ""}
              value={searchQuery}
              onChange={(e) => onSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="px-10 bg-input-background border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {pairs.map((p: Pair, index: number) => (
              <div
                key={index}
                onClick={() => onSelectedPair(p)}
                className={`p-4 cursor-pointer transition-all duration-200 border-b border-gray-100 hover:bg-gray-50 ${
                  selectedPair.student.id === p.student.id ? 'bg-blue-50 border-l-4' : ''
                }`}
                style={selectedPair.student.id === p.student.id ? { borderLeftColor: '#3fa3f6' } : {}}
              >
                <div className="flex items-center gap-3">
                  {/* Student Info */}
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body-standard font-medium text-foreground mb-1">
                      {p.student.first_name} {p.student.last_name}
                    </h4>
                    <p className="text-small text-muted-foreground">
                      {p.student.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LeftPanel;
