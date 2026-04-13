import React from 'react';

const Panda = ({ currentState, parts = 'all', noWrapper = false, reaction = '' }) => {
  const showBody = parts === 'all' || parts === 'body';
  const showArms = parts === 'all' || parts === 'arms';

  const pandaContent = (
    <div 
      className={`panda ${parts}-parts ${reaction ? `reaction-${reaction}` : ''}`} 
      id={parts === 'arms' ? 'pandaArms' : 'panda'}
    >
      {showBody && (
        <>
          <div className="ear left"></div>
          <div className="ear right"></div>
          <div className="head">
            <div className="eye-patch left"><div className="eye left"></div></div>
            <div className="eye-patch right"><div className="eye right"></div></div>
            <div className="nose"></div>
            <div className="mouth"></div>
          </div>
        </>
      )}
      <div className="body">
        {showArms && (
          <>
            <div className="arm left" id="armLeft"></div>
            <div className="arm right" id="armRight"></div>
          </>
        )}
      </div>
    </div>
  );

  if (noWrapper) return pandaContent;

  return (
    <section className="panda-area" aria-hidden="true">
      {pandaContent}
    </section>
  );
};

export default Panda;