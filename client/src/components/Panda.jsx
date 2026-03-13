import React from 'react';

const Panda = ({ currentState }) => {
  return (
    <section className="panda-area" aria-hidden="true">
      <div className="panda" id="panda">
        <div className="ear left"></div>
        <div className="ear right"></div>
        <div className="head">
          <div className="eye-patch left"><div className="eye left"></div></div>
          <div className="eye-patch right"><div className="eye right"></div></div>
          <div className="nose"></div>
          <div className="mouth"></div>
        </div>
        <div className="body">
          <div className="arm left" id="armLeft"></div>
          <div className="arm right" id="armRight"></div>
        </div>
      </div>
    </section>
  );
};

export default Panda;