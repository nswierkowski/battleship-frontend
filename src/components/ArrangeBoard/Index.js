import Board from "../Board/Index";
import "./ArrangeBoard.css"
import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import AvalaibleShips from "./AvalaibleShips/Index"

function ArrangeBoard() {
    const shipsDefaultCount = {
        2: 1,
        3: 2,
        4: 1,
        5: 1,
    };
    
    const [shipsCount, setShipsCount] = useState(shipsDefaultCount);
    const boardRef = useRef();

    const playButtonClick = () => {
        //TODO: SEND BOARD TO BACKEND
    }

    const handleReset = () => {
        setShipsCount(shipsDefaultCount);
        boardRef.current.resetBoard();
    }

    const handleRandomChoice = () => {
        const emptyShipsCount = Object.keys(shipsDefaultCount).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {});
    
        setShipsCount(emptyShipsCount);
        boardRef.current.resetBoard();
        boardRef.current.placeShipsRandomly();
    }

    return (
        <div className="main-page-container">
            <div key="header-container" className="header-container">
                <h1 className="arrange-board-header">ARRANGE YOUR BOARD</h1>
            </div>
            <div key="board-ship-panel-container" className="board-ship-container">
                <Board ref={boardRef} setShipsCount={setShipsCount} />
                <div className="space"></div>
                <div className="panel-container">
                    <div key={"buttons-to-random-choice-and-reset"} className="buttons-container">
                        <span className="clickable-text" onClick={handleRandomChoice}>RANDOM</span>
                        <span className="clickable-text" onClick={handleReset}>RESET</span>
                    </div>
                    <AvalaibleShips key={"avalaible-ships"} shipsCount={shipsCount} />
                    <div key="play-button-container" className="panel-container">
                        <button className="play-button" onClick={playButtonClick}>
                            Play <FontAwesomeIcon icon={faPlay} className="play-icon" />
                        </button>
                    </div>
                </div>
            </div>
            <div key="description-text-container" className="description-text-container">
                <h2 className="description-text">DRAG AND DROP THE SHIPS</h2>
                <h2 className="description-text">CLICK ON THE SHIP ON THE BOARD TO CHANGE DIRECTION</h2>
            </div>
        </div>
    );
};

export default ArrangeBoard;