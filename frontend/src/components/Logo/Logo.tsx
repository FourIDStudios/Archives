import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { icon: 24, text: '1rem' },
    md: { icon: 32, text: '1.25rem' },
    lg: { icon: 48, text: '1.5rem' },
    xl: { icon: 64, text: '2rem' }
  };

  const dimensions = sizeMap[size];

  return (
    <div className={`logo ${className}`}>
      {/* Bank Vault SVG Icon */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 100 100"
        className="logo__icon"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer vault door */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          className="logo__outer-ring"
        />
        
        {/* Inner vault mechanism */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="var(--logo-accent)"
          strokeWidth="1.5"
          className="logo__inner-ring"
        />
        
        {/* Vault spokes */}
        <g className="logo__spokes">
          <line x1="50" y1="20" x2="50" y2="30" stroke="var(--logo-accent)" strokeWidth="2" />
          <line x1="80" y1="50" x2="70" y2="50" stroke="var(--logo-accent)" strokeWidth="2" />
          <line x1="50" y1="80" x2="50" y2="70" stroke="var(--logo-accent)" strokeWidth="2" />
          <line x1="20" y1="50" x2="30" y2="50" stroke="var(--logo-accent)" strokeWidth="2" />
          
          <line x1="71.5" y1="28.5" x2="66" y2="34" stroke="var(--logo-accent)" strokeWidth="1.5" />
          <line x1="71.5" y1="71.5" x2="66" y2="66" stroke="var(--logo-accent)" strokeWidth="1.5" />
          <line x1="28.5" y1="71.5" x2="34" y2="66" stroke="var(--logo-accent)" strokeWidth="1.5" />
          <line x1="28.5" y1="28.5" x2="34" y2="34" stroke="var(--logo-accent)" strokeWidth="1.5" />
        </g>
        
        {/* Central wheel */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="var(--logo-accent)"
          className="logo__center"
        />
        
        {/* Center dot */}
        <circle
          cx="50"
          cy="50"
          r="2"
          fill="currentColor"
          className="logo__dot"
        />
      </svg>
      
      {showText && (
        <span 
          className="logo__text" 
        >
          THE ARCHIVES
        </span>
      )}
    </div>
  );
};

export default Logo;