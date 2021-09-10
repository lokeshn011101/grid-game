import React from "react";
import Timer from "./Timer";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.grid = React.createRef();
    this.outerGrid = React.createRef();
  }
  state = {
    showDesc: true,
    startGame: false,
    startCounter: false,
    countdownTimer: 3,
    runTimeSeconds: 0,
    runTimeMSeconds: 0,
    curTime: null,
    initialCounter: 21,
    currentNumber: 1,
    bestTime: [],
    gameDone: false,
  };
  resetStates = () => {
    this.setState({
      showDesc: true,
      startGame: false,
      startCounter: false,
      countdownTimer: 3,
      runTimeSeconds: 0,
      runTimeMSeconds: 0,
      curTime: null,
      initialCounter: 21,
      currentNumber: 1,
    });
  };
  startTimer = () => {
    const stopWatch = () => {
      this.setState({ runTimeMSeconds: this.state.runTimeMSeconds + 5 });
      let mills = this.state.runTimeMSeconds;
      if (mills / 1000 === 1) {
        this.setState({
          runTimeSeconds: this.state.runTimeSeconds + 1,
          runTimeMSeconds: 0,
        });
      }
    };
    let id = setInterval(stopWatch, 5);
    this.setState({ curTime: id });
  };
  shuffledArray = () => {
    let array = [...Array(21).keys()];
    array.shift();
    array.sort(() => Math.random() - 0.5);
    return array;
  };
  changeText = (element) => {
    let color = 255;
    if (
      this.state.currentNumber === parseInt(element.innerHTML) &&
      this.state.initialCounter <= 40
    ) {
      element.innerHTML = this.state.initialCounter;
      element.style.backgroundColor =
        "hsl(260,5%," + (100 - parseInt(element.innerHTML) * 2) + "%)";
      color = Math.floor(color - 6.375);
      this.setState({
        currentNumber: this.state.currentNumber + 1,
        initialCounter: this.state.initialCounter + 1,
      });
    } else if (
      this.state.currentNumber === parseInt(element.innerHTML) &&
      this.state.initialCounter > 40
    ) {
      element.style.visibility = "hidden";
      element.style.backgroundColor = "rgb(" + [color, 0, 0].join(",") + ")";
      color = Math.floor(color - 6.375);
      this.setState({
        currentNumber: this.state.currentNumber + 1,
        initialCounter: this.state.initialCounter + 1,
      });
    }
    if (this.state.initialCounter === 61) {
      this.stopgame();
    }
  };
  stopgame = () => {
    clearInterval(this.state.curTime);
    if (
      this.state.bestTime.length > 0 &&
      this.state.runTimeSeconds < this.state.bestTime[0]
    ) {
      this.setState({
        bestTime: [
          ...this.state.bestTime,
          this.state.runTimeSeconds + this.state.runTimeMSeconds * 0.001,
        ],
      });
    } else if (this.state.bestTime.length === 0) {
      this.setState({
        bestTime: [
          this.state.runTimeSeconds + this.state.runTimeMSeconds * 0.001,
        ],
      });
    }
    clearInterval(this.state.curTime);
    let finalTime = document.createElement("div");
    finalTime.className = "flex flex-col justify-around items-center";
    let finalTimeDesc = document.createElement("div");
    finalTimeDesc.id = "final-time-desc";
    finalTimeDesc.className = "text-center p-4 text-2xl";
    let button = document.createElement("button");
    button.className = "restart element-1 lg:p-4 md:p-3 p-2";
    button.innerHTML = "Restart";
    button.style.cursor = "pointer";
    button.display = "block";
    finalTime.appendChild(button);
    this.outerGrid.current.appendChild(finalTime);
    this.outerGrid.current.appendChild(finalTimeDesc);
    this.grid.current.style.border = "none";
    this.grid.current.style.display = "none";
    this.grid.current.style.gridTemplateColumns = "none";
    let besttime =
      this.state.runTimeSeconds + this.state.runTimeMSeconds * 0.001;
    document.getElementById("final-time-desc").innerHTML =
      "Your time: " + besttime;
    this.setState({ runTimeSeconds: 0, runTimeMSeconds: 0 });
    button.onclick = () => {
      this.resetStates();
      this.onGameStart();
    };
    this.setState({ initialCounter: 21 });
  };
  gamePad = () => {
    let arr = this.shuffledArray();
    this.grid.current.style.border = "2px solid grey";
    this.grid.current.style.display = "grid";
    this.grid.current.style.gridTemplateColumns = "auto auto auto auto auto";
    for (let i = 0; i < 20; ++i) {
      let box = document.createElement("div");
      box.id = "el" + (i + 1);
      box.className = "box";
      box.innerHTML = arr[i];
      box.style.cursor = "pointer";
      this.grid.current.appendChild(box);
      box.onclick = () => {
        this.changeText(box);
      };
    }
  };
  onGameStart = () => {
    this.setState({ gameDone: true });
    this.setState({ showDesc: false, startCounter: true }, () => {
      let countdown;
      if (this.state.startCounter) {
        countdown = setInterval(() => {
          if (this.state.countdownTimer <= 1) {
            this.setState({ startCounter: false, startGame: true });
            this.gamePad();
            this.startTimer();
            // this.stopgame();
            clearInterval(countdown);
          } else
            this.setState({ countdownTimer: this.state.countdownTimer - 1 });
        }, 1000);
      }
    });
  };
  render() {
    return (
      <div>
        <div className="main-container lg:px-8 lg:py-4 md:py-4 md:px-4 sm:p-3 p-2 w-full h-full">
          <div className="timers w-full flex justify-between items-center">
            <div className="timer-main lg:p-8 md:p-4 sm:p-3 p-2">
              <Timer
                time={
                  this.state.startGame
                    ? this.state.runTimeMSeconds < 100
                      ? this.state.runTimeSeconds +
                        ":0" +
                        this.state.runTimeMSeconds
                      : this.state.runTimeSeconds +
                        ":" +
                        this.state.runTimeMSeconds
                    : "0.000"
                }
                text="Time"
                side="element-1"
              />
            </div>

            <div className="best-time-main lg:p-8 md:p-4 sm:p-3 p-2">
              <Timer
                time={
                  this.state.bestTime.length === 0
                    ? "0.000"
                    : Math.min(...this.state.bestTime)
                }
                text="Best Time"
                side="element-2"
              />
            </div>
          </div>
          <h1 className="text-center lg:text-3xl md:text-2xl sm:text-xl text-lg">
            Click the numbers as quickly as you can!
          </h1>
          <div className="start-game flex justify-center items-center my-8">
            <button
              className="element-1 lg:p-4 md:p-3 p-2"
              onClick={() =>
                !this.state.gameDone
                  ? this.onGameStart()
                  : window.location.reload()
              }
            >
              New Game
            </button>
          </div>
          {this.state.startGame ? (
            <div className="outer-grid h-full relative" ref={this.outerGrid}>
              <div className="grid" ref={this.grid}></div>
            </div>
          ) : this.state.showDesc ? (
            <div className="countdown-container flex justify-center items-center h-1/3 text-3xl ">
              Click New Game to Start!
            </div>
          ) : (
            <div className="countdown-container flex justify-center items-center h-1/3 text-7xl ">
              {this.state.countdownTimer}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
