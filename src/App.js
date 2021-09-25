import React from "react";
import Timer from "./Timer";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialising references to the grids in the game.
    this.gameGrid = React.createRef();
    this.outerGameGrid = React.createRef();
  }

  // Initialising the required states for the game.
  state = {
    showDescription: true,
    startGame: false,
    startCounter: false,
    countdownTimer: 3,
    runTimeSeconds: 0,
    runTimeMilliSeconds: 0,
    curTime: null,
    initialCounter: 21,
    currentNumber: 1,
    playersTime: [],
    gameOver: false,
  };

  // Function used for resetting all the states.
  resetStates = () => {
    this.setState({
      showDescription: true,
      startGame: false,
      startCounter: false,
      countdownTimer: 3,
      runTimeSeconds: 0,
      runTimeMilliSeconds: 0,
      curTime: null,
      initialCounter: 21,
      currentNumber: 1,
    });
  };

  // Function used to start a timer for tracking the time being played.
  startTimer = () => {
    const stopWatch = () => {
      this.setState({
        runTimeMilliSeconds: this.state.runTimeMilliSeconds + 5,
      });
      // Checking for each 5 milli seconds, whether 1 second has elapsed
      let milliSeconds = this.state.runTimeMilliSeconds;
      if (milliSeconds / 1000 === 1) {
        this.setState({
          runTimeSeconds: this.state.runTimeSeconds + 1,
          runTimeMilliSeconds: 0,
        });
      }
    };
    // Adding the interval id to the state to stop it later
    let intervalId = setInterval(stopWatch, 5);
    this.setState({ curTime: intervalId });
  };

  // Function used to generate an array of random integers between 1 and 20.
  shuffledArray = () => {
    let arrayOfNumbers = [...Array(21).keys()];
    arrayOfNumbers.shift();
    arrayOfNumbers.sort(() => Math.random() - 0.5);
    return arrayOfNumbers;
  };

  // Function used to update the cell's value and color which goes from 21 to 40.
  changeGridCell = (element) => {
    let color = 255;
    if (
      this.state.currentNumber === parseInt(element.innerHTML) &&
      this.state.initialCounter <= 40
    ) {
      // Updating the value and the color of the clicked cell to a new number in a sequence.
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
      // Hiding the element if the value of the cell is greater than 21 and is clicked. (initialCOunter>40)
      element.style.visibility = "hidden";
      element.style.backgroundColor = "rgb(" + [color, 0, 0].join(",") + ")";
      color = Math.floor(color - 6.375);
      this.setState({
        currentNumber: this.state.currentNumber + 1,
        initialCounter: this.state.initialCounter + 1,
      });
    }
    // Else Do Nothing

    // If the initalCounter is 61, stop the game.
    if (this.state.initialCounter === 61) {
      this.stopgame();
    }
  };

  // Function for stopping the game when appropriate conditions are met.
  stopgame = () => {
    // Updating the best score based on the current score
    if (
      this.state.playersTime.length > 0 &&
      this.state.runTimeSeconds < this.state.playersTime[0]
    ) {
      this.setState({
        playersTime: [
          ...this.state.playersTime,
          this.state.runTimeSeconds + this.state.runTimeMilliSeconds * 0.001,
        ],
      });
    } else if (this.state.playersTime.length === 0) {
      this.setState({
        playersTime: [
          this.state.runTimeSeconds + this.state.runTimeMilliSeconds * 0.001,
        ],
      });
    }

    // Stopping the timer started at the beginning of the game.
    clearInterval(this.state.curTime);

    // Displaying the total time taken by the player by creating a new div
    let finalTime = document.createElement("div");
    finalTime.className = "flex flex-col justify-around items-center";
    let finalTimeDescription = document.createElement("div");
    finalTimeDescription.id = "final-time-desc";
    finalTimeDescription.className = "text-center p-4 text-2xl";

    // Adding a Restart button
    let button = document.createElement("button");
    button.className = "restart element-1 lg:p-4 md:p-3 p-2";
    button.innerHTML = "Restart";
    button.style.cursor = "pointer";
    button.display = "block";

    // Appending the created divs to the refs created in the constructor.
    finalTime.appendChild(button);
    this.outerGameGrid.current.appendChild(finalTime);
    this.outerGameGrid.current.appendChild(finalTimeDescription);

    // Hiding the grid in the game.
    this.gameGrid.current.style.border = "none";
    this.gameGrid.current.style.display = "none";
    this.gameGrid.current.style.gridTemplateColumns = "none";

    // Displaying the total Time
    let playersTime =
      this.state.runTimeSeconds + this.state.runTimeMilliSeconds * 0.001;
    document.getElementById("final-time-desc").innerHTML =
      "Your time: " + playersTime;
    this.setState({ runTimeSeconds: 0, runTimeMilliSeconds: 0 });

    // Adding the onClick fucntionality to the button.
    button.onclick = () => {
      this.resetStates();
      this.onGameStart();
    };
    this.setState({ initialCounter: 21 });
  };

  // Function for creating the grid in the game.
  gamePad = () => {
    let arr = this.shuffledArray();
    this.gameGrid.current.style.border = "2px solid grey";
    this.gameGrid.current.style.display = "grid";
    this.gameGrid.current.style.gridTemplateColumns =
      "auto auto auto auto auto";
    for (let i = 0; i < 20; ++i) {
      let box = document.createElement("div");
      box.id = "el" + (i + 1);
      box.className = "box";
      box.innerHTML = arr[i];
      box.style.cursor = "pointer";
      this.gameGrid.current.appendChild(box);
      box.onclick = () => {
        this.changeGridCell(box);
      };
    }
  };

  // Function which is called the moment the game starts.
  onGameStart = () => {
    this.setState({ gameOver: true });
    this.setState({ showDescription: false, startCounter: true }, () => {
      let countdown;
      if (this.state.startCounter) {
        countdown = setInterval(() => {
          if (this.state.countdownTimer <= 1) {
            this.setState({ startCounter: false, startGame: true });
            this.gamePad();
            this.startTimer();
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
                    ? this.state.runTimeMilliSeconds < 100
                      ? this.state.runTimeSeconds +
                        ":0" +
                        this.state.runTimeMilliSeconds
                      : this.state.runTimeSeconds +
                        ":" +
                        this.state.runTimeMilliSeconds
                    : "0.000"
                }
                text="Time"
                side="element-1"
              />
            </div>

            <div className="best-time-main lg:p-8 md:p-4 sm:p-3 p-2">
              <Timer
                time={
                  this.state.playersTime.length === 0
                    ? "0.000"
                    : Math.min(...this.state.playersTime)
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
                !this.state.gameOver
                  ? this.onGameStart()
                  : window.location.reload()
              }
            >
              New Game
            </button>
          </div>
          {this.state.startGame ? (
            <div
              className="outer-grid h-full relative"
              ref={this.outerGameGrid}
            >
              <div className="grid" ref={this.gameGrid}></div>
            </div>
          ) : this.state.showDescription ? (
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
