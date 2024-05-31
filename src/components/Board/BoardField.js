import React from 'react';
import './Board.css';

function BoardField({ cell, colIndex, rowIndex, onDrop, onHighlight, onUnhighlight, isHighlighted, isValidPlacement, setShipsCount, onDragStart, onClick }) {

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!isValidPlacement) {
            return;
        }
        const shipLength = parseInt(e.dataTransfer.getData("widgetType"), 10);
        const orientation = e.dataTransfer.getData("orientation") || 'horizontal';
        onHighlight(rowIndex, colIndex, shipLength, orientation);
    };

    const handleDragLeave = () => {
        onUnhighlight();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (!isValidPlacement) {
            return;
        }
        const shipLength = parseInt(e.dataTransfer.getData("widgetType"), 10);
        const orientation = e.dataTransfer.getData("orientation") || 'horizontal';
        onDrop(rowIndex, colIndex, shipLength, orientation);
        setShipsCount(prevShipsCount => {
            const newShipCount = { ...prevShipsCount };
            if (newShipCount[shipLength] > 0) {
                newShipCount[shipLength] -= 1;
            }
            return newShipCount;
        });
    };

    const handleDragStart = (e) => {
        if (cell === '1') {
            const [length, orientation] = onDragStart(rowIndex, colIndex);
            e.dataTransfer.setData("widgetType", length);
            e.dataTransfer.setData("orientation", orientation);
        }
    };

    const handleClick = () => {
        if (cell === '1') {
            onClick(rowIndex, colIndex);
        }
    };

    const getClassName = () => {
        if (isHighlighted) {
            return `table-field ${isValidPlacement ? 'drag-over' : 'invalid-drag-over'}`;
        }

        if (cell === '1') {
            return `table-field ship`;
        }

        return `table-field`;
    };

    return (
        <td
            className={getClassName()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable={cell === '1'}
            onDragStart={handleDragStart}
            onClick={handleClick}
        >
            {null}
        </td>
    );
}

export default BoardField;
