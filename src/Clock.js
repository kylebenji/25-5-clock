import {
  faArrowUp,
  faArrowDown,
  faPlay,
  faPause,
  faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import beep from "./alarm.mp3";

function Clock() {
  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [currentMode, setCurrentMode] = React.useState("Session");
  const [timeLeft, setTimeLeft] = React.useState(1500);
  const [timerStatus, setTimerStatus] = React.useState("idle");

  const incrementBreakLength = () => {
    if (breakLength === 60) return;
    setBreakLength(breakLength + 1);
  };

  const decrementBreakLength = () => {
    if (breakLength === 1) return;
    setBreakLength(breakLength - 1);
  };

  const incrementSessionLength = () => {
    if (sessionLength === 60) return;
    handleTimeAdjust((sessionLength + 1) * 60);
    setSessionLength(sessionLength + 1);
  };

  const decrementSessionLength = () => {
    if (sessionLength === 1) return;
    handleTimeAdjust((sessionLength - 1) * 60);
    setSessionLength(sessionLength - 1);
  };

  const handleTimeAdjust = (time) => {
    if (timerStatus === "idle") {
      setTimeLeft(time);
    }
  };

  const getTime = (time) => {
    let minutes = (Math.floor(time / 60) + "").padStart(2, "0");
    let seconds = ((time % 60) + "").padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const reset = () => {
    setBreakLength(5);
    setSessionLength(25);
    //stop clock
    setTimerStatus("idle");
    setTimeLeft(25 * 60);
    setCurrentMode("Session");
    const sound = document.querySelector("#beep");
    sound.pause();
    sound.load();
  };

  const playPause = () => {
    if (timerStatus === "idle" || timerStatus === "paused") {
      setTimerStatus("active");
    } else if (timerStatus === "active") {
      setTimerStatus("paused");
    }
  };

  const decrementTimeLeft = () => {
    if (timerStatus === "active") {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        handleTimerFinish();
      }
    }
  };

  const handleTimerFinish = () => {
    if (currentMode === "Session") {
      setTimeLeft(breakLength * 60);
      setCurrentMode("Break");
    } else if (currentMode === "Break") {
      setTimeLeft(sessionLength * 60);
      setCurrentMode("Session");
    }
    document.querySelector("#beep").play();
  };

  //handle timer with an effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      decrementTimeLeft();
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div id="clock-container">
      <h1>25+5 Clock</h1>
      <div id="time-controls">
        <div id="break-length-container">
          <p id="break-label" className="time-control-label">
            Break Length
          </p>
          <div id="break-length-controls">
            <button id="break-decrement" onClick={decrementBreakLength}>
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
            <label id="break-length">{breakLength}</label>
            <button id="break-increment" onClick={incrementBreakLength}>
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          </div>
        </div>
        <div id="session-length-container">
          <p id="session-label" className="time-control-label">
            Session Length
          </p>
          <div id="session-length-controls">
            <button id="session-decrement" onClick={decrementSessionLength}>
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
            <label id="session-length">{sessionLength}</label>
            <button id="session-increment" onClick={incrementSessionLength}>
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          </div>
        </div>
      </div>
      <div id="timer-container">
        <h3 id="timer-label">{currentMode}</h3>
        <p id="time-left">{getTime(timeLeft)}</p>
        <button id="start-stop" onClick={playPause}>
          <FontAwesomeIcon icon={faPlay} /> <FontAwesomeIcon icon={faPause} />
        </button>
        <button id="reset" onClick={reset}>
          <FontAwesomeIcon icon={faArrowRotateRight} />
        </button>
        <audio src={beep} id="beep"></audio>
      </div>
    </div>
  );
}

export default Clock;
