import React, { useState, useImperativeHandle, forwardRef } from 'react';
import '../PlayersBoard.css';
import OpponentBoardField from './OpponentBoardField';
import CellCategory from '../CellCategories';


function OpponentBoard ({playerBoard, performMove, moveResults}) {
    const boardSize = 10;
    const letterCoordinatesStart = 65;

    const initialBoard = [ //Treat this board as a mockup
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null]
      ];

    const letterCoordinates = Array(boardSize).fill(null).map((_, index) => String.fromCharCode(letterCoordinatesStart + index));

   

    const boardToPlayerBoard = (board) => {
      return board.map(row => row.map(cell => {
        if (cell === 1) {
            return CellCategory.SHIP;
        }
        return CellCategory.EMPTY;
      }))
    };

  
    const [board, setBoard] = useState(boardToPlayerBoard(initialBoard));
    const [shipsNumber, setShipsNumber] = useState(5);

    return (
        <>
        <div className="board">
            <table className='board-table'>
                <tbody>
                    <tr className='axes-description'>
                        <td key={"empty-field"}></td>
                        {letterCoordinates.map((letter, rowIndex) => <td key={rowIndex + 1}>{letter}</td>)}
                    </tr>
                    {board.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className='axes-description' key={rowIndex}>{rowIndex + 1}</td>
                            {row.map((cell, colIndex) => (
                                <OpponentBoardField
                                    key={colIndex}
                                    cell={cell}
                                    colIndex={colIndex}
                                    rowIndex={rowIndex}
                                    onClickAction={()=>performMove(rowIndex,colIndex)}
                                    result={moveResults[`${rowIndex}-${colIndex}`]}

                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <h1 className='board-title'>{`${shipsNumber} ALIVE SHIPS`}</h1>
        </>
    );
};

export default OpponentBoard;
