import PlayerBoard from './PlayerBoard/Index';
import "./GamePage.css";
import OpponentBoard from './OpponentBoard/Index';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs'; 

const BASE_URL = 'http://localhost:8080';

function GamePage() {
    const location = useLocation();
    const [playerBoard, setPlayerBoard] = useState(location.state ? location.state.board : Array(10).fill(Array(10).fill(0)));
    const [gameId, setGameId] = useState(location.state ? location.state.gameId : null);
    const [playerType, setPlayerType] = useState(location.state ? location.state.playerType : null);

    const opponentNicknameMock = "Kamil";

    useEffect(() => {
        if (location.state && location.state.board) {
            setPlayerBoard(location.state.board);
            setGameId(location.state.gameId);
            setPlayerType(location.state.type);
        }
    }, [location.state]);


    const [moveResults, setMoveResults] = useState({}); 

    useEffect(() => {
        const socket = new WebSocket(BASE_URL.replace('http', 'ws') + '/websocket');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: (frame) => {
                console.log('connected to the frame: ' + frame);
                client.subscribe(`/topic/${gameId}/${playerType}`, (message) => {
                    const data = JSON.parse(message.body);
                    console.log("Move update received: ", data);
                    const rowIndex = data.coord.y;
                    const colIndex = data.coord.x;
                    setMoveResults(prevMoveResults => ({ ...prevMoveResults, [`${rowIndex}-${colIndex}`]: data.result }));
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            }
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [gameId, playerType]); 

    return (
        <div className='main-page-color'>
            <h1 className='header-container'>Your turn!</h1>
            <div className="boards-container">
                <div className="board-section">
                    <h1 className='board-title'>Player board</h1>
                    <PlayerBoard playerBoard={playerBoard} moveResults={moveResults}/>
                </div>
                <div className="board-section">
                    <h1 className='board-title'>{`${opponentNicknameMock}'s board`}</h1>
                    <OpponentBoard board={null} gameId={gameId} playerType={playerType}/>
                </div>
            </div>
        </div>
    );
}

export default GamePage;
