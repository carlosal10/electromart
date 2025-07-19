import React from 'react';
import './ThreeColumnShowcase.css';
import LeftColumn from './LeftColumn';
import CenterCarousel from './CenterCarousel';
import RightColumn from './RightColumn';

const ThreeColumnShowcase = () => {
  return (
    <section className="three-column-wrapper">
      <div className="three-column-container">
        <div className="column left-col">
          <LeftColumn />
        </div>
        <div className="column center-col">
          <CenterCarousel />
        </div>
        <div className="column right-col">
          <RightColumn />
        </div>
      </div>
    </section>
  );
};

export default ThreeColumnShowcase;
