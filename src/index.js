import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const BOARDIMENSIONS = [3, 3]
//Row x Column

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
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
            key={i}
        />
      );
    }
  
    render() {
      const allrows = [];
      for (let i = 0, k = BOARDIMENSIONS[0]; i < k; i++) {
        
        var rowsquares = [];
        for (let j = 0, l = BOARDIMENSIONS[1]; j < l; j++) {
          rowsquares[j] = this.renderSquare(i * k + j);
        }
        allrows[i] = React.createElement('div', {className: 'board-row', key: i}, rowsquares);
      }
      


      return (
        <div>
          {allrows}
        </div>
        // <div>
        //   <div className="board-row">
        //     {this.renderSquare(0)}
        //     {this.renderSquare(1)}
        //     {this.renderSquare(2)}
        //   </div>
        //   <div className="board-row">
        //     {this.renderSquare(3)}
        //     {this.renderSquare(4)}
        //     {this.renderSquare(5)}
        //   </div>
        //   <div className="board-row">
        //     {this.renderSquare(6)}
        //     {this.renderSquare(7)}
        //     {this.renderSquare(8)}
        //   </div>
        // </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            moveLocation: null,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const currentmovelocation = [Math.floor(i / 3) + 1, i % 3 + 1];
        this.setState({
            history: history.concat([{
                squares: squares,
                moveLocation: currentmovelocation,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
          const templocation = history[move];
          const location = templocation.moveLocation;
          const desc = move ?
            'Go to move #' + move + ': [' + location + ']':
            'Go to game start';
          return (
              <li key={move}>
                  <button style={move === this.state.stepNumber ? {fontWeight: '600'} : {fontWeight: '300'}} 
                  onClick={() => this.jumpTo(move)}>
                    {desc}
                  </button>
              </li>
          );
      });

      let status;
      if (winner) { 
        status = 'Winner: ' + winner;
      } else {
          status =
          'Next player: ' +
          (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)} 
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  