import Board from "../Board/Index";
import "./ArrangeBoard.css";
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import AvalaibleShips from "./AvalaibleShips/Index";
import { useLocation, useNavigate } from 'react-router-dom';
import { postBoard } from "../../services/Controller";
import ModulPopup from "../ModulPopup/Index";
import { fetchAuthSession } from 'aws-amplify/auth';

function ArrangeBoard() {
    const shipsDefaultCount = {
        2: 1,
        3: 2,
        4: 1,
        5: 1,
    };

    const [shipsCount, setShipsCount] = useState(shipsDefaultCount);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const boardRef = useRef();
    const navigate = useNavigate();

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

    const boardToSendingFormat = () => {
        return boardRef.current.getBoard().map((row) =>
            row.map((cell) => (cell === '1' ? 1 : 0))
        );
    };

    const playButtonClick = async () => {
        if (Object.values(shipsCount).reduce((total, count) => total + count, 0) !== 0) {
            setIsModalOpen(true);
            return;
        }

        const gameId = location.state.gameId;
        const playerType = location.state.type;
        const opponentNickname = location.state.opponentNickname;
        const board = boardToSendingFormat();

        console.log(`ARRANGE BOARD GAME ID: ${location.state.gameId}`);
        console.log(`ARRANGE BOARD Player type: ${location.state.type}`);

        try {
            const gameReady = await postBoard(jwtToken,board, gameId, playerType);
            console.log(`Game ready: ${gameReady}`);
            if (gameReady === undefined) {
                alert("Website failed. Try refresh");
            } else if (gameReady) {
                navigate("../gamepage", {
                    replace: true,
                    state: { gameId: gameId, type: playerType, board: board, opponentNickname: opponentNickname }
                });
            } else {
                navigate("../waiting-room", {
                    replace: true,
                });
            }
        } catch (error) {
            console.error("Error posting board:", error);
            alert("An error occurred. Please try again.");
        }
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

    const closeModal = () => {
        setIsModalOpen(false);
    };

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
            {isModalOpen && (
                <ModulPopup onClose={closeModal} buttonName={"Close"}>
                    <h2 className="description-text">Please place all ships on the board before proceeding.</h2>
                </ModulPopup>
            )}
        </div>
    );
};

export default ArrangeBoard;
