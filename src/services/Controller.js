import axios from 'axios';
import { Client } from '@stomp/stompjs';

const BASE_URL = 'http://localhost:8080';

const opponentNicknames = {}; 

const connectToSocket = (token, gameId, playerType, opponentNickname, navigate) => {
    console.log("connecting to the game");
    console.log("Token: "+token);
    const socket = new WebSocket(BASE_URL.replace('http', 'ws') + '/websocket');
    const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: {
            'Authorization': `Bearer ${token}`
        },
        onConnect: (frame) => {
            console.log('connected to the frame: ' + frame);
            console.log(gameId);
            console.log(playerType);
            navigate('/setup', { state: { gameId: gameId, type: playerType, opponentNickname: opponentNickname } });
            
            client.subscribe(`/topic/${gameId}/board/${playerType}`, (message) => {
                const data = JSON.parse(message.body);
                const board = data.board; 
                console.log(`board: ${board}`);
                navigate('/gamepage', { state: { gameId: gameId, type: playerType, board: board } });            
            });

            client.subscribe(`/topic/${gameId}/opponent/1`, (message) => {
                const data = JSON.parse(message.body);
                console.log("---Opponent received: ", data);
                const opponentNick = data.nickname;
                opponentNicknames[gameId] = opponentNick;  
            });
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        }
    });

    client.activate();
}

export const getOpponentName = (gameId) => {
    return opponentNicknames[gameId] ? opponentNicknames[gameId] : "ROBOT"
}

export const connectToGame = async (token, mode, navigate) => {
    let nickname = document.getElementById("nickname").value;
    let gameId;
    let playerType;
    let opponentNickname;
    if (nickname == null || nickname === '') {
        alert("Please enter your nickname");
    } else {
        try {
            console.log(BASE_URL + "/post/connect")
            console.log("Token: "+token);
            const response = await axios.post(BASE_URL + "/post/connect", {
                player: { nickname: nickname },
                mode: mode
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = response.data;
            gameId = data.gameID;
            playerType = data.playerType;
            opponentNickname = data.opponent ? data.opponent.nickname : undefined;
            console.log(gameId);
            console.log(playerType);
            connectToSocket(token,gameId, playerType, opponentNickname, navigate);
        } catch (error) {
            console.log(error);
        }
    }
}

export const postBoard = async (token,board, gameId, playerType) => {
    try {
        console.log("Token: "+token);
        console.log(`${BASE_URL}/post/board`)
        const response = await axios.post(`${BASE_URL}/post/board`, {
            board: board,
            gameID: gameId,
            playerType: playerType
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

export const makeMove = async (token,gameId, playerType, rowIndex, colIndex) => {
    try {
        console.log("Token: "+token);
        const response = await axios.post(`${BASE_URL}/post/move`, {
            coord: {
                x: colIndex, 
                y: rowIndex, 
            },
            playerType: playerType,
            gameID: gameId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = response.data;
        console.log("CONTROLLER perform move");
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
};
