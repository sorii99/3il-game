import { useState } from "react";
import confetti from "canvas-confetti";
import { Square } from './components/Square';
import { TURNS } from './model/turnModel';
import { checkWinner, checkEndGame } from "./logic/board";
import { WinnerModal } from './components/WinnerModal';
import { saveGame, reset } from './logic/storage/index';

function App() {

  const [board, setBoard] = useState(() => {
    const boardStorage = window.localStorage.getItem('board');
    return boardStorage ? JSON.parse(boardStorage) : Array(9).fill(null)
  });

  const [turn, setTurn] = useState(() => {
    const turnStorage = window.localStorage.getItem('turn');
    return turnStorage ?? TURNS.X
  });

  const [winner, setWinner] = useState(null);

  const updateBoard = (index) => {
    if (board[index] || winner) return

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    saveGame({
      board: newBoard,
      turn: newTurn
    });

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    reset();
  }

  return (
    <main className="board">
      <h1>TIC TAC TOE</h1>
      <button onClick={resetGame}>Reset</button>

      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal
        winner={winner}
        resetGame={resetGame}
      />

    </main>
  )
}

export default App
