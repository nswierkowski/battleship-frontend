import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';


const BASE_URL = 'http://localhost:8080';

function Ranking() {
    
    const [rankingData, setRankingData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRanking() {
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
                console.log("Token: "+idToken);

                const response = await axios.get(`${BASE_URL}/get/ranking`, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`
                    }

                });
                setRankingData(response.data);
              } catch (error) {
                console.error('Error fetching ranking:', error);
              }
        }

        fetchRanking();
    }, []);


    return (
        <div id="ranking">
            <h2>Top 10 players</h2>
            <table>
                <tbody>
                {rankingData.map((player, index) => (
                    <tr key={index}>
                    <td className='ranking-player'>{index + 1}. {player.player}</td>
                    <td className='ranking-wins'>{player.score} wins</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        
    );
};

export default Ranking;