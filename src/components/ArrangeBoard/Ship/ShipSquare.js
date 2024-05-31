import {useId} from "react"

function ShipSquare({draggable, onDragStart, onDragEnd }) {
    return <div 
    className="single-ship-square"
    draggable={draggable}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    ></div>
}

export default ShipSquare