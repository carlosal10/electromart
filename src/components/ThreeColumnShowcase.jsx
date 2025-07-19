import React from 'react'; 
import LeftColumn from './LeftColumn';
import CenterCarousel from './CenterCarousel';
import RightColumn from './RightColumn';
import './ThreeColumnShowcase.css';

const ThreeColumnShowcase = () => {
  return (
    <section className="three-column-showcase px-4 py-8">
      {/* Optional Title Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Seasonal Offers, Best Choice
        </h2>
      </div>

      {/* Grid for 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LeftColumn />
        <CenterCarousel />
        <RightColumn />
      </div>
    </section>
  );
};

export default ThreeColumnShowcase;
