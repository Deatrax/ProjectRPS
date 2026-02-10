import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Lamp from './Lamp';
import Panda from './Panda';
import Card from './Card';
import PandaLogin from './PandaLogin';
import PandaSignup from './PandaSignup';
import './PandaLamp.css';

const PandaLamp = () => {
  const [isLampOn, setIsLampOn] = useState(false);
  const [view, setView] = useState(''); // 'welcome', 'login', 'signup'
  const [pandaState, setPandaState] = useState(''); // 'sleeping', 'waking'
  const [isCoveringEyes, setIsCoveringEyes] = useState(false);
  const [showPanda, setShowPanda] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const getSceneClasses = () => {
    const classes = ['scene'];
    classes.push(isLampOn ? 'state-lampOn' : 'state-lampOff');
    if (showPanda) classes.push('state-panda');
    if (pandaState) classes.push(`state-${pandaState}`);
    if (isCoveringEyes) classes.push('state-coverEyes');
    if (view === 'welcome') classes.push('state-welcome');
    if (view === 'login') classes.push('state-login');
    if (view === 'signup') classes.push('state-signup');
    return classes.join(' ');
  };

  const toggleLamp = () => {
    if (!isLampOn) {
      setIsLampOn(true);
      setShowPanda(true);
      setPandaState('sleeping');
      setHintVisible(false);

      setTimeout(() => setPandaState('waking'), 400);
      setTimeout(() => {
        setPandaState('');
        setView('welcome');
      }, 1400);
    } else {
      // Reset Everything (Match JS logic)
      setIsLampOn(false);
      setShowPanda(false);
      setPandaState('');
      setView('');
      setIsCoveringEyes(false);
      setHintVisible(true);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setView('login');
      setIsLampOn(false); // JS: replace(STATE_LAMP_ON, STATE_LAMP_OFF)
    }
  };

  return (
    <main className={getSceneClasses()} id="scene">
      <Lamp toggleLamp={toggleLamp} isLampOn={isLampOn} />

      {/* 
          IMPORTANT: We render components without {&&} 
          so that CSS transitions work correctly. 
      */}
      <Panda currentState={getSceneClasses()} />

      <Card onGetStarted={handleGetStarted} />

      <PandaLogin
        onSignupClick={() => setView('signup')}
        onPasswordFocus={() => setIsCoveringEyes(true)}
        onPasswordBlur={() => setIsCoveringEyes(false)}
      />

      <PandaSignup
        onLoginClick={() => setView('login')}
        onPasswordFocus={() => setIsCoveringEyes(true)}
        onPasswordBlur={() => setIsCoveringEyes(false)}
      />

      {hintVisible && <div className="hint" id="hint">Hint: Click the lamp to get started!</div>}
    </main>
  );
};

export default PandaLamp;