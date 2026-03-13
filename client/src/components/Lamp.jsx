import React from 'react';

const Lamp = ({ toggleLamp }) => {
  return (
    <div className="lamp-wrap">
      <div className="lamp-beam-container">
        <div className="lamp-glow"></div>
      </div>
      <button className="lamp" id="lampBtn" onClick={toggleLamp}>
        <span className="lamp-top"></span>
        <span className="lamp-bulb"></span>
        <span className="lamp-base"></span>
      </button>
    </div>
  );
};

export default Lamp;