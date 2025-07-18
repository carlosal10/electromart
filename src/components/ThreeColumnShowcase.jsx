import React from 'react';
import LeftColumn from './LeftColumn';
import CenterCarousel from './CenterCarousel';
import RightColumn from './RightColumn';
import './ThreeColumnShowcase.css';


const ThreeColumnShowcase = () => {
  return (
    <section className="three-column-showcase grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-8">
        <h2> Seasonal Offers, Best choice</h2>
      <LeftColumn />
      <CenterCarousel />
      <RightColumn />
    </section>
  );
};

export default ThreeColumnShowcase;
