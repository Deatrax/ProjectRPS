import React from 'react';

const Card = ({ onGetStarted }) => {
  return (
    <div className="card welcome" id="welcomeCard">
      <h2 id="welcomeTitle">Welcome!</h2>
      <p>Ready to master your time and boost your focus?</p>
      <button className="primary" id="getStartedBtn" onClick={onGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default Card;