
import React, { useEffect } from 'react';
import './HomePage.css'
import StartGamePanel from './StartGamePanel';
import Ranking from './Ranking';


function HomePage() {
    return(
        <div className="homepage">
            <div>
                <h1>Battleship online</h1>
            </div>
            <div id="start-panels-container">
            <div id="start-panels">
                <StartGamePanel/>
                <hr className="vertical-line"/>
                <Ranking/>
            </div>
            </div>
        </div>
    );
};

export default HomePage;