import React, { useState } from 'react';
import './Board.css'; 
import BoardRow from './BoardRow'

function Board() {
  const boardSize = 10;
  const letterCoordinatesStart = 65;

  const initialBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
  const letterCoordinates = Array(boardSize).fill(null).map((_, index) => String.fromCharCode(letterCoordinatesStart+index));


  const [board, setBoard] = useState(initialBoard);


  return (
    <div className="board">
      <table className='board-table'>
        <tbody>
          <tr className='axes-description'>
            <td key={"Empty-Field"}></td>
            {letterCoordinates.map((letter, rowIndex) => <td key={rowIndex+1}>{letter}</td>)}
          </tr>
          {board.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className='axes-description' key={rowIndex}>{rowIndex+1}</td>
                <BoardRow row={row} />
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Board;
