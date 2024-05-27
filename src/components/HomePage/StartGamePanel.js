import './HomePage.css'
import { BsPersonFill } from "react-icons/bs";
import { BsRobot } from "react-icons/bs";
import {Client} from '@stomp/stompjs';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

function StartGamePanel() {

    const connectToSocket = (gameId, playerType) => {
        console.log("connecting to the game");
        const socket = new WebSocket(BASE_URL.replace('http', 'ws') + '/websocket');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: (frame) => {
                console.log('connected to the frame: ' + frame);
                console.log(gameId);
                console.log(playerType);
                /*
                client.subscribe(`/topic/${gameId}/board/${playerType}`, (message) => {
                    const data = JSON.parse(message.body);
                    console.log("Board update received: ", data);
                    //obsluga
                });

                client.subscribe(`/topic/${gameId}/${playerType}`, (message) => {
                    const data = JSON.parse(message.body);
                    console.log("Move update received: ", data);
                    //obsluga
                });*/
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            }
        });
    
        client.activate();
    }

    const connectToPlayer = () => {
        console.log("connecto to player started");
        connectToGame("PLAYER");
    }

    const connectToRobot = () => {
        console.log("connect to robot started");
        connectToGame("COMPUTER");
    }

    const connectToGame = async (mode) => {
        let nickname = document.getElementById("nickname").value;
        let gameId;
        let playerType;
        if (nickname == null || nickname === '') {
            alert("Please enter your nickname");
        } else {
            try {
                console.log(BASE_URL + "/post/connect")
                const response = await axios.post(BASE_URL + "/post/connect", {
                    player: {nickname: nickname},
                    mode: mode
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                const data = response.data;
                gameId = data.gameID;
                playerType = data.playerType;
                console.log(gameId);
                console.log(playerType);
                connectToSocket(gameId, playerType);
            } catch (error) {
                console.log(error);
            }
        }
    
    }

    return (
        <div className="homepage" id="start-game-panel">
            <input id="nickname" class="start-form-elem" placeholder="Enter your nickname"></input>
            <button className="start-form-elem" onClick={connectToPlayer}> <BsPersonFill className="icon"/><span>Play vs random player</span></button>
            <button className="start-form-elem" onClick={connectToRobot}> <BsRobot className="icon"/><span>Play vs robot</span></button>
        </div>
        
    );
};

export default StartGamePanel;