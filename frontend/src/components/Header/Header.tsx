import React from 'react';
import { Logo } from '../Logo';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`app-header ${className}`}>
      <div className="container">
        <div className="app-header__content">
          <div className="app-header__logo">
            <Logo size="lg" showText={true} />
          </div>
          
          <nav className="app-header__nav">
            <div className="app-header__status">
              <span className="status-indicator status-indicator--online"></span>
              <span className="status-text">Archive System Online</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;