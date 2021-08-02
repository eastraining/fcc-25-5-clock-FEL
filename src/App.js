import {useRef, useState, useEffect} from "react";
import "./App.css";
import BEEP_SRC from "../src/media/beep.mp3";

const INIT_BREAK = 5;
const INIT_SESS = 25;
const INIT_TIME_LEFT = INIT_SESS * 60;

function TimeLeft(props) {
  let minLeft, secLeft;
  minLeft = (Math.floor(props.timeLeft / 60)).toLocaleString([], {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
  secLeft = (props.timeLeft % 60).toLocaleString([], {
    minimumIntegerDigits: 2,
    useGrouping: false
  });

  return (
    <div id="time-left">
      {`${minLeft}:${secLeft}`}
    </div>
  )
}

function App() {
  const [breakLength, setBreakLength] = useState(INIT_BREAK);
  const [sessionLength, setSessionLength] = useState(INIT_SESS);
  const [sessionStatus, setSessionStatus] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(INIT_TIME_LEFT);
  const [timerRunning, setTimerRunning] = useState(false);

  const increaseLength = length => {
    return length > 59 ? length : length + 1;
  }
  const decreaseLength = length => {
    return length < 2 ? length: length - 1;
  }
  const tweakLength = (action, length) => {
    if (timerRunning) {return};
    let newLength;
    switch (action) {
      case "BREAK_INC":
        newLength = increaseLength(length);
        setBreakLength(newLength);
        if (sessionStatus === "Break") {
          setTimeLeft(newLength * 60);
        }
        break;
      case "BREAK_DEC":
        newLength = decreaseLength(length);
        setBreakLength(newLength);
        if (sessionStatus === "Break") {
          setTimeLeft(newLength * 60);
        }
        break;
      case "SESS_INC":
        newLength = increaseLength(length);
        setSessionLength(newLength);
        if (sessionStatus === "Session") {
          setTimeLeft(newLength * 60);
        }
        break;
      case "SESS_DEC":
        newLength = decreaseLength(length);
        setSessionLength(newLength);
        if (sessionStatus === "Session") {
          setTimeLeft(newLength * 60);
        }
        break;
      default:
        break;
    }
  }
  
  const beepSoundRef = useRef();
  const beepPlay = useRef();
  const beepPause = useRef();

  function beepPlayer() {
    beepSoundRef.current.currentTime = 0;
    beepSoundRef.current.play();
  }
  function beepPauser() {
    beepSoundRef.current.pause();
    beepSoundRef.current.currentTime = 0;
  }
  useEffect(() => {
    beepPlay.current = beepPlayer;
    beepPause.current = beepPauser;
  })

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  }
  function resetTimer() {
    setTimerRunning(false);
    setBreakLength(INIT_BREAK);
    setSessionLength(INIT_SESS);
    setSessionStatus("Session");
    setTimeLeft(INIT_TIME_LEFT);
    beepPause.current();
  }

  useEffect(() => {
    let clocktimer = null;
    if (timerRunning) {
      clocktimer = setInterval(
        () => {
          setTimeLeft(timeLeft - 1);
          // to pass fcc test which is resetting so quickly from zero  
          // that the sound play function below can't be invoked in time
          if (timeLeft === 1) {
            beepPlay.current(); 
          }
          if (timeLeft === 0) {
            beepPlay.current();
            const newSessionStatus = sessionStatus === "Session" ? "Break" : "Session";
            setSessionStatus(newSessionStatus);
            setTimeLeft(newSessionStatus === "Session" ? sessionLength * 60 : breakLength * 60);
          }
        }, 1000
      );
    } else {
      clearInterval(clocktimer);
    }
    return () => {clearInterval(clocktimer)};
  });



  return (
    <div className="App">
      <div id="top-controls">
        <div id="break-controls">
          <div id="break-label">
            Break Length: <span id="break-length">{breakLength}</span>
          </div>
          <button id="break-increment" onClick={() => tweakLength("BREAK_INC", breakLength)}>+</button>
          <button id="break-decrement" onClick={() => tweakLength("BREAK_DEC", breakLength)}>-</button>
        </div>
        <div id="session-controls">
          <div id="session-label">
            Session Length: <span id="session-length">{sessionLength}</span>
          </div>
          <button id="session-increment" onClick={() => tweakLength("SESS_INC", sessionLength)}>+</button>
          <button id="session-decrement" onClick={() => tweakLength("SESS_DEC", sessionLength)}>-</button>
        </div>
      </div>
      <div id="timer-label">
        {sessionStatus} 
      </div>
      <TimeLeft timeLeft={timeLeft} />
      <button className="timer-button" id="start_stop" onClick={toggleTimer}>Start/Stop</button>
      <button className="timer-button" id="reset" onClick={resetTimer}>Reset Timer</button>
      <audio id="beep" ref={beepSoundRef} crossOrigin="anonymous" preload="auto">
        <source src={BEEP_SRC}></source>
      </audio>
      <div id="footer">
        made by <a href="https://github.com/eastraining/fcc-25-5-clock-FEL">eastraining</a> <br></br>
        <a href="https://soundbible.com/529-Pager-Beeps.html">beep sound by Mike Koenig</a>
      </div>
    </div>
  );
}

export default App;
