import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" >
      {props.value}
    </button>
  );
}
function Arrow(props) {
  return (
    <button className="arrow" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  renderArrow(i, v) {
    return (
      <Arrow
        value={v}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderArrow(0, '▲')}
          {this.renderArrow(1, '▲')}
          {this.renderArrow(2, '▲')}
          {this.renderArrow(3, '▲')}
          </div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
        </div>
        <div className="board-row">
          {this.renderArrow(4, '▼')}
          {this.renderArrow(5, '▼')}
          {this.renderArrow(6, '▼')}
          {this.renderArrow(7, '▼')}
          </div>
        
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    let arr = [0,1,2,3,4,5,6,7,8,9];
    this.shuffle(arr);
    let s_arr = arr.slice(0, 4);

    this.state = {
      history: [
        {
          squares: Array(4).fill(0),
        }
      ],
      history2: [
        {
          msg: String,
        }
      ],
      squares4: Array(4).fill(0),
      stepNumber: 0,
      solutions: s_arr,
    };
  }

  shuffle(arr) {
    let j, x, i;
    for ( i = arr.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = arr[i - 1];
      arr[i - 1] = arr[j];
      arr[j] = x;
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const squares = this.state.squares4.slice();

    if (i >= 0 && i < 4)
      squares[i] = (squares[i] < 9) ? squares[i] + 1 : 0;
    else if (i >= 4 && i < 8) {
      let n = i - 4;
      squares[n] = (squares[n] > 0) ? squares[n] - 1 : 9;
    }
    
    this.setState({
      squares4: squares
    });
  }

  enterTo(){
    const input = this.state.squares4.slice();
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const history2 = this.state.history2.slice(0, this.state.stepNumber + 1);
    const solutions = this.state.solutions.slice();

    let uniq = input.reduce(function(a,b){
      if (a.indexOf(b) < 0) a.push(b);
      return a;
    },[]);

    if (uniq.length < 4) {
      alert('중복숫자');
      return;
    }
    
    const msg = calculateResult(input, solutions);
    const clear = ['O', 'O', 'O', 'O'];

    let match = msg.filter(function(a){
      if(a === 'S') return a;
    },[]);

    if (match.length >= 4) {
      alert('성공');
    }
    
    this.setState({
      history: history.concat([
        {
          squares: input
        }
      ]),
      history2: history2.concat([
        {
          msg: msg
        }
      ]),
      stepNumber: history.length,
    });
  }

  render() {
    const history = this.state.history;
    const history2 = this.state.history2;
    const solutions = this.state.solutions;
    
    const moves = history.map((step, move) => {
      const desc = move ?
        + history[move].squares[0] + '' + history[move].squares[1] + '' + history[move].squares[2] + '' + history[move].squares[3]
        + '(' + history2[move].msg.toString() + ')':
        'Go to game start';
      return (
        <li key={move}>
          <h3> {desc} </h3>          
        </li>
      );
    });

    let status;

    return (
      <div className="game">
        <div className="game-board">
          
          <Board
            squares={this.state.squares4}
            onClick={i => this.handleClick(i)}
          />
          <button className="enter" onClick={() => this.enterTo()}>ENTER</button>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateResult(input, solutions) {
  let result = new Array();

  input.forEach( function( i_v, i ){
    if (i_v === solutions[i]) {
      result.push('S');
    } else if (i_v === solutions[0] || i_v === solutions[1] || i_v === solutions[2] || i_v === solutions[3]) {
      result.push('B');
    } else {
      result.push('O');
    }
  });
   
  return result;
}
