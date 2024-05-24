import './HomePage.css'
import { BsPersonFill } from "react-icons/bs";
import { BsRobot } from "react-icons/bs";

function StartGamePanel() {
    return (
        <div className="homepage" id="start-game-panel">
            <input id="nickname" class="start-form-elem" placeholder="Enter your nickname"></input>
            <button className="start-form-elem"> <BsPersonFill className="icon"/><span>Play vs random player</span></button>
            <button className="start-form-elem"> <BsRobot className="icon"/><span>Play vs robot</span></button>
        </div>
        
    );
};

export default StartGamePanel;