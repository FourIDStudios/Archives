import React from 'react';
import { Logo } from '../Logo';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`app-header ${className}`}>
          <div className="app-header__logo">
            <Logo size="lg" showText={true} />
          </div>
          
          <div className="app-header__status">
            <span className="status-indicator status-indicator--online"></span>
            <span className="status-text">Archive System Online</span>
          </div>
    </header>
  );
};

export default Header;