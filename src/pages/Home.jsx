import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app">
    

      {/* Main Content */}
      <div className="content">
        <h1>Table of contents</h1>
        
        <section className="drone-section">
          <h2>Triple-camera drone</h2>
          <h3>DJI Mavic 3 Pro Fly More Combo</h3>
          <p>The DJI Mavic 3 Pro is a powerful triple-camera drone that unlocks new perspectives for aerial photography and filmmaking.</p>
          <button className="browse-button">Browse Mavic</button>
        </section>

        <hr className="divider" />

        <div className="diagram-section">
          <div className="diagram">
            <h3>Diagram</h3>
            <ul>
              <li><strong>Marks:</strong></li>
              <li>- Categories</li>
              <li>- For example PlayStation</li>
            </ul>
          </div>

          <div className="diagram">
            <h3>Diagram</h3>
            <ul>
              <li><strong>Vendors:</strong> Promotions</li>
              <li>- Brands:</li>
              <li>- Newest:</li>
              <li>- Bestsellers:</li>
              <li>- On sale:</li>
              <li>- English</li>
            </ul>
          </div>

          <div className="diagram">
            <h3>Diagram</h3>
            <ul>
              <li><strong>Ack a question</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
