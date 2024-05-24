
import React, { useEffect } from 'react';
import './HomePage.css'
import StartGamePanel from './StartGamePanel';
import Ranking from './Ranking';


function HomePage() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css?family=Bangers';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

  }, []);

    return(
        <body class="homepage">
            <div>
                <h1>Battleship online</h1>
            </div>
            <div id="start-panels-container">
            <div id="start-panels">
                <StartGamePanel/>
                <hr class="vertical-line"/>
                <Ranking/>
            </div>
            </div>
        </body>
    );
};

export default HomePage;