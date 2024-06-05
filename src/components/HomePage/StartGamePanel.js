import './HomePage.css'
import { BsPersonFill } from "react-icons/bs";
import { BsRobot } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import {connectToGame} from '../../services/Controller';

const BASE_URL = 'http://localhost:8080';

function StartGamePanel() {

    const navigate = useNavigate();

    const connectToPlayer = () => {
        console.log("connecto to player started");
        connectToGame("PLAYER", navigate);
    }

    const connectToRobot = () => {
        console.log("connect to robot started");
        connectToGame("COMPUTER", navigate);
    }

    return (
        <div className="homepage" id="start-game-panel">
            <input id="nickname" className="start-form-elem" placeholder="Enter your nickname"></input>
            <button className="start-form-elem" onClick={connectToPlayer}> <BsPersonFill className="icon"/><span>Play vs random player</span></button>
            <button className="start-form-elem" onClick={connectToRobot}> <BsRobot className="icon"/><span>Play vs robot</span></button>
        </div>
        
    );
};

export default StartGamePanel;