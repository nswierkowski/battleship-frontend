import PlayerBoard from './PlayerBoard/Index';
import "./GamePage.css";
import OpponentBoard from './OpponentBoard/Index';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs'; 
import { makeMove, getOpponentName } from '../../services/Controller';
import ModulPopup from '../ModulPopup/Index';
import { fetchAuthSession } from 'aws-amplify/auth';

const BASE_URL = 'http://localhost:8080';

function GamePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [playerBoard, setPlayerBoard] = useState(location.state ? location.state.board : Array(10).fill(Array(10).fill(0)));
    const [gameId, setGameId] = useState(location.state ? location.state.gameId : null);
    const [playerType, setPlayerType] = useState(location.state ? location.state.playerType : null);
    const [isWinningModalOpen, setIsWinningModalOpen] = useState(false);
    const [isLosingModalOpen, setIsLosingModalOpen] = useState(false);

    const defaultShipsNumber = 5;
    const [playerShipsNumber, setPlayerShipsNumber] = useState(defaultShipsNumber);
    const [opponentShipsNumber, setOpponentShipsNumber] = useState(defaultShipsNumber);

    const [opponentNick, setOpponentNick] = useState("Opponent");
    const opponentNicknameMock = "Kamil";

    const [myTurn, setMyTurn] = useState(playerType === "1");
    const [opponentMoveResults, setOpponentMoveResults] = useState({});
    const [moveResults, setMoveResults] = useState({});
    const moveQueue = useRef([]);

    const [jwtToken, setJwtToken] = useState('');

    useEffect(() => {
        const fetchToken = async () => {
          try {
            const {
                tokens,
                credentials,
                identityId,
                userSub
              } = await fetchAuthSession();
            
              const {
                idToken,
                accessToken
              } = tokens;
            setJwtToken(idToken);
          } catch (error) {
            console.error('Error fetching JWT token:', error);
          }
        };
    
        fetchToken();
      }, []);

    useEffect(() => {
        if (location.state && location.state.board) {
            setPlayerBoard(location.state.board);
            setGameId(location.state.gameId);
            setPlayerType(location.state.type);
            console.log(`playerType ${location.state.type}`);

            setMyTurn(location.state.type == 1);
        }
        if (location.state.opponentNickname) {
            setOpponentNick(location.state.opponentNickname);
        } else {
            setOpponentNick(getOpponentName(gameId));
        }
    }, [location.state]);


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
                    moveQueue.current.push(() => handleWebSocketUpdate(data));
                    processQueue();
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

    const handleWebSocketUpdate = (data) => {
        const rowIndex = data.coord.y;
        const colIndex = data.coord.x;
        console.log(`Opponent move ${rowIndex} ${colIndex}`);
        const sunk = data.sunk;
        const gameStatus = data.gameStatus;
        setOpponentMoveResults(prevMoveResults => ({ ...prevMoveResults, [`${rowIndex}-${colIndex}`]: data.result }));
        setMyTurn(true);

        if (sunk) {
            setPlayerShipsNumber(playerShipsNumber => playerShipsNumber - 1);
        }

        if (gameStatus) {
            isPopupNeeded(gameStatus);
        }
    };

    const performMove = async (rowIndex, colIndex) => {
        if (myTurn) {
            console.log(`perform move Opponent Board ${rowIndex}, ${colIndex}`);
            setMyTurn(false);

            const moveResponse = await makeMove(jwtToken, gameId, playerType, rowIndex, colIndex);
            moveQueue.current.push(() => handleMoveResponse(rowIndex, colIndex, moveResponse));
            processQueue();
        } else {
            console.log("Not your turn");
        }
    };

    const handleMoveResponse = (rowIndex, colIndex, moveResponse) => {
        const newResults = { ...moveResults, [`${rowIndex}-${colIndex}`]: moveResponse.result };
        setMoveResults(newResults);

        if (moveResponse.sunk) {
            setOpponentShipsNumber(opponentShipsNumber => opponentShipsNumber - 1);
        }

        if (moveResponse.gameStatus) {
            isPopupNeeded(moveResponse.gameStatus);
        }
    };

    const processQueue = () => {
        while (moveQueue.current.length > 0) {
            const nextAction = moveQueue.current.shift();
            nextAction();
        }
    };

    const isPopupNeeded = (gameStatus) => {
        switch (gameStatus) {
            case playerType:
                setIsWinningModalOpen(true);
                break;
            case (3 - playerType):
                setIsLosingModalOpen(true);
                break;
        }
    };

    const closeModal = () => {
        navigate("../");
    };

    return (
        <div className='main-page-color'>
            <h1 className='header-container'>{myTurn ? "Your turn!" : "Opponent turn!"}</h1>
            <div className="boards-container">
                <div className="board-section">
                    <h1 className='board-title'>Player board</h1>
                    <PlayerBoard playerBoard={playerBoard} moveResults={opponentMoveResults} currentShipsNumber={playerShipsNumber}/>
                </div>
                <div className="board-section">
                    <h1 className='board-title'>{`${opponentNick}'s board`}</h1>
                    <OpponentBoard board={null} performMove={performMove} moveResults={moveResults} currentShipsNumber={opponentShipsNumber}/>
                </div>
            </div>
            {isWinningModalOpen && (
                <ModulPopup onClose={closeModal} buttonName={"Back"}>
                    <h2 className="description-text">Congratulations, you won!</h2>
                </ModulPopup>
            )}
            {isLosingModalOpen && (
                <ModulPopup onClose={closeModal} buttonName={"Back"}>
                    <h2 className="description-text">What a pity! You lost!</h2>
                </ModulPopup>
            )}
        </div>
    );
}

export default GamePage;
