import {useState} from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [sessionStatus, setSession] = useState('');

  return (
    <div className="App">
      <div id="break-label">
        Break Length: <span id="break-length">{breakLength}</span>
      </div>
      <button id="break-increment" onClick={() => setBreakLength(breakLength + 1)}>+</button>
      <button id="break-decrement" onClick={() => setBreakLength(breakLength - 1)}>-</button>
      <div id="session-label">
        Session Length: <span id="session-length">{sessionLength}</span>
      </div>
      <button id="session-increment" onClick={() => setSessionLength(sessionLength + 1)}>+</button>
      <button id="session-decrement" onClick={() => setSessionLength(sessionLength - 1)}>-</button>
      <div id="timer-label">
        {sessionStatus} {/* TODO: Display whether timer is not running, or in session or break */}
      </div>
      <div id="time-left">
        {/* TODO: Display how much time left on session or break */}
      </div>
      <button id="start_stop">Start/Stop</button>
      <button id="reset">Reset Timer</button>
      <audio id="beep"></audio>
    </div>
  );
}

export default App;
