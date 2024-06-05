import PlayerBoard from './PlayerBoard/Index';
import "./GamePage.css";
import OpponentBoard from './OpponentBoard/Index';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function GamePage() {
    const location = useLocation();
    const [playerBoard, setPlayerBoard] = useState(location.state ? location.state.board : Array(10).fill(Array(10).fill(0)));

    const opponentNicknameMock = "Kamil";

    useEffect(() => {
        if (location.state && location.state.board) {
            setPlayerBoard(location.state.board);
        }
    }, [location.state]);

    return (
        <div className='main-page-color'>
            <h1 className='header-container'>Your turn!</h1>
            <div className="boards-container">
                <div className="board-section">
                    <h1 className='board-title'>Player board</h1>
                    <PlayerBoard playerBoard={playerBoard} />
                </div>
                <div className="board-section">
                    <h1 className='board-title'>{`${opponentNicknameMock}'s board`}</h1>
                    <OpponentBoard board={null} />
                </div>
            </div>
        </div>
    );
}

export default GamePage;
