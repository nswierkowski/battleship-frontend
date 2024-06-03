import PlayerBoard from './PlayerBoard/Index'
import "./GamePage.css"
import OpponentBoard from './OpponentBoard/Index';

function GamePage({playerBoard, opponentBoard, opponentNickname}) {

    const playerBoardMock = playerBoard;
    const opponentBoardMock = opponentBoard;
    const opponentNicknameMock = "Kamil";

    return <div className='main-page-color'>
        <h1 className='header-container'>Your turn!</h1>
        <div className="boards-container">
            <div className="board-section">
                <h1 className='board-title'>Player board</h1>
                <PlayerBoard board={playerBoard}/>
            </div>
            <div className="board-section">
                <h1 className='board-title'>{`${opponentNicknameMock}'s board`}</h1>
                <OpponentBoard board={playerBoard}/>
            </div>
        </div>
    </div>

}

export default GamePage;