import React, { useEffect, useState } from 'react';
import axios from 'axios';



const BASE_URL = 'http://localhost:8080';

function Ranking() {
    
    const [rankingData, setRankingData] = useState([]);

    useEffect(() => {
        async function fetchRanking() {
            try {
                const response = await axios.get(`${BASE_URL}/get/ranking`);
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