import { useEffect, useState, useId } from "react";
import './Ship.css'
import ShipSquare from "./ShipSquare";
import PrefixShipSquare from "../AvalaibleShips/PrefixShipSquare";

function Ship({shipLength, additionalPrefix}) {
    const defaultShip = Array(shipLength).fill(null);
    const [ship, setShip] =  useState(defaultShip);

    if (additionalPrefix) {
        return <div className="ship-container">
            <PrefixShipSquare key={"prefix-element"} prefix={1}/>
            {ship.map((_, shipSquareIndex) => <div 
                className="single-ship-square"
                ></div>)}
        </div>;
    }

    return <div className="ship-container">
        {ship.map((_, shipSquareIndex) => <ShipSquare key={shipSquareIndex} shipLength={shipLength} />)}
    </div>;
}

export default Ship;    