import React, { useState, useImperativeHandle, forwardRef } from 'react';
import './Board.css';
import BoardField from './BoardField';

const Board = forwardRef(({ setShipsCount }, ref) =>  {
    const boardSize = 10;
    const letterCoordinatesStart = 65;

    const initialBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
    const letterCoordinates = Array(boardSize).fill(null).map((_, index) => String.fromCharCode(letterCoordinatesStart + index));

    const [board, setBoard] = useState(initialBoard);
    const [highlightedSquares, setHighlightedSquares] = useState([]);
    const [isValidPlacement, setIsValidPlacement] = useState(true);
    const [draggedShip, setDraggedShip] = useState(null);
    const [shipOrientations, setShipOrientations] = useState({});

    useImperativeHandle(ref, () => ({
        resetBoard() {
            setBoard(initialBoard);
            setHighlightedSquares([]);
            setIsValidPlacement(true);
            setDraggedShip(null);
            setShipOrientations({});
        },
        placeShipsRandomly() {
            const newBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));
            const orientations = {};

            const ships = [
                { length: 5, count: 1 },
                { length: 4, count: 1 },
                { length: 3, count: 2 },
                { length: 2, count: 1 }
            ];

            const getRandomInt = (max) => Math.floor(Math.random() * max);
            const isValidPosition = (row, col, length, orientation) => {
                for (let i = 0; i < length; i++) {
                    const newRow = row + (orientation === 'vertical' ? i : 0);
                    const newCol = col + (orientation === 'horizontal' ? i : 0);
                    if (newRow >= boardSize || newCol >= boardSize || newBoard[newRow][newCol] === '1') {
                        return false;
                    }
                    const adjacentCells = [
                        [newRow - 1, newCol - 1], [newRow - 1, newCol], [newRow - 1, newCol + 1],
                        [newRow, newCol - 1], [newRow, newCol + 1],
                        [newRow + 1, newCol - 1], [newRow + 1, newCol], [newRow + 1, newCol + 1]
                    ];
                    for (const [adjRow, adjCol] of adjacentCells) {
                        if (adjRow >= 0 && adjRow < boardSize && adjCol >= 0 && adjCol < boardSize && newBoard[adjRow][adjCol] === '1') {
                            return false;
                        }
                    }
                }
                return true;
            };

            ships.forEach(({ length, count }) => {
                for (let i = 0; i < count; i++) {
                    let placed = false;
                    while (!placed) {
                        const orientation = getRandomInt(2) === 0 ? 'horizontal' : 'vertical';
                        const row = getRandomInt(boardSize);
                        const col = getRandomInt(boardSize);
                        if (isValidPosition(row, col, length, orientation)) {
                            for (let j = 0; j < length; j++) {
                                const newRow = row + (orientation === 'vertical' ? j : 0);
                                const newCol = col + (orientation === 'horizontal' ? j : 0);
                                newBoard[newRow][newCol] = '1';
                            }
                            orientations[`${row}-${col}`] = orientation;
                            placed = true;
                        }
                    }
                }
            });

            setBoard(newBoard);
            setShipOrientations(orientations);
        }
    }));

    const handleDrop = (rowIndex, colIndex, widgetType) => {
        if (!isValidPlacement) {
            setShipsCount(prevShipsCount => {
                const newShipCount = { ...prevShipsCount };
                if (newShipCount[widgetType] > 0) {
                    newShipCount[widgetType] += 1;
                }
                return newShipCount;
            });

            setHighlightedSquares([]);
            setIsValidPlacement(true);
            return;
        }

        const newBoard = [...board];
        if (draggedShip) {
            const { row, col, length, orientation } = draggedShip;
            for (let i = 0; i < length; i++) {
                if (orientation === 'horizontal') {
                    newBoard[row][col + i] = null;
                } else {
                    newBoard[row + i][col] = null;
                }
            }
            setDraggedShip(null);
        }

        const orientation = draggedShip?.orientation || 'horizontal';
        for (let i = 0; i < widgetType; i++) {
            if (orientation === 'horizontal') {
                const newCol = colIndex + i;
                if (newCol < boardSize) {
                    newBoard[rowIndex][newCol] = '1';
                }
            } else {
                const newRow = rowIndex + i;
                if (newRow < boardSize) {
                    newBoard[newRow][colIndex] = '1';
                }
            }
        }

        setBoard(newBoard);
        setShipOrientations(prev => ({ ...prev, [`${rowIndex}-${colIndex}`]: orientation }));
        setHighlightedSquares([]);
        setIsValidPlacement(true);
    };

    const handleHighlight = (row, col, length, orientation = 'horizontal') => {
        const newHighlights = [];
        let isValid = true;

        for (let i = 0; i < length; i++) {
            const newRow = row + (orientation === 'vertical' ? i : 0);
            const newCol = col + (orientation === 'horizontal' ? i : 0);

            if (newRow >= boardSize || newCol >= boardSize || board[newRow][newCol] === '1' || isNeighborOccupied(newRow, newCol)) {
                isValid = false;
            }
            newHighlights.push({ row: newRow, col: newCol });
        }
        setHighlightedSquares(newHighlights);
        setIsValidPlacement(isValid);
    };

    const isNeighborOccupied = (row, col) => {
        const neighbors = [
            { row: row - 1, col },
            { row: row + 1, col },
            { row, col: col - 1 },
            { row, col: col + 1 },
            { row: row - 1, col: col - 1 },
            { row: row - 1, col: col + 1 },
            { row: row + 1, col: col - 1 },
            { row: row + 1, col: col + 1 }
        ];
        return neighbors.some(neighbor =>
            neighbor.row >= 0 && neighbor.row < boardSize &&
            neighbor.col >= 0 && neighbor.col < boardSize &&
            board[neighbor.row][neighbor.col] === '1'
        );
    };

    const handleUnhighlight = () => {
        setHighlightedSquares([]);
        setIsValidPlacement(true);
    };

    const isHighlighted = (row, col) => {
        return highlightedSquares.some(square => square.row === row && square.col === col);
    };

    const calculateShipLength = (row, col) => {
        let length = 0;
        let orientation = 'horizontal';
        let startRowCoordinate = row;
        let startColCoordinate = col;
        
        for (let i = col; i < boardSize && board[row][i] === '1'; i++) {
            length++;
        }
        for (let i = col - 1; i >= 0 && board[row][i] === '1'; i--) {
            length++;
            startColCoordinate = i;
        }
        
        if (length === 1) {
            length = 0;
            orientation = 'vertical';
            
            for (let i = row; i < boardSize && board[i][col] === '1'; i++) {
                length++;
            }
            for (let i = row - 1; i >= 0 && board[i][col] === '1'; i--) {
                length++;
                startRowCoordinate = i;
            }
            return [length, startRowCoordinate, col, orientation];
        }
        return [length, row, startColCoordinate, orientation];
    };

    const handleDragStart = (row, col) => {
        const [length, mainRow, mainCol, orientation] = calculateShipLength(row, col);
        setDraggedShip({ row: mainRow, col: mainCol, length, orientation });

        const newBoard = [...board];
        for (let i = 0; i < length; i++) {
            if (orientation === 'horizontal') {
                newBoard[mainRow][mainCol + i] = null;
            } else {
                newBoard[mainRow + i][mainCol] = null;
            }
        }
        setShipsCount(prevShipsCount => {
            const newShipCount = { ...prevShipsCount };
            newShipCount[length] += 1;
            return newShipCount;
        });
        setBoard(newBoard);

        return [length, orientation];
    };

    const handleClick = (row, col) => {
        const [length, mainRow, mainCol, orientation] = calculateShipLength(row, col);
        const newOrientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';

        const newBoard = [...board];
        for (let i = 0; i < length; i++) {
            if (orientation === 'horizontal') {
                newBoard[mainRow][mainCol + i] = null;
            } else {
                newBoard[mainRow + i][mainCol] = null;
            }
        }

        let canRotate = true;

        for (let i = 0; i < length; i++) {
            const newRow = mainRow + (newOrientation === 'vertical' ? i : 0);
            const newCol = mainCol + (newOrientation === 'horizontal' ? i : 0);
            if (newRow >= boardSize || newCol >= boardSize || newBoard[newRow][newCol] === '1' || isNeighborOccupied(newRow, newCol)) {
                canRotate = false;
                break;
            }
        }

        if (canRotate) {
            for (let i = 0; i < length; i++) {
                const newRow = mainRow + (newOrientation === 'vertical' ? i : 0);
                const newCol = mainCol + (newOrientation === 'horizontal' ? i : 0);
                newBoard[newRow][newCol] = '1';
            }
            setShipOrientations(prev => ({ ...prev, [`${mainRow}-${mainCol}`]: newOrientation }));
        } else {
            for (let i = 0; i < length; i++) {
                const newRow = mainRow + (orientation === 'vertical' ? i : 0);
                const newCol = mainCol + (orientation === 'horizontal' ? i : 0);
                newBoard[newRow][newCol] = '1';
            }
        }

        setBoard(newBoard);
    };

    return (
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
                                <BoardField
                                    key={colIndex}
                                    cell={cell}
                                    colIndex={colIndex}
                                    rowIndex={rowIndex}
                                    onDrop={handleDrop}
                                    onHighlight={handleHighlight}
                                    onUnhighlight={handleUnhighlight}
                                    isHighlighted={isHighlighted(rowIndex, colIndex)}
                                    isValidPlacement={isValidPlacement}
                                    setShipsCount={setShipsCount}
                                    onDragStart={handleDragStart}
                                    onClick={handleClick}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default Board;
