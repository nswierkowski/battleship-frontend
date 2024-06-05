import axios from 'axios';
import { Client } from '@stomp/stompjs';

const BASE_URL = 'http://localhost:8080';

const connectToSocket = (gameId, playerType, navigate) => {
    console.log("connecting to the game");
    const socket = new WebSocket(BASE_URL.replace('http', 'ws') + '/websocket');
    const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: (frame) => {
            console.log('connected to the frame: ' + frame);
            console.log(gameId);
            console.log(playerType);
            navigate('/setup', { state: { gameId: gameId, type: playerType } });
            
            client.subscribe(`/topic/${gameId}/board/${playerType}`, (message) => {
                const data = JSON.parse(message.body);
                const board = data.board; 
                console.log(`board: ${board}`);
                navigate('/gamepage', { state: { gameId: gameId, type: playerType, board: board } });            
            });

            /*
            client.subscribe(`/topic/${gameId}/${playerType}`, (message) => {
                const data = JSON.parse(message.body);
                console.log("Move update received: ", data);
                
            });*/
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        }
    });

    client.activate();
}

export const connectToGame = async (mode, navigate) => {
    let nickname = document.getElementById("nickname").value;
    let gameId;
    let playerType;
    if (nickname == null || nickname === '') {
        alert("Please enter your nickname");
    } else {
        try {
            console.log(BASE_URL + "/post/connect")
            const response = await axios.post(BASE_URL + "/post/connect", {
                player: { nickname: nickname },
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
            connectToSocket(gameId, playerType, navigate);
        } catch (error) {
            console.log(error);
        }
    }
}

export const postBoard = async (board, gameId, playerType) => {
    try {
        console.log(`${BASE_URL}/post/board`)
        const response = await axios.post(`${BASE_URL}/post/board`, {
            board: board,
            gameID: gameId,
            playerType: playerType
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;
        const gameReady = data.result;
        console.log(`CONTROLLER GAME ID ${gameId}`);
        console.log(`CONTROLLER Player type ${playerType}`);
        console.log(`CONTROLLER gameReady ${gameReady}`);
        return gameReady;
    } catch (error) {
        console.log(error);
        return undefined;
    }

   
}

export const makeMove = async (gameId, playerType, rowIndex, colIndex) => {
    try {
        const response = await axios.post(`${BASE_URL}/post/move`, {
            coord: {
                x: colIndex, 
                y: rowIndex, 
            },
            playerType: playerType,
            gameID: gameId
        });
        
        const data = response.data;
        console.log("CONTROLLER perform move");
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
};
