import React, { useState, useEffect } from 'react';
import '../PlayersBoard.css';
import PlayerBoardField from './PlayerBoardField';
import CellCategory from '../CellCategories';


function PlayerBoard({ playerBoard, moveResults, currentShipsNumber}) {
    const boardSize = 10;
    const letterCoordinatesStart = 65;

    const letterCoordinates = Array(boardSize).fill(null).map((_, index) => String.fromCharCode(letterCoordinatesStart + index));

    const boardToPlayerBoard = (board) => {
        return board.map(row => row.map(cell => {
            if (cell === 1) {
                return CellCategory.SHIP;
            }
            return CellCategory.EMPTY;
        }));
    };

    const [board, setBoard] = useState(boardToPlayerBoard(playerBoard));
   

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
                                    <PlayerBoardField
                                        key={colIndex}
                                        cell={cell}
                                        colIndex={colIndex}
                                        rowIndex={rowIndex}
                                        result={moveResults[`${rowIndex}-${colIndex}`]}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h1 className='board-title'>{`${currentShipsNumber} ALIVE SHIPS`}</h1>
        </>
    );
}

export default PlayerBoard;
