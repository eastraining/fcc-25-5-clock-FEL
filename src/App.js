import {useRef, useState, useEffect} from "react";
import "./App.css";

const BEEP_SRC = "./media/beep.mp3";
const INIT_BREAK = 5;
const INIT_SESS = 25;
const INIT_TIME_LEFT = INIT_SESS * 60;

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
    return length < 1 ? length: length - 1;
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
  
  const beepSoundRef = useRef(null);
  var clockTicker = useRef(null);
  const useSessionInit = () => {useEffect(() => {
    clearInterval(clockTicker.current);
    clockTicker.current = setInterval(() => {
      console.log(timeLeft);
      setTimeLeft(timeLeft - 1);
      if (timeLeft <= 0) {
        beepSoundRef.current.currentTime = 0;
        beepSoundRef.current.play();
        clearInterval(clockTicker.current);
        const newSessionStatus = sessionStatus === "Session" ? "Break" : "Session"
        setSessionStatus(newSessionStatus);
        setTimeLeft(newSessionStatus === "Session" ? sessionLength * 60 : breakLength * 60);
        useSessionInit();
      }
    }, 1000);
  })};
  const toggleTimer = () => {
    const timerStatus = !timerRunning;
    setTimerRunning(timerStatus);
    if (timerStatus) {
      useSessionInit();
    } else {
      beepSoundRef.current.pause();
      beepSoundRef.current.currentTime = 0;
      console.log(clockTicker.current, "off");
      clearInterval(clockTicker.current);
    }
  }
  const resetTimer = () => {
    beepSoundRef.current.pause();
    beepSoundRef.current.currentTime = 0;
    console.log(clockTicker.current, "reset");
    clearInterval(clockTicker.current);
    setBreakLength(INIT_BREAK);
    setSessionLength(INIT_SESS);
    setSessionStatus("Session");
    setTimeLeft(INIT_TIME_LEFT);
    setTimerRunning(false);
  }

  let minLeft, secLeft;
  minLeft = Math.floor(timeLeft / 60);
  secLeft = (timeLeft % 60).toLocaleString([], {
    minimumIntegerDigits: 2,
    useGrouping: false
  });

  return (
    <div className="App">
      <div id="break-label">
        Break Length: <span id="break-length">{breakLength}</span>
      </div>
      <button id="break-increment" onClick={() => tweakLength("BREAK_INC", breakLength)}>+</button>
      <button id="break-decrement" onClick={() => tweakLength("BREAK_DEC", breakLength)}>-</button>
      <div id="session-label">
        Session Length: <span id="session-length">{sessionLength}</span>
      </div>
      <button id="session-increment" onClick={() => tweakLength("SESS_INC", sessionLength)}>+</button>
      <button id="session-decrement" onClick={() => tweakLength("SESS_DEC", sessionLength)}>-</button>
      <div id="timer-label">
        {sessionStatus} 
      </div>
      <div id="time-left">
        {`${minLeft}:${secLeft}`} 
      </div>
      <button id="start_stop" onClick={toggleTimer}>Start/Stop</button>
      <button id="reset" onClick={resetTimer}>Reset Timer</button>
      <audio id="beep" ref={beepSoundRef} src={BEEP_SRC} preload="auto"></audio>
      <div>
        made by eastraining <br></br>
        <a href="https://soundbible.com/529-Pager-Beeps.html">beep sound by Mike Koenig</a>
      </div>
    </div>
  );
}

export default App;
