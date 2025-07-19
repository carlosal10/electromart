import React from 'react';
import './ThreeColumnShowcase.css';
import LeftColumn from './LeftColumn';
import CenterCarousel from './CenterCarousel';
import RightColumn from './RightColumn';

const ThreeColumnShowcase = () => {
  return (
    <section className="three-column-showcase-container">
      <div className="three-column-grid">
        <div className="column left">
          <LeftColumn />
        </div>
        <div className="column center">
          <CenterCarousel />
        </div>
        <div className="column right">
          <RightColumn />
        </div>
      </div>
    </section>
  );
};

export default ThreeColumnShowcase;
