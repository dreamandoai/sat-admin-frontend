import type { DifficultyLevel } from "../types/diagnostic";

// Helper function to format Cross Text Connections passages
export const formatCrossTextConnections = (passage: string) => {
  const parts = passage.split(/\n\nText 2: /);
  if (parts.length === 2) {
    const text1 = parts[0].replace('Text 1: ', '');
    const text2 = parts[1];
    
    return (
      <div className="space-y-6">
        <div>
          <h4 
            className="font-semibold mb-3"
            style={{ 
              color: '#00213e',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '18px',
              fontWeight: 700
            }}
          >
            Text 1
          </h4>
          <p 
            className="leading-relaxed"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              lineHeight: 1.4,
              color: '#00213e'
            }}
          >
            {text1}
          </p>
        </div>
        <div>
          <h4 
            className="font-semibold mb-3"
            style={{ 
              color: '#00213e',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '18px',
              fontWeight: 700
            }}
          >
            Text 2
          </h4>
          <p 
            className="leading-relaxed"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              lineHeight: 1.4,
              color: '#00213e'
            }}
          >
            {text2}
          </p>
        </div>
      </div>
    );
  }
  return <p className="leading-relaxed">{passage}</p>;
};

// Helper function to format Rhetorical Synthesis passages as bullet points
export const formatRhetoricalSynthesis = (passage: string) => {
  const lines = passage.split('. ');
  const introLine = lines[0];
  const noteLines = lines.slice(1);
  
  return (
    <div className="space-y-4">
      <p 
        className="leading-relaxed"
        style={{ 
          fontFamily: 'Poppins, sans-serif',
          fontSize: '16px',
          lineHeight: 1.4,
          color: '#00213e'
        }}
      >
        {introLine}.
      </p>
      <ul className="space-y-2 pl-4">
        {noteLines.map((line, index) => (
          <li 
            key={index} 
            className="flex items-start space-x-2"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              lineHeight: 1.4,
              color: '#00213e'
            }}
          >
            <span 
              className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
              style={{ backgroundColor: '#3fa3f6' }}
            ></span>
            <span>{line.trim()}{index < noteLines.length - 1 ? '.' : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Helper function to format passages with background info
export const formatPassageWithBackgroundInfo = (passage: string) => {
  // Check if passage starts with "The following text is..."
  if (passage.startsWith('The following text is')) {
    // Find the first sentence ending with a period
    const firstSentenceMatch = passage.match(/^[^.]+\./);
    if (firstSentenceMatch) {
      const backgroundSentence = firstSentenceMatch[0];
      const restOfPassage = passage.substring(backgroundSentence.length).trim();
      
      return (
        <div className="space-y-4">
          <p 
            className="italic leading-relaxed"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              lineHeight: 1.4,
              color: '#64748b', // Lighter color for background info
              fontStyle: 'italic'
            }}
          >
            {backgroundSentence}
          </p>
          {restOfPassage && (
            <p 
              className="leading-relaxed"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                lineHeight: 1.4,
                color: '#00213e'
              }}
            >
              {restOfPassage}
            </p>
          )}
        </div>
      );
    }
  }
  
  return (
    <p 
      className="leading-relaxed"
      style={{ 
        fontFamily: 'Poppins, sans-serif',
        fontSize: '16px',
        lineHeight: 1.4,
        color: '#00213e'
      }}
    >
      {passage}
    </p>
  );
};

// Helper function to format Underlined Sentence passages
export const formatUnderlinedSentence = (passage: string, difficulty: DifficultyLevel) => {
  let underlineText = '';
  
  if (difficulty === 'easy') {
    underlineText = 'This phenomenon, in which an element of a root word is repeated, sometimes with modification, within another word that is related to the root word, is called reduplication.';
  } else if (difficulty === 'medium') {
    underlineText = '—this approach capitalizes on the research potential offered by a novel yet hitherto relatively underutilized source of insight into ancient human dietary practices and geographical origins.';
  } else if (difficulty === 'hard') {
    underlineText = 'Additionally, the uniform width and sinuous path of the feature did not suggest that it was formed by tectonic stretching or volcanic effusions.';
  }
  
  if (underlineText && passage.includes(underlineText)) {
    const parts = passage.split(underlineText);
    return (
      <p 
        className="leading-relaxed"
        style={{ 
          fontFamily: 'Poppins, sans-serif',
          fontSize: '16px',
          lineHeight: 1.4,
          color: '#00213e'
        }}
      >
        {parts[0]}
        <span 
          className="underline"
          style={{ textDecorationColor: '#3fa3f6', textDecorationThickness: '2px' }}
        >
          {underlineText}
        </span>
        {parts[1]}
      </p>
    );
  }
  
  return (
    <p 
      className="leading-relaxed"
      style={{ 
        fontFamily: 'Poppins, sans-serif',
        fontSize: '16px',
        lineHeight: 1.4,
        color: '#00213e'
      }}
    >
      {passage}
    </p>
  );
};

// Helper function to format time (keeping existing functionality)
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Helper function to get difficulty badge styling
export function getDifficultyBadgeStyle(difficulty: DifficultyLevel) {
  const baseStyle = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    fontWeight: 500,
    padding: '4px 8px',
    borderRadius: '8px',
    textTransform: 'capitalize' as const
  };

  switch (difficulty) {
    case 'easy':
      return {
        ...baseStyle,
        backgroundColor: '#b2dafb',
        color: '#00213e'
      };
    case 'medium':
      return {
        ...baseStyle,
        backgroundColor: '#feefad',
        color: '#00213e'
      };
    case 'hard':
      return {
        ...baseStyle,
        backgroundColor: '#fcda49',
        color: '#00213e'
      };
    default:
      return baseStyle;
  }
}

// Helper function to format question numbers
export function formatQuestionNumber(current: number, total: number): string {
  return `Question ${current} of ${total}`;
}

// Helper function to format section names
export function formatSectionName(section: 'RW' | 'Math'): string {
  return section === 'RW' ? 'Reading & Writing' : 'Math';
}

// Helper function to format percentage
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}