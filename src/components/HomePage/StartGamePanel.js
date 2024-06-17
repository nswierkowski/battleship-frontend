import './HomePage.css'
import { BsPersonFill } from "react-icons/bs";
import { BsRobot } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import {connectToGame} from '../../services/Controller';
import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const BASE_URL = 'http://localhost:8080';

function StartGamePanel() {

    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const navigate = useNavigate();
    const [jwtToken, setJwtToken] = useState('');

    const connectToPlayer = () => {
        console.log("connecto to player started");
        connectToGame(jwtToken,"PLAYER", navigate);
    }

    const connectToRobot = () => {
        console.log("connect to robot started");
        connectToGame(jwtToken,"COMPUTER", navigate);
    }

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

    return (
        <div className="homepage" id="start-game-panel">
            <input id="nickname" className="start-form-elem" value={user.username} disabled></input>
            <button className="start-form-elem" onClick={connectToPlayer}> <BsPersonFill className="icon"/><span>Play vs random player</span></button>
            <button className="start-form-elem" onClick={connectToRobot}> <BsRobot className="icon"/><span>Play vs robot</span></button>
        </div>
        
    );
};

export default StartGamePanel;