import {useRef, useState, useEffect} from "react";
import "./App.css";

const BEEP_SRC = "./media/beep.mp3";
const INIT_BREAK = 5;
const INIT_SESS = 25;
const INIT_TIME_LEFT = INIT_SESS * 60;

function TimeLeft(props) {
  // TODO: further tweaks to drop timer when unmount
  useEffect(() => {
    let clocktimer = null;
    if (props.timerRunning) {
      clocktimer = setInterval(
        () => {
          if (props.timeLeft > 0) {
            props.setTimeLeft(props.timeLeft - 1);
          } else if (props.timeLeft <= 0) {
            props.beepSoundRef.current.currentTime = 0;
            props.beepSoundRef.current.play();
            clearInterval(clocktimer);
            const newSessionStatus = props.sessionStatus === "Session" ? "Break" : "Session";
            props.setSessionStatus(newSessionStatus);
            props.setTimeLeft(newSessionStatus === "Session" ? props.sessionLength * 60 : props.breakLength * 60);
          }
        }, 1000
      );
    }
    return () => {clearInterval(clocktimer)};
  });

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
  const toggleTimer = () => {
    beepSoundRef.current.pause();
    beepSoundRef.current.currentTime = 0;
    setTimerRunning(!timerRunning);
  }
  const resetTimer = () => {
    beepSoundRef.current.pause();
    beepSoundRef.current.currentTime = 0;
    setTimerRunning(false);
    setBreakLength(INIT_BREAK);
    setSessionLength(INIT_SESS);
    setSessionStatus("Session");
    setTimeLeft(INIT_TIME_LEFT);
  }

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
      <TimeLeft timerRunning={timerRunning} sessionLength={sessionLength} breakLength={breakLength}
      sessionStatus={sessionStatus} setSessionStatus={setSessionStatus}
      timeLeft={timeLeft} setTimeLeft={setTimeLeft} beepSoundRef={beepSoundRef} />
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
