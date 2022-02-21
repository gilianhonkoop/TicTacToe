import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//row x column
const BOARDIMENSIONS = [3, 3]


function Square(props) {
    if(props.highlight) {
      return (
        <button className="highlight" onClick={props.onClick}>
            {props.value}
        </button>
      );
    }

    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}  
  
  class Board extends React.Component {
    renderSquare(i) {
      var highlight = null;
      for (let j = 0; j < 3; j++) {
        var check;
        if(this.props.winningsquaresarr) {
          if (i == this.props.winningsquaresarr[j]) {
            highlight = true;
          }
        }
      }

      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            key={i}
            highlight={highlight}
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
            order: 'Asc',
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
      var winner = calculateWinner(current.squares);
      var winningsquares;
      
      if(winner && winner != 'draw') {
        winningsquares = winner[1];
        winner = winner[0];
      }

      var moves = history.map((step, move) => {
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

      var movesordered = moves;

      if (this.state.order === 'Desc') {
        var movesordered = moves.slice(0).reverse();
      }

      let status;
      if (winner && winner !== 'draw') { 
        status = 'Winner: ' + winner;
      } 
      else if (winner == 'draw') {
        status = 'The game has ended in a draw!'
      } 
      else {
          status =
          'Next player: ' +
          (this.state.xIsNext ? 'X' : 'O');
      }

      const toggle = (
        <ul>
          <button onClick={() => {
            this.state.order === 'Asc' ? this.setState({order: 'Desc'}) : this.setState({order: 'Asc'});
          }}>
            <span>Toggle order </span>
            <span style={this.state.order === 'Asc' ? {fontWeight: '600'} : {fontWeight: '300'}}>Asc</span>
            /
            <span style={this.state.order === 'Desc' ? {fontWeight: '600'} : {fontWeight: '300'}}>Desc</span>
          </button>
        </ul>
      );

      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)} 
                winningsquaresarr={winningsquares}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div>{toggle}</div>
            <ol>{movesordered}</ol>
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
    var result = 'draw';
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], lines[i]];
      }
    }

    for (let i = 0; i < Object.keys(squares).length; i++) {
      if (Object.entries(squares)[i][1] == null) {
        result = null;
      }
    }

    return result;
  }
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  